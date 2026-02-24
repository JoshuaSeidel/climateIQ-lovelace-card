import { LitElement, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cardStyles } from "./styles";

/* ------------------------------------------------------------------ */
/*  Type definitions                                                   */
/* ------------------------------------------------------------------ */

interface CardConfig {
  type: string;
  title?: string;
  show_zones?: boolean;
  show_quick_actions?: boolean;
  show_override?: boolean;
  addon_slug?: string;
  /** Usernames allowed to make changes. If omitted or empty, card is read-only for everyone. */
  allowed_users?: string[];
}

interface ZoneData {
  id: string;
  name: string;
  current_temp: number | null;
  current_humidity: number | null;
  is_occupied: boolean | null;
}

interface SystemConfig {
  current_mode: string;
  name?: string;
}

interface OverrideState {
  /** Thermostat's current sensor reading — in user's display unit. */
  current_temp: number | null;
  /** Thermostat's actual setpoint (includes ClimateIQ offset compensation) — in user's display unit. */
  target_temp: number | null;
  hvac_mode: string;
  preset_mode: string | null;
  is_override_active: boolean;
  /**
   * ClimateIQ's own desired temperature from the active schedule DB record —
   * already in user's display unit. This is what ClimateIQ wants the rooms
   * to reach, BEFORE offset compensation is applied to the thermostat.
   * null when no schedule is active.
   */
  schedule_target_temp: number | null;
  /** Average of live zone sensor temps for the active schedule's zones — user's display unit. */
  schedule_avg_temp: number | null;
}

interface ActiveSchedule {
  active: boolean;
  schedule: {
    schedule_id: string;
    schedule_name: string;
    /** UUIDs of zones in this schedule. Empty array means all zones. */
    zone_ids: string[];
    zone_names: string[];
    target_temp_c: number;
    hvac_mode: string;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Card registration for HA picker                                    */
/* ------------------------------------------------------------------ */

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "climateiq-card",
  name: "ClimateIQ Card",
  description: "AI-powered climate management dashboard card",
});

/* ------------------------------------------------------------------ */
/*  ClimateIQ Card                                                     */
/* ------------------------------------------------------------------ */

