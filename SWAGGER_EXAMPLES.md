# Swagger Testing Examples

## How to Access Swagger UI

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000/api-docs
   ```

## Before Testing Endpoints

### Get JWT Token

First, you need authentication. Create a test token or use this temporary flow:

**In development**, you can generate a test token:

```bash
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: 1, email: 'test@nhai.gov.in', role: 'admin' },
  'your_jwt_secret_key_here_change_in_production',
  { expiresIn: '7d' }
);
console.log(token);
"
```

Then in Swagger UI:
1. Click the "Authorize" button (top right)
2. Paste your token in the "Bearer token" field
3. Click "Authorize"

## Complete Testing Workflow

### 1. Create a Highway Section (if not exists)

This is a prerequisite for creating lights. You might need to create this manually or via database:

```sql
INSERT INTO highway_sections (name, highway_number, start_km, end_km, length_km, status)
VALUES ('Delhi-Mumbai NH48', 'NH-48', 0, 500, 500, 'active');
```

Note the `section_id` returned (e.g., 1)

### 2. Create a Street Light

**Endpoint**: `POST /api/lights`

**In Swagger UI:**
1. Expand the POST /lights endpoint
2. Click "Try it out"
3. Enter request body:

```json
{
  "light_id": "NH-48-0001",
  "section_id": 1,
  "latitude": 28.7041,
  "longitude": 77.1025,
  "wattage": 150,
  "pole_height": 12.5
}
```

4. Click "Execute"
5. Note the returned `id` (e.g., 1)

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "light_id": "NH-48-0001",
    "section_id": 1,
    "latitude": 28.7041,
    "longitude": 77.1025,
    "wattage": 150,
    "pole_height": 12.5,
    "status": "operational",
    "created_at": "2026-01-27T10:30:00Z"
  }
}
```

### 3. Record Monitoring Data

**Endpoint**: `POST /api/monitoring/record`

**Request:**
```json
{
  "light_id": 1,
  "status": "on",
  "power_consumption": 148.5,
  "voltage": 230.5,
  "current": 0.645,
  "brightness_level": 92,
  "temperature": 42.3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "light_id": 1,
    "status": "on",
    "power_consumption": 148.5,
    "voltage": 230.5,
    "current": 0.645,
    "brightness_level": 92,
    "temperature": 42.3,
    "timestamp": "2026-01-27T10:31:00Z"
  }
}
```

### 4. Get Latest Monitoring Data

**Endpoint**: `GET /api/monitoring/{lightId}/latest`

**In Swagger UI:**
1. Click the endpoint
2. Click "Try it out"
3. Enter `lightId`: 1
4. Click "Execute"

### 5. Report a Fault

**Endpoint**: `POST /api/faults/report`

**Request:**
```json
{
  "light_id": 1,
  "fault_type": "lamp_failure",
  "severity": "high",
  "description": "Lamp not lighting up properly - brightness below threshold"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "light_id": 1,
    "fault_type": "lamp_failure",
    "severity": "high",
    "description": "Lamp not lighting up properly - brightness below threshold",
    "status": "open",
    "detected_at": "2026-01-27T10:35:00Z"
  }
}
```

### 6. Get Open Faults

**Endpoint**: `GET /api/faults/open`

No parameters needed - returns all open faults across the system

### 7. Resolve a Fault

**Endpoint**: `PATCH /api/faults/{faultId}/resolve`

