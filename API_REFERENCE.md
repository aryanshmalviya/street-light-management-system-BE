# NHAI Street Lighting - Complete API Reference

## Authentication

All endpoints require JWT authentication (except `/api/health`).

### Generate JWT Token

For demonstration purposes, you would use a login endpoint (not implemented yet). Here's an example JWT payload structure:

```json
{
  "userId": 1,
  "email": "operator@nhai.gov",
  "role": "operator"
}
```

Include token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Street Lights Management

### List All Lights
```http
GET /api/lights
```

**Query Parameters:**
- `sectionId` (optional): Filter by section

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "light_id": "LIGHT-1-001",
      "section_id": 1,
      "latitude": 28.5234,
      "longitude": 77.1892,
      "wattage": 150,
      "pole_height": 10.5,
      "status": "operational",
      "installation_date": "2024-01-15",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Light by ID
```http
GET /api/lights/{id}
```

### Create Light
```http
POST /api/lights
Content-Type: application/json

{
  "light_id": "LIGHT-1-050",
  "section_id": 1,
  "latitude": 28.5240,
  "longitude": 77.1900,
  "wattage": 150,
  "pole_height": 10.5
}
```

### Update Light Status
```http
PATCH /api/lights/{id}/status
Content-Type: application/json

{
  "status": "maintenance"
}
```

**Status values:** `operational`, `maintenance`, `faulty`, `offline`

### Delete Light
```http
DELETE /api/lights/{id}
```

---

## Real-time Monitoring

### Record Monitoring Data
```http
POST /api/monitoring/record
Content-Type: application/json

{
  "light_id": 5,
  "status": "operational",
  "power_consumption": 147.3,
  "voltage": 232,
  "current": 0.635,
  "brightness_level": 85,
  "temperature": 43.2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1001,
    "light_id": 5,
    "status": "operational",
    "power_consumption": 147.3,
    "voltage": 232,
    "current": 0.635,
    "brightness_level": 85,
    "temperature": 43.2,
    "timestamp": "2024-01-27T15:30:00Z"
  }
}
```

### Get Latest Monitoring Data
```http
GET /api/monitoring/{lightId}/latest
```

### Get Monitoring Data Range
```http
GET /api/monitoring/{lightId}/range?startDate=2024-01-20&endDate=2024-01-27
```

### Get All Lights Status
```http
GET /api/monitoring/section/status?sectionId=1
```

Returns latest monitoring data for all lights in a section.

---

## Fault Detection

### Report Fault
```http
POST /api/faults/report
Content-Type: application/json

{
  "light_id": 5,
  "fault_type": "lamp_failure",
  "severity": "high",
  "description": "Light not turning on during night hours"
}
```

**Fault types:** `lamp_failure`, `ballast_failure`, `power_loss`, `sensor_failure`, `pole_damage`

**Severity levels:** `low`, `medium`, `high`, `critical`

### Get Open Faults
```http
GET /api/faults/open
```

Returns all unresolved faults across the system.

### Get Faults by Light
```http
GET /api/faults/{lightId}
```

### Resolve Fault
```http
PATCH /api/faults/{faultId}/resolve
```

### Get Fault Statistics
```http
GET /api/faults/section/stats?sectionId=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_faults": 45,
    "open_faults": 12,
    "resolved_faults": 33,
    "critical_faults": 3
  }
}
```

---

## Energy Tracking

### Record Energy Usage
```http
POST /api/energy/record
Content-Type: application/json

{
  "section_id": 1,
  "light_id": 5,
  "daily_consumption": 12.5,
  "cost": 125.0,
  "date": "2024-01-27"
}
```

### Get Daily Energy Usage
```http
GET /api/energy/daily?sectionId=1&date=2024-01-27
```

### Get Monthly Energy Usage
```http
GET /api/energy/monthly?sectionId=1&month=1&year=2024
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_consumption": 375.5,
    "total_cost": 3755.00,
    "avg_consumption": 12.5,
    "days_recorded": 30
  }
}
```

### Get Energy Trends
```http
GET /api/energy/trends?sectionId=1&days=30
```

Returns daily energy consumption for the last 30 days.

---

## Maintenance Scheduling