@customElement("climateiq-card")
export class ClimateIQCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass: any;

  @state() private _config!: CardConfig;
  @state() private _zones: ZoneData[] = [];
  @state() private _systemConfig: SystemConfig | null = null;
  @state() private _override: OverrideState | null = null;
  @state() private _activeSchedule: ActiveSchedule | null = null;
  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _overrideTemp: number | null = null;

  private _refreshInterval: number | undefined;
  private _addonSlug = "local_climateiq";
  private _ingressBase = "";
  private _ingressResolved = false;
  private _ingressSession = "";

  /* ---- Configuration ---- */

  public setConfig(config: CardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = {
      title: "ClimateIQ",
      show_zones: true,
      show_quick_actions: true,
      show_override: true,
      ...config,
    };
    if (config.addon_slug) {
      this._addonSlug = config.addon_slug;
    }
  }

  public getCardSize(): number {
    let size = 3; // header + thermostat
    if (this._config?.show_override) size += 2;
    if (this._config?.show_zones && this._zones.length) size += this._zones.length;
    if (this._config?.show_quick_actions) size += 2;
    return size;
  }

  /* ---- Lifecycle ---- */

  connectedCallback(): void {
    super.connectedCallback();
    this._startRefresh();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopRefresh();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has("hass") && this.hass && !this._ingressResolved) {
      this._resolveIngress();
    }
  }

  /* ---- Ingress resolution ---- */

  private async _resolveIngress(): Promise<void> {
    if (this._ingressResolved) return;

    // Step 1: Create an ingress session and set it as a cookie.
    // callWS with supervisor/api unwraps the Supervisor envelope, so the
    // response is { session: string } directly (not { data: { session } }).
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionResult: any = await this.hass.callWS({
        type: "supervisor/api",
        endpoint: "/ingress/session",
        method: "post",
      });
      if (sessionResult?.session) {
        this._ingressSession = sessionResult.session;
        document.cookie = `ingress_session=${sessionResult.session};path=/api/hassio_ingress/;SameSite=Strict${location.protocol === "https:" ? ";Secure" : ""}`;
      }
    } catch {
      // Session creation failed; continue — a pre-existing cookie may still work
    }

    // Step 2: Resolve the correct addon slug.
    // If the user explicitly set addon_slug in card config, use it directly.
    // Otherwise auto-discover by listing all installed addons and finding the
    // one whose slug contains "climateiq" (case-insensitive) or whose name
    // matches. Local addons always have slug prefix "local_".
    const configuredSlug = this._config?.addon_slug;
    if (!configuredSlug) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addonList: any = await this.hass.callWS({
          type: "supervisor/api",
          endpoint: "/addons",
          method: "get",
        });
        const addons: any[] = addonList?.addons ?? [];
        // Prefer an exact slug match on known candidates, then fall back to
        // a case-insensitive substring search on slug or name.
        const match =
          addons.find((a) => a.slug === "local_climateiq") ||
          addons.find((a) => /climateiq/i.test(a.slug)) ||
          addons.find((a) => /climateiq/i.test(a.name ?? ""));
        if (match) {
          this._addonSlug = match.slug;
        } else {
          // No match — surface a helpful error listing local addons
          const localSlugs = addons
            .filter((a) => a.slug?.startsWith("local_"))
            .map((a) => `${a.slug} (${a.name})`)
            .join(", ");
          this._ingressResolved = true;
          this._loading = false;
          this._error = localSlugs
            ? `ClimateIQ addon not found. Set addon_slug in card config. Local addons found: ${localSlugs}`
            : "ClimateIQ addon not found and no local addons are installed. Set addon_slug in card config.";
          return;
        }
      } catch {
        // Addon list unavailable — fall through and try the default slug
      }
    }

    // Step 3: Fetch the addon info to get the real ingress_url.
    // The ingress proxy URL uses an ingress_token (random hash), NOT the slug.
    // e.g. /api/hassio_ingress/<token>/ — the slug-based URL does not work.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addonInfo: any = await this.hass.callWS({
        type: "supervisor/api",
        endpoint: `/addons/${this._addonSlug}/info`,
        method: "get",
      });
      if (addonInfo?.ingress_url) {
        // ingress_url already includes the trailing slash, e.g. /api/hassio_ingress/<token>/
        // Strip the trailing slash so our path concatenation stays consistent.
        this._ingressBase = addonInfo.ingress_url.replace(/\/$/, "");
      }
    } catch {
      // Addon info unavailable — leave _ingressBase empty so _fetchAll shows an error
    }

    this._ingressResolved = true;
    this._fetchAll();
  }

  /** Refresh the ingress session cookie before it expires (15-min TTL). */
  private async _refreshIngressSession(): Promise<void> {
    if (!this._ingressSession) return;
    try {
      await this.hass.callWS({
        type: "supervisor/api",
        endpoint: "/ingress/validate_session",
        method: "post",
        data: { session: this._ingressSession },
      });
    } catch {
      // Session expired — create a new one
      this._ingressResolved = false;
      this._ingressSession = "";
      this._resolveIngress();
    }
  }

  /* ---- Data fetching ---- */

  private async _fetchApi<T>(path: string): Promise<T> {
    if (!this._ingressBase) {
      throw new Error("Ingress not resolved");
    }
    const url = `${this._ingressBase}/api/v1${path}`;
    // Ingress requests are authenticated by the ingress_session cookie set in
    // _resolveIngress(). Do NOT send an Authorization header — the ingress proxy
    // does not accept HA long-lived tokens; it validates the session cookie.
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }
    return response.json();
  }

  private async _postApi<T>(path: string, body: Record<string, unknown>): Promise<T> {
    if (!this._ingressBase) {
      throw new Error("Ingress not resolved");
    }
    const url = `${this._ingressBase}/api/v1${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }
    return response.json();
  }

  private async _fetchAll(): Promise<void> {
    if (!this.hass || !this._ingressBase) return;
    // Keep the ingress session alive (TTL is 15 min; we poll every 30 s).
    this._refreshIngressSession();
    try {
      const [zones, config, override, activeSchedule] = await Promise.all([
        this._fetchApi<ZoneData[]>("/zones").catch(() => []),
        this._fetchApi<SystemConfig>("/system/config").catch(() => null),
        this._fetchApi<OverrideState>("/system/override").catch(() => null),
        this._fetchApi<ActiveSchedule>("/schedule/active").catch(() => null),
      ]);
      this._zones = zones;
      this._systemConfig = config;
      // If the active schedule changed, reset the override control so it
      // re-seeds from the new schedule's target rather than the old value.
      const prevSchedId = this._activeSchedule?.schedule?.schedule_id ?? null;
      const nextSchedId = activeSchedule?.schedule?.schedule_id ?? null;
      if (prevSchedId !== nextSchedId) {
        this._overrideTemp = null;
      }
      this._override = override;
      this._activeSchedule = activeSchedule;

      // Seed the override control from schedule_target_temp (ClimateIQ's desired
      // temp, already in user's display unit, pre-offset). Falls back to the
      // thermostat setpoint only when no schedule is active.
      // Only seed once — don't overwrite a value the user is actively adjusting.
      if (this._overrideTemp == null) {
        this._overrideTemp = override?.schedule_target_temp ?? override?.target_temp ?? null;
      }
      this._loading = false;
      this._error = null;
    } catch (err: unknown) {
      this._loading = false;
      this._error =
        err instanceof Error ? err.message : "Failed to connect to ClimateIQ add-on";
    }
  }

  private _startRefresh(): void {
    this._stopRefresh();
    this._refreshInterval = window.setInterval(() => this._fetchAll(), 30_000);
  }

  private _stopRefresh(): void {
    if (this._refreshInterval != null) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = undefined;
    }
  }

  /* ---- Actions ---- */

  private async _handleQuickAction(action: string): Promise<void> {
    if (!this._canControl) return;
    try {
      await this._postApi("/system/quick-action", { action });
      // Refresh after action
      setTimeout(() => this._fetchAll(), 500);
    } catch {
      // Silently fail — next refresh will show current state
    }
  }

  private _handleTempAdjust(delta: number): void {
    if (!this._canControl) return;
    if (this._overrideTemp == null) {
      this._overrideTemp =
        this._override?.schedule_target_temp ?? this._override?.target_temp ?? 72;
    }
    this._overrideTemp = Math.round((this._overrideTemp + delta) * 10) / 10;
  }

  private async _handleOverrideSubmit(): Promise<void> {
    if (!this._canControl || this._overrideTemp == null) return;
    try {
      await this._postApi("/system/override", { temperature: this._overrideTemp });
      setTimeout(() => this._fetchAll(), 500);
    } catch {
      // Silently fail
    }
  }

  /* ---- Helpers ---- */

  /**
   * Returns true if the current HA user is allowed to make changes.
   * Control is granted when:
   *   - allowed_users is not configured (empty/omitted) → read-only for everyone
   *   - the current user's name (case-insensitive) is in the allowed_users list
   *   - the current user is a HA admin (admins always retain control)
   */
  private get _canControl(): boolean {
    const allowed = this._config?.allowed_users;
    if (!allowed || allowed.length === 0) return false;
    const user = this.hass?.user;
    if (!user) return false;
    if (user.is_admin) return true;
    const name = (user.name ?? "").toLowerCase();
    return allowed.some((u) => u.toLowerCase() === name);
  }

  /**
   * Returns "°C" or "°F" based on the HA unit system.
   * hass.config.unit_system.temperature is already the full string ("°C" / "°F"),
   * so we use it directly. We also accept bare "C"/"F" for robustness.
   */
  private get _tempUnit(): "°C" | "°F" {
    const raw = this.hass?.config?.unit_system?.temperature ?? "";
    return raw.includes("C") ? "°C" : "°F";
  }

  /**
   * Convert a Celsius value to the display unit.
   * Zone sensor readings from the backend are always stored and returned in °C.
   * The override endpoint already returns values in the user's display unit,
   * so only zone temps need this conversion.
   */
  private _celsiusToDisplay(celsius: number | null | undefined): number | null {
    if (celsius == null) return null;
    if (this._tempUnit === "°F") return celsius * 9 / 5 + 32;
    return celsius;
  }

  private _formatTemp(value: number | null | undefined): string {
    if (value == null) return "--";
    return Math.round(value).toString();
  }

  private _modeLabel(mode: string | undefined): string {
    if (!mode) return "Unknown";
    const labels: Record<string, string> = {
      learn: "Learning",
      scheduled: "Scheduled",
      follow_me: "Follow Me",
      active: "Active",
    };
    return labels[mode] || mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  /* ---- Render ---- */

  protected render() {
    if (!this._config) return nothing;

    return html`
      <ha-card>
        ${this._renderHeader()}
        ${this._loading
          ? this._renderLoading()
          : this._error
            ? this._renderError()
            : this._renderContent()}
      </ha-card>
    `;
  }

  private _renderHeader() {
    const mode = this._systemConfig?.current_mode;
    return html`
      <div class="ciq-header">
        <span class="ciq-title">${this._config.title}</span>
        <div style="display:flex;align-items:center;gap:8px">
          ${mode
            ? html`<span class="ciq-mode-badge">${this._modeLabel(mode)}</span>`
            : nothing}
          ${!this._canControl
            ? html`<span class="ciq-readonly-badge">View Only</span>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderLoading() {
    return html`
      <div class="ciq-status">
        <div class="ciq-spinner"></div>
        <div>Connecting to ClimateIQ...</div>
      </div>
    `;
  }

  private _renderError() {
    return html`
      <div class="ciq-status">
        <div class="ciq-status-title ciq-error">Add-on Unavailable</div>
        <div>${this._error}</div>
      </div>
    `;
  }

  private _renderContent() {
    return html`
      ${this._renderThermostat()}
      ${this._config.show_override ? this._renderOverride() : nothing}
      ${this._config.show_zones && this._zones.length
        ? this._renderZones()
        : nothing}
      ${this._config.show_quick_actions ? this._renderActions() : nothing}
    `;
  }

  private _renderThermostat() {
    const ov = this._override;
    const hvacMode = ov?.hvac_mode || "off";
    const unit = this._tempUnit;

    // Current temp: use schedule_avg_temp from the override endpoint — the backend
    // already computes the average of live zone sensors for the active schedule's
    // zones, converted to the user's display unit. Fall back to averaging all
    // zone sensor readings (in °C, needs conversion) if schedule_avg_temp is absent.
    const avgCurrentTemp: number | null =
      ov?.schedule_avg_temp != null
        ? ov.schedule_avg_temp
        : (() => {
            const zonesWithTemp = this._zones.filter((z) => z.current_temp != null);
            return zonesWithTemp.length > 0
              ? zonesWithTemp.reduce(
                  (sum, z) => sum + this._celsiusToDisplay(z.current_temp)!,
                  0
                ) / zonesWithTemp.length
              : null;
          })();

    // Target temp: schedule_target_temp is ClimateIQ's desired room temperature
    // from the active schedule DB record, already in the user's display unit,
    // BEFORE offset compensation is applied to the thermostat.
    // Falls back to the thermostat setpoint only when no schedule is active.
    const targetTemp = ov?.schedule_target_temp ?? ov?.target_temp ?? null;

    return html`
      <div class="ciq-thermostat">
        <div class="ciq-current-temp">
          ${this._formatTemp(avgCurrentTemp)}<span class="unit">${unit}</span>
        </div>
        <div class="ciq-target-row">
          <span class="ciq-target-label">Target</span>
          <span class="ciq-target-temp">
            ${this._formatTemp(targetTemp)}${unit}
          </span>
        </div>
        <div class="ciq-hvac-mode ${hvacMode}">${hvacMode.toUpperCase()}</div>
      </div>
    `;
  }

  private _renderOverride() {
    const ov = this._override;
    const unit = this._tempUnit;
    const step = this._tempUnit === "°C" ? 0.5 : 1;
    // Baseline is schedule_target_temp (ClimateIQ's desired temp, pre-offset,
    // already in user's display unit), falling back to the thermostat setpoint
    // only when no schedule is active.
    const baseline = ov?.schedule_target_temp ?? ov?.target_temp ?? null;
    const displayTemp = this._overrideTemp ?? baseline;
    const isActive = ov?.is_override_active ?? false;
    // Show "Set Temperature" only when the user has changed the value away from baseline.
    const isDirty = this._canControl && displayTemp != null && displayTemp !== baseline;
    const canControl = this._canControl;

    return html`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Manual Override</div>
      ${isActive
        ? html`<div class="ciq-override-active">Override Active</div>`
        : nothing}
      <div class="ciq-override">
        <button
          class="ciq-override-btn"
          ?disabled=${!canControl}
          @click=${() => this._handleTempAdjust(-step)}
        >
          -
        </button>
        <div class="ciq-override-value">
          ${this._formatTemp(displayTemp)}<span class="unit">${unit}</span>
        </div>
        <button
          class="ciq-override-btn"
          ?disabled=${!canControl}
          @click=${() => this._handleTempAdjust(step)}
        >
          +
        </button>
      </div>
      ${isDirty
        ? html`
            <div style="text-align:center;margin-bottom:12px">
              <button
                class="ciq-action-btn"
                style="display:inline-block;width:auto;padding:8px 24px"
                @click=${this._handleOverrideSubmit}
              >
                Set Temperature
              </button>
            </div>
          `
        : nothing}
    `;
  }

  private _renderZones() {
    const unit = this._tempUnit;
    return html`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Zones</div>
      <div class="ciq-zones">
        ${this._zones.map(
          (zone) => html`
            <div class="ciq-zone">
              <div style="display:flex;align-items:center;gap:10px">
                <span
                  class="ciq-zone-occupancy ${zone.is_occupied
                    ? "occupied"
                    : "vacant"}"
                ></span>
                <span class="ciq-zone-name">${zone.name}</span>
              </div>
              <div class="ciq-zone-stats">
                <div class="ciq-zone-stat">
                  <div class="ciq-zone-stat-value">
                    ${this._formatTemp(this._celsiusToDisplay(zone.current_temp))}${unit}
                  </div>
                  <div class="ciq-zone-stat-label">Temp</div>
                </div>
                ${zone.current_humidity != null
                  ? html`
                      <div class="ciq-zone-stat">
                        <div class="ciq-zone-stat-value">
                          ${Math.round(zone.current_humidity)}%
                        </div>
                        <div class="ciq-zone-stat-label">Humidity</div>
                      </div>
                    `
                  : nothing}
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  private _renderActions() {
    const canControl = this._canControl;
    return html`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Quick Actions</div>
      <div class="ciq-actions">
        <button
          class="ciq-action-btn eco"
          ?disabled=${!canControl}
          @click=${() => this._handleQuickAction("eco")}
        >
          Eco Mode
        </button>
        <button
          class="ciq-action-btn away"
          ?disabled=${!canControl}
          @click=${() => this._handleQuickAction("away")}
        >
          Away Mode
        </button>
        <button
          class="ciq-action-btn boost-heat"
          ?disabled=${!canControl}
          @click=${() => this._handleQuickAction("boost_heat")}
        >
          Boost Heat
        </button>
        <button
          class="ciq-action-btn boost-cool"
          ?disabled=${!canControl}
          @click=${() => this._handleQuickAction("boost_cool")}
        >
          Boost Cool
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "climateiq-card": ClimateIQCard;
  }
}
