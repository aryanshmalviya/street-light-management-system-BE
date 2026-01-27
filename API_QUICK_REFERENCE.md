# Quick Reference: Updated API Endpoints

## Summary of Changes
All API endpoints have been updated to align with the PostgreSQL schema in `sql.sql`. The main changes involve:
- Renamed tables: `street_lights` → `assets`, `fault_detection` → `faults`, `maintenance_schedule` → `maintenance_tickets`
- Updated field names: `light_id` → `pole_id`, `section_id` → `zone_id`
- Added new endpoints for: Zones, Controllers, Telemetry, Automation Rules

---

## Core Endpoints by Module

### 🏙️ Zones Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/zones` | List all zones |
| GET | `/api/zones/:id` | Get zone by ID |
| POST | `/api/zones` | Create new zone |
| PUT | `/api/zones/:id` | Update zone |
| DELETE | `/api/zones/:id` | Delete zone |
| GET | `/api/zones/:id/stats` | Get zone statistics |

**Example Request (Create Zone)**:
```json
POST /api/zones
{
  "zone_id": "Z001",
  "name": "Downtown District",
  "length_km": 5.5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "poles": 45
}
```

---

### 💡 Street Lights (Assets)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lights?zoneId=Z001` | List lights (optionally filtered by zone) |
| GET | `/api/lights/:poleId` | Get light by pole ID |
| POST | `/api/lights` | Create new light |
| PATCH | `/api/lights/:poleId/status` | Update light status |
| DELETE | `/api/lights/:poleId` | Delete light |

**Example Request (Create Light)**:
```json
POST /api/lights
{
  "pole_id": "POLE-001",
  "zone_id": "Z001",
  "controller_id": "CTRL-001",
  "fixture_type": "LED-150W",
  "installed_on": "2024-01-15",
  "status": "operational",
  "gps_lat": 40.7130,
  "gps_lng": -74.0061
}
```

**Example Request (Update Status)**:
```json
PATCH /api/lights/POLE-001/status
{
  "status": "maintenance"
}
```

---

### 🎛️ Controllers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/controllers` | List all controllers |
| GET | `/api/controllers/:id` | Get controller details |
| POST | `/api/controllers` | Create new controller |
| PUT | `/api/controllers/:id` | Update controller |
| DELETE | `/api/controllers/:id` | Delete controller |
| GET | `/api/controllers/:id/assets` | Get assets managed by controller |
| POST | `/api/controllers/:id/heartbeat` | Update last_seen timestamp |

**Example Request (Create Controller)**:
```json
POST /api/controllers
{
  "controller_id": "CTRL-001",
  "firmware": "v2.1.0",
  "connectivity": "connected"
}
```

**Example Request (Heartbeat)**:
```json
POST /api/controllers/CTRL-001/heartbeat
{}
```

---

### 📊 Telemetry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/telemetry/pole/:poleId?limit=100` | Get telemetry records |
| GET | `/api/telemetry/:id` | Get specific record |
| POST | `/api/telemetry` | Record new telemetry |
| GET | `/api/telemetry/pole/:poleId/latest` | Get latest data |
| GET | `/api/telemetry/pole/:poleId/range` | Get time-range data |
| GET | `/api/telemetry/pole/:poleId/stats?hours=24` | Get power statistics |

**Example Request (Record Telemetry)**:
```json
POST /api/telemetry
{
  "telemetry_id": "TEL-001-2024-01-15-10",
  "pole_id": "POLE-001",
  "ts": "2024-01-15T10:30:00Z",
  "state": "on",
  "voltage": 230.5,
  "current_a": 2.3,
  "power_w": 529.65,
  "energy_kwh": 0.145,
  "ambient_lux": 150,
  "temperature_c": 25.3,
  "dimming_level": 85,
  "fault_code": null
}
```

**Example Request (Get Time Range)**:
```
GET /api/telemetry/pole/POLE-001/range?startTime=2024-01-15T00:00:00Z&endTime=2024-01-15T23:59:59Z
```

---

### ⚠️ Faults
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faults` | List open faults |
| GET | `/api/faults/:id` | Get fault details |
| POST | `/api/faults` | Report new fault |
| PUT | `/api/faults/:id` | Update fault status |
| DELETE | `/api/faults/:id` | Delete fault |

**Example Request (Report Fault)**:
```json
POST /api/faults
{
  "fault_id": "FAULT-001",
  "pole_id": "POLE-001",
  "zone_id": "Z001",
  "fault_code": "LED_FAILURE",
  "severity": "high",
  "detected_at": "2024-01-15T10:45:00Z",
  "status": "open"
}
```

**Example Request (Update Fault Status)**:
```json
PUT /api/faults/FAULT-001
{
  "status": "resolved"
}
```

---

### 🔧 Maintenance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance` | List pending tickets |
| GET | `/api/maintenance/:id` | Get ticket details |
| POST | `/api/maintenance` | Create maintenance ticket |
| PUT | `/api/maintenance/:id` | Update ticket status |
| DELETE | `/api/maintenance/:id` | Delete ticket |

