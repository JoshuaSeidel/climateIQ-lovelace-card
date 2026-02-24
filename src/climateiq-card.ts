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
  current_temp: number | null;
  target_temp: number | null;
  hvac_mode: string;
  preset_mode: string | null;
  is_override_active: boolean;
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

    // Step 2: Fetch the add-on info to get the real ingress_url.
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
      const [zones, config, override] = await Promise.all([
        this._fetchApi<ZoneData[]>("/zones").catch(() => []),
        this._fetchApi<SystemConfig>("/system/config").catch(() => null),
        this._fetchApi<OverrideState>("/system/override").catch(() => null),
      ]);
      this._zones = zones;
      this._systemConfig = config;
      this._override = override;
      if (override?.target_temp != null && this._overrideTemp == null) {
        this._overrideTemp = override.target_temp;
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
    try {
      await this._postApi("/system/quick-action", { action });
      // Refresh after action
      setTimeout(() => this._fetchAll(), 500);
    } catch {
      // Silently fail — next refresh will show current state
    }
  }

  private _handleTempAdjust(delta: number): void {
    if (this._overrideTemp == null) {
      this._overrideTemp = this._override?.target_temp ?? 72;
    }
    this._overrideTemp = Math.round((this._overrideTemp + delta) * 10) / 10;
  }

  private async _handleOverrideSubmit(): Promise<void> {
    if (this._overrideTemp == null) return;
    try {
      await this._postApi("/system/override", { temperature: this._overrideTemp });
      setTimeout(() => this._fetchAll(), 500);
    } catch {
      // Silently fail
    }
  }

  /* ---- Helpers ---- */

  private get _tempUnit(): string {
    return this.hass?.config?.unit_system?.temperature || "F";
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
        ${mode
          ? html`<span class="ciq-mode-badge">${this._modeLabel(mode)}</span>`
          : nothing}
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
    const currentTemp = ov?.current_temp;
    const targetTemp = ov?.target_temp;
    const hvacMode = ov?.hvac_mode || "off";
    const unit = this._tempUnit === "C" ? "C" : "F";

    return html`
      <div class="ciq-thermostat">
        <div class="ciq-current-temp">
          ${this._formatTemp(currentTemp)}<span class="unit">${unit}</span>
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
    const unit = this._tempUnit === "C" ? "C" : "F";
    const step = this._tempUnit === "C" ? 0.5 : 1;
    const displayTemp = this._overrideTemp ?? ov?.target_temp ?? null;
    const isActive = ov?.is_override_active ?? false;
    const isDirty = displayTemp != null && displayTemp !== ov?.target_temp;

    return html`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Manual Override</div>
      ${isActive
        ? html`<div class="ciq-override-active">Override Active</div>`
        : nothing}
      <div class="ciq-override">
        <button
          class="ciq-override-btn"
          @click=${() => this._handleTempAdjust(-step)}
        >
          -
        </button>
        <div class="ciq-override-value">
          ${this._formatTemp(displayTemp)}<span class="unit">${unit}</span>
        </div>
        <button
          class="ciq-override-btn"
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
    const unit = this._tempUnit === "C" ? "C" : "F";
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
                    ${this._formatTemp(zone.current_temp)}${unit}
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
    return html`
      <div class="ciq-divider"></div>
      <div class="ciq-section-label">Quick Actions</div>
      <div class="ciq-actions">
        <button
          class="ciq-action-btn eco"
          @click=${() => this._handleQuickAction("eco")}
        >
          Eco Mode
        </button>
        <button
          class="ciq-action-btn away"
          @click=${() => this._handleQuickAction("away")}
        >
          Away Mode
        </button>
        <button
          class="ciq-action-btn boost-heat"
          @click=${() => this._handleQuickAction("boost_heat")}
        >
          Boost Heat
        </button>
        <button
          class="ciq-action-btn boost-cool"
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