**In Swagger UI:**
1. Enter `faultId`: 1
2. Click "Execute"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "light_id": 1,
    "fault_type": "lamp_failure",
    "severity": "high",
    "status": "resolved",
    "resolved_at": "2026-01-27T10:40:00Z"
  }
}
```

### 8. Record Energy Usage

**Endpoint**: `POST /api/energy/record`

**Request:**
```json
{
  "section_id": 1,
  "light_id": 1,
  "daily_consumption": 3.6,
  "cost": 28.50,
  "date": "2026-01-27"
}
```

### 9. Get Daily Energy Usage

**Endpoint**: `GET /api/energy/daily`

**Parameters:**
- `sectionId`: 1
- `date`: 2026-01-27

### 10. Get Monthly Energy Usage

**Endpoint**: `GET /api/energy/monthly`

**Parameters:**
- `sectionId`: 1
- `month`: 1 (January)
- `year`: 2026

**Response Example:**
```json
{
  "success": true,
  "data": {
    "total_consumption": 110.4,
    "total_cost": 850.00,
    "avg_consumption": 3.67,
    "days_recorded": 30
  }
}
```

### 11. Schedule Maintenance

**Endpoint**: `POST /api/maintenance/schedule`

**Request:**
```json
{
  "light_id": 1,
  "section_id": 1,
  "maintenance_type": "preventive",
  "scheduled_date": "2026-02-15T10:00:00Z",
  "assigned_to": 1,
  "notes": "Routine inspection and cleaning"
}
```

### 12. Get Pending Maintenance

**Endpoint**: `GET /api/maintenance/pending`

**Parameters:**
- `sectionId`: 1

### 13. Record Carbon Footprint

**Endpoint**: `POST /api/carbon/record`

**Request:**
```json
{
  "section_id": 1,
  "date": "2026-01-27",
  "energy_consumed_kwh": 3.6,
  "co2_emissions_kg": 1.44,
  "carbon_credits": 0.2,
  "baseline_consumption": 5.0,
  "reduction_percentage": 28.0
}
```

### 14. Get Carbon Footprint Report

**Endpoint**: `GET /api/carbon/report`

**Parameters:**
- `sectionId`: 1
- `startDate`: 2026-01-01
- `endDate`: 2026-01-31

**Response Example:**
```json
{
  "success": true,
  "data": {
    "total_energy_kwh": 110.4,
    "total_co2_kg": 44.16,
    "total_carbon_credits": 6.2,
    "avg_reduction_percentage": 28.5
  }
}
```

### 15. Get Environmental Impact

**Endpoint**: `GET /api/carbon/impact`

**Parameters:**
- `sectionId`: 1

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Server Error |

## Tips for Using Swagger

### 1. Copy as cURL
- After executing a request, find the cURL command
- Use it in terminal for automation
- Great for shell scripts

### 2. Save Requests
- Use browser's bookmark feature
- Save Swagger URLs with parameters
- Quick access to frequently tested endpoints

### 3. Check Response Headers
- Headers tab shows response metadata
- Useful for debugging
- See content-type, cache-control, etc.

### 4. Validate Data
- Use the "Schema" tab to verify expected format
- Check parameter requirements
- Understand response structure

### 5. Test Pagination
- For endpoints with `limit` parameter
- Test with different page sizes
- Verify data ordering

## Debugging Failed Requests

### 401 Unauthorized
- ❌ Token not provided or invalid
- ✅ Click "Authorize" and paste valid JWT

### 400 Bad Request
- ❌ Missing required parameters
- ✅ Check parameter names spelling
- ✅ Verify data types match schema

### 404 Not Found
- ❌ Resource ID doesn't exist
- ✅ Create resource first
- ✅ Verify correct ID format

### 500 Server Error
- ❌ Database connection issue
- ❌ Unhandled exception
- ✅ Check server logs
- ✅ Verify database is running

## Performance Testing

### Test High Load
- Record multiple monitoring data points
- Create many lights
- Generate fault reports

### Monitor Response Time
- Check response time in Swagger
- Typical: 50-200ms
- Slow: >500ms may indicate issues

## Security Testing in Swagger

### Test Authentication
1. Click "Authorize"
2. Use invalid token → Should get 401
3. Use valid token → Should work

### Test Authorization
- Some endpoints restricted by role
- Invalid role → 403 Forbidden

## Exporting for Postman

1. Get Swagger JSON:
   ```
   http://localhost:3000/swagger-ui.json
   ```

2. In Postman:
   - File → Import
   - Select Swagger JSON
   - All endpoints auto-imported

## Next Steps

After testing APIs in Swagger:
1. ✅ Verify all endpoints working
2. ✅ Test with real data volumes
3. ✅ Build frontend to consume APIs
4. ✅ Setup authentication flow
5. ✅ Configure production deployment