### Schedule Maintenance
```http
POST /api/maintenance/schedule
Content-Type: application/json

{
  "light_id": 5,
  "section_id": 1,
  "maintenance_type": "lamp_replacement",
  "scheduled_date": "2024-02-01T10:00:00Z",
  "assigned_to": 2,
  "notes": "Replace with LED lamp"
}
```

**Maintenance types:** `lamp_replacement`, `ballast_replacement`, `cleaning`, `inspection`, `repair`

### Get Pending Maintenance
```http
GET /api/maintenance/pending?sectionId=1
```

### Get Maintenance History
```http
GET /api/maintenance/history?sectionId=1&limit=50
```

### Complete Maintenance
```http
PATCH /api/maintenance/{maintenanceId}/complete
```

### Get Maintenance Statistics
```http
GET /api/maintenance/stats?sectionId=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_schedules": 50,
    "pending": 12,
    "completed": 35,
    "in_progress": 3
  }
}
```

---

## Carbon Footprint & Environmental Impact

### Record Carbon Footprint
```http
POST /api/carbon/record
Content-Type: application/json

{
  "section_id": 1,
  "date": "2024-01-27",
  "energy_consumed_kwh": 450.75,
  "co2_emissions_kg": 225.37,
  "carbon_credits": 4.5,
  "baseline_consumption": 500,
  "reduction_percentage": 9.85
}
```

### Get Carbon Report
```http
GET /api/carbon/report?sectionId=1&startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_energy_kwh": 13500.0,
    "total_co2_kg": 6750.0,
    "total_carbon_credits": 135.0,
    "avg_reduction_percentage": 10.5
  }
}
```

### Get Daily Carbon Data
```http
GET /api/carbon/daily?sectionId=1&date=2024-01-27
```

### Get Monthly Carbon Trends
```http
GET /api/carbon/trends?sectionId=1&months=12
```

Returns monthly aggregated data for the last 12 months.

### Get Environmental Impact
```http
GET /api/carbon/impact?sectionId=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_energy_saved_kwh": 150000.0,
    "total_co2_avoided_kg": 75000.0,
    "total_carbon_credits_earned": 1500.0,
    "days_tracked": 365
  }
}
```

---

## Health Check

### System Health Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-27T15:35:00Z"
}
```

---

## WebSocket Real-time Updates

### Connect to WebSocket
```javascript
const socket = io('http://localhost:3000');

// Subscribe to a light
socket.emit('subscribe_light', 5);

// Listen for updates
socket.on('monitoring_update', (data) => {
  console.log('New monitoring data:', data);
});

socket.on('fault_alert', (data) => {
  console.log('Fault detected:', data);
});

// Unsubscribe
socket.emit('unsubscribe_light', 5);
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required field: sectionId"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Light not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting (Future Implementation)

Planned rate limits:
- 100 requests per minute per IP
- 10 requests per second per authenticated user
- Burst allowance: 50 requests

---

## Pagination (Future Implementation)

Future endpoints will support:
```http
GET /api/resource?page=1&limit=20&sort=-created_at
```

---

## Bulk Operations (Future Implementation)

```http
POST /api/lights/bulk
Content-Type: application/json

{
  "lights": [
    { "light_id": "LIGHT-1-001", "section_id": 1, ... },
    { "light_id": "LIGHT-1-002", "section_id": 1, ... }
  ]
}
```

---

## Testing with cURL

### Example: Create a light and record monitoring data

```bash
# Assuming you have a valid JWT token

TOKEN="your_jwt_token_here"

# Create a light
curl -X POST http://localhost:3000/api/lights \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "light_id": "LIGHT-1-001",
    "section_id": 1,
    "latitude": 28.5234,
    "longitude": 77.1892,
    "wattage": 150,
    "pole_height": 10.5
  }'

# Record monitoring data
curl -X POST http://localhost:3000/api/monitoring/record \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "light_id": 1,
    "status": "operational",
    "power_consumption": 147.3,
    "voltage": 232,
    "current": 0.635,
    "brightness_level": 85,
    "temperature": 43.2
  }'
```

---

## Postman Collection

You can import these endpoints into Postman for easier testing. Export from Postman and save as `postman-collection.json`.

---

## Version

**API Version:** 1.0.0  
**Last Updated:** January 27, 2024
