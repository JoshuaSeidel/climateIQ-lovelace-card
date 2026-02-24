import { css } from "lit";

export const cardStyles = css`
  :host {
    --ciq-bg: var(--ha-card-background, rgba(10, 12, 16, 0.85));
    --ciq-panel-bg: rgba(2, 6, 23, 0.45);
    --ciq-border: rgba(148, 163, 184, 0.12);
    --ciq-accent: #38bdf8;
    --ciq-accent-dim: rgba(56, 189, 248, 0.15);
    --ciq-accent-border: rgba(56, 189, 248, 0.3);
    --ciq-accent-hover: rgba(56, 189, 248, 0.25);
    --ciq-text-primary: var(--primary-text-color, hsl(215, 28%, 92%));
    --ciq-text-secondary: hsl(215, 20%, 65%);
    --ciq-green: #4ade80;
    --ciq-yellow: #facc15;
    --ciq-red: #ef4444;
    --ciq-radius-card: 12px;
    --ciq-radius-inner: 8px;
    --ciq-radius-pill: 9999px;
    --ciq-glow: 0 0 15px rgba(56, 189, 248, 0.15);
    --ciq-font: system-ui, -apple-system, sans-serif;
  }

  ha-card {
    background: var(--ciq-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-card);
    color: var(--ciq-text-primary);
    font-family: var(--ciq-font);
    padding: 20px;
    overflow: hidden;
  }

  /* --- Header --- */
  .ciq-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .ciq-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--ciq-text-primary);
  }

  .ciq-mode-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 4px 12px;
    border-radius: var(--ciq-radius-pill);
    background: var(--ciq-accent-dim);
    border: 1px solid var(--ciq-accent-border);
    color: var(--ciq-accent);
    box-shadow: var(--ciq-glow);
  }

  .ciq-readonly-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 4px 10px;
    border-radius: var(--ciq-radius-pill);
    background: rgba(148, 163, 184, 0.1);
    border: 1px solid rgba(148, 163, 184, 0.25);
    color: var(--ciq-text-secondary);
  }

  /* --- Thermostat Panel --- */
  .ciq-thermostat {
    background: var(--ciq-panel-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-inner);
    padding: 24px;
    text-align: center;
    margin-bottom: 16px;
  }

  .ciq-current-temp {
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    color: var(--ciq-text-primary);
    margin-bottom: 4px;
  }

  .ciq-current-temp .unit {
    font-size: 28px;
    font-weight: 600;
    color: var(--ciq-text-secondary);
    vertical-align: super;
  }

  .ciq-target-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  }

  .ciq-target-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ciq-text-secondary);
  }

  .ciq-target-temp {
    font-size: 20px;
    font-weight: 700;
    color: var(--ciq-accent);
  }

  .ciq-hvac-mode {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 3px 10px;
    border-radius: var(--ciq-radius-pill);
    background: var(--ciq-panel-bg);
    border: 1px solid var(--ciq-border);
    color: var(--ciq-text-secondary);
    margin-top: 12px;
  }

  .ciq-hvac-mode.heat {
    color: #fb923c;
    border-color: rgba(251, 146, 60, 0.3);
    background: rgba(251, 146, 60, 0.1);
  }

  .ciq-hvac-mode.cool {
    color: var(--ciq-accent);
    border-color: var(--ciq-accent-border);
    background: var(--ciq-accent-dim);
  }

  .ciq-hvac-mode.auto {
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.3);
    background: rgba(167, 139, 250, 0.1);
  }

  .ciq-hvac-mode.off {
    color: var(--ciq-text-secondary);
  }

  /* --- Override Controls --- */
  .ciq-override {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;
  }

  .ciq-override-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--ciq-border);
    background: var(--ciq-panel-bg);
    color: var(--ciq-text-primary);
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    line-height: 1;
    padding: 0;
  }

  .ciq-override-btn:hover {
    background: var(--ciq-accent-hover);
    border-color: var(--ciq-accent-border);
    box-shadow: var(--ciq-glow);
  }

  .ciq-override-btn:active {
    transform: scale(0.95);
  }

  .ciq-override-value {
    font-size: 28px;
    font-weight: 900;
    color: var(--ciq-accent);
    min-width: 80px;
    text-align: center;
  }

  .ciq-override-value .unit {
    font-size: 14px;
    font-weight: 600;
    color: var(--ciq-text-secondary);
    vertical-align: super;
  }

  .ciq-override-label {
    text-align: center;
    margin-bottom: 8px;
  }

  .ciq-override-active {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    padding: 3px 10px;
    border-radius: var(--ciq-radius-pill);
    background: rgba(250, 204, 21, 0.1);
    border: 1px solid rgba(250, 204, 21, 0.3);
    color: var(--ciq-yellow);
    margin-bottom: 12px;
    text-align: center;
  }

  /* --- Zones --- */
  .ciq-section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ciq-text-secondary);
    margin-bottom: 10px;
  }

  .ciq-zones {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .ciq-zone {
    background: var(--ciq-panel-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--ciq-border);
    border-radius: var(--ciq-radius-inner);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ciq-zone-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ciq-text-primary);
  }

  .ciq-zone-stats {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ciq-zone-stat {
    text-align: right;
  }

  .ciq-zone-stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--ciq-text-primary);
  }

  .ciq-zone-stat-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--ciq-text-secondary);
  }

  .ciq-zone-occupancy {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ciq-zone-occupancy.occupied {
    background: var(--ciq-green);
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
  }

  .ciq-zone-occupancy.vacant {
    background: var(--ciq-text-secondary);
    opacity: 0.4;
  }

  /* --- Quick Actions --- */
  .ciq-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .ciq-action-btn {
    background: var(--ciq-accent-dim);
    border: 1px solid var(--ciq-accent-border);
    border-radius: var(--ciq-radius-inner);
    color: var(--ciq-accent);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--ciq-font);
  }

  .ciq-action-btn:hover {
    background: var(--ciq-accent-hover);
    box-shadow: var(--ciq-glow);
  }

  .ciq-action-btn:active {
    transform: scale(0.97);
  }

  .ciq-action-btn:disabled,
  .ciq-override-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }

  .ciq-action-btn.eco {
    color: var(--ciq-green);
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.3);
  }

  .ciq-action-btn.eco:hover {
    background: rgba(74, 222, 128, 0.2);
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.15);
  }

  .ciq-action-btn.away {
    color: var(--ciq-yellow);
    background: rgba(250, 204, 21, 0.1);
    border-color: rgba(250, 204, 21, 0.3);
  }

  .ciq-action-btn.away:hover {
    background: rgba(250, 204, 21, 0.2);
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.15);
  }

  .ciq-action-btn.boost-heat {
    color: #fb923c;
    background: rgba(251, 146, 60, 0.1);
    border-color: rgba(251, 146, 60, 0.3);
  }

  .ciq-action-btn.boost-heat:hover {
    background: rgba(251, 146, 60, 0.2);
    box-shadow: 0 0 15px rgba(251, 146, 60, 0.15);
  }

  .ciq-action-btn.boost-cool {
    color: var(--ciq-accent);
    background: var(--ciq-accent-dim);
    border-color: var(--ciq-accent-border);
  }

  .ciq-action-btn.boost-cool:hover {
    background: var(--ciq-accent-hover);
    box-shadow: var(--ciq-glow);
  }

  /* --- Status / Error --- */
  .ciq-status {
    text-align: center;
    padding: 40px 20px;
    color: var(--ciq-text-secondary);
    font-size: 14px;
  }

  .ciq-status-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ciq-text-primary);
    margin-bottom: 8px;
  }

  .ciq-error {
    color: var(--ciq-red);
  }

  .ciq-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--ciq-border);
    border-top-color: var(--ciq-accent);
    border-radius: 50%;
    animation: ciq-spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes ciq-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* --- Divider --- */
  .ciq-divider {
    height: 1px;
    background: var(--ciq-border);
    margin: 16px 0;
  }
`;