**Example Request (Create Ticket)**:
```json
POST /api/maintenance
{
  "ticket_id": "MNT-001",
  "fault_id": "FAULT-001",
  "assigned_to": "USER-001",
  "sla_hours": 24,
  "status": "open"
}
```

**Example Request (Update Status)**:
```json
PUT /api/maintenance/MNT-001
{
  "status": "in_progress"
}
```

---

### 🤖 Automation Rules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/automation-rules` | List all rules |
| GET | `/api/automation-rules/zone/:zoneId` | Get zone rules |
| GET | `/api/automation-rules/zone/:zoneId/active` | Get active zone rules |
| GET | `/api/automation-rules/:id` | Get rule details |
| POST | `/api/automation-rules` | Create new rule |
| PUT | `/api/automation-rules/:id` | Update rule |
| POST | `/api/automation-rules/:id/toggle` | Toggle active status |
| DELETE | `/api/automation-rules/:id` | Delete rule |

**Example Request (Create Rule)**:
```json
POST /api/automation-rules
{
  "rule_id": "RULE-001",
  "zone_id": "Z001",
  "name": "Night Dimming",
  "condition": {
    "time": "22:00",
    "condition_type": "after"
  },
  "action": "dim_to_50",
  "active": true
}
```

**Example Request (Toggle Status)**:
```json
POST /api/automation-rules/RULE-001/toggle
{
  "active": false
}
```

---

## Common Status Values

### Asset Status
- `operational` - Light is functioning normally
- `faulty` - Light has detected faults
- `maintenance` - Light is undergoing maintenance
- `offline` - Light is offline/disconnected

### Fault Status
- `open` - Fault has been detected and is open
- `resolved` - Fault has been resolved

### Maintenance Status
- `open` - Ticket created, not yet assigned
- `in_progress` - Maintenance is being performed
- `completed` - Maintenance is complete

### Controller Connectivity
- `connected` - Controller is actively connected
- `disconnected` - Controller is not responding
- `error` - Controller has encountered an error

---

## Authentication
All endpoints (except `/api/health`) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Error Response Format
```json
{
  "error": "Description of the error",
  "status": 400
}
```

---

## Success Response Format
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

---

## Important Changes from Previous API

| Old | New | Note |
|-----|-----|------|
| `light_id` | `pole_id` | Street light unique identifier |
| `section_id` | `zone_id` | Zone identifier |
| `street_lights` table | `assets` table | Database table name |
| `fault_detection` table | `faults` table | Database table name |
| `maintenance_schedule` table | `maintenance_tickets` table | Database table name |
| N/A | `telemetry` table | New endpoint for power/environmental data |
| N/A | `automation_rules` table | New endpoint for rules management |
| N/A | `controllers` table | New endpoint for device management |

---

## Useful Query Examples

### Get all lights in a specific zone
```
GET /api/lights?zoneId=Z001
```

### Get recent telemetry for a pole
```
GET /api/telemetry/pole/POLE-001?limit=50
```

### Get average power usage for last 7 days
```
GET /api/telemetry/pole/POLE-001/stats?hours=168
```

### Get all active zones
```
GET /api/zones
```

### Get all open faults
```
GET /api/faults
```

### Get all pending maintenance tickets
```
GET /api/maintenance
```

### Get active automation rules for a zone
```
GET /api/automation-rules/zone/Z001/active
```

---

## Development Notes

1. All timestamps use ISO 8601 format (e.g., `2024-01-15T10:30:00Z`)
2. GPS coordinates use decimal degrees (e.g., `latitude: 40.7128`)
3. Energy values are in kWh, power in watts
4. Temperature in Celsius, light levels in lux
5. JSON fields (like automation_rules.condition) are stored as PostgreSQL JSON type
6. All string IDs are case-sensitive

---

## Testing Checklist

- [ ] Test GET endpoints with and without filters
- [ ] Test POST endpoints with valid data
- [ ] Test POST endpoints with invalid data (validation errors)
- [ ] Test PUT/PATCH endpoints for updates
- [ ] Test DELETE endpoints for removal
- [ ] Test authentication (with and without token)
- [ ] Test rate limiting (if implemented)
- [ ] Verify all 404 responses for non-existent resources
- [ ] Test pagination/limit parameters
- [ ] Verify sorting by timestamp for telemetry data
