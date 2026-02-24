# ClimateIQ Card

A custom Lovelace card for Home Assistant that displays data from the ClimateIQ add-on. Features a dark glassmorphism design with real-time zone monitoring, thermostat control, and quick actions.

## Features

- Current and target temperature display
- HVAC mode indicator (heat / cool / auto / off)
- Per-zone temperature, humidity, and occupancy status
- Quick actions: Eco Mode, Away Mode, Boost Heat, Boost Cool
- Manual temperature override with +/- controls
- System mode badge (Learning, Scheduled, Follow Me, Active)
- Auto-refreshes every 30 seconds

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant
2. Go to **Frontend** > three-dot menu > **Custom repositories**
3. Add the repository URL and select category **Lovelace**
4. Search for "ClimateIQ Card" and install it
5. Refresh your browser

### Manual

1. Download `climateiq-card.js` from the `dist/` folder
2. Copy it to `config/www/climateiq-card.js`
3. Add the resource in **Settings > Dashboards > Resources**:
   - URL: `/local/climateiq-card.js`
   - Type: JavaScript Module

## Usage

Add the card to a dashboard:

```yaml
type: custom:climateiq-card
```

### Configuration options

| Option              | Type    | Default      | Description                        |
|---------------------|---------|--------------|------------------------------------|
| `title`             | string  | `ClimateIQ`  | Card title                         |
| `show_zones`        | boolean | `true`       | Show zone summary section          |
| `show_quick_actions`| boolean | `true`       | Show quick action buttons          |
| `show_override`     | boolean | `true`       | Show manual override controls      |
| `addon_slug`        | string  | `local_climateiq` | Add-on slug (advanced)        |

### Full example

```yaml
type: custom:climateiq-card
title: "Climate Control"
show_zones: true
show_quick_actions: true
show_override: true
```

## Requirements

- Home Assistant with the ClimateIQ add-on installed and running
- The add-on must be accessible via HA ingress

## Development

```bash
npm install
npm run build     # Build dist/climateiq-card.js
npm run watch     # Rebuild on changes
```

## License

MIT
