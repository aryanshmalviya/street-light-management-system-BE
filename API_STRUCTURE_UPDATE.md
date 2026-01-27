# Street Light Management System - API Structure Update

## Overview
Updated the entire backend API structure to align with the new PostgreSQL database schema defined in `sql.sql`. All services, controllers, and routes have been refactored to use the correct table names and column fields.

---

## Database Schema Mapping

### Tables Implemented:

1. **assets** (replaces street_lights)
   - pole_id (PK)
   - zone_id (FK)
   - controller_id (FK)
   - fixture_type
   - installed_on
   - status
   - gps_lat, gps_lng

2. **zones**
   - zone_id (PK)
   - name
   - length_km
   - latitude, longitude
   - poles

3. **controllers**
   - controller_id (PK)
   - firmware
   - last_seen
   - connectivity

4. **faults** (replaces fault_detection)
   - fault_id (PK)
   - pole_id (FK)
   - zone_id (FK)
   - fault_code
   - severity
   - detected_at
   - status

5. **maintenance_tickets** (replaces maintenance_schedule)
   - ticket_id (PK)
   - fault_id (FK)
   - assigned_to
   - created_at
   - sla_hours
   - status

6. **telemetry** (new)
   - telemetry_id (PK)
   - pole_id (FK)
   - ts
   - state
   - voltage, current_a, power_w, energy_kwh
   - ambient_lux, temperature_c
   - dimming_level
   - fault_code

7. **automation_rules** (new)
   - rule_id (PK)
   - zone_id (FK)
   - name
   - condition (JSON)
   - action
   - active

8. **users**
   - user_id (PK)
   - name
   - role
   - email

---

## Updated Services

### 1. streetLightService.js (Updated)
**Endpoint Base**: `/api/lights`

**Methods**:
- `getAllLights(zoneId)` - Get all assets, optionally filtered by zone
- `getLightById(poleId)` - Get asset by pole_id
- `createLight(lightData)` - Create new asset
- `updateLightStatus(poleId, status)` - Update asset status
- `deleteLight(poleId)` - Delete asset

**API Endpoints**:
- GET `/api/lights` - List all lights
- GET `/api/lights/:id` - Get light by pole_id
- POST `/api/lights` - Create new light
- PATCH `/api/lights/:id/status` - Update status
- DELETE `/api/lights/:id` - Delete light

---

### 2. zoneService.js (New)
**Endpoint Base**: `/api/zones`

**Methods**:
- `getAllZones()` - Get all zones
- `getZoneById(zoneId)` - Get zone by ID
- `createZone(zoneData)` - Create new zone
- `updateZone(zoneId, zoneData)` - Update zone
- `deleteZone(zoneId)` - Delete zone
- `getZoneStats(zoneId)` - Get zone statistics with active poles count

**API Endpoints**:
- GET `/api/zones` - List all zones
- GET `/api/zones/:id` - Get zone details
- POST `/api/zones` - Create zone
- PUT `/api/zones/:id` - Update zone
- DELETE `/api/zones/:id` - Delete zone
- GET `/api/zones/:id/stats` - Get zone statistics

---

### 3. controllerService.js (New)
**Endpoint Base**: `/api/controllers`

**Methods**:
- `getAllControllers()` - Get all controllers
- `getControllerById(controllerId)` - Get controller details
- `createController(controllerData)` - Create new controller
- `updateController(controllerId, controllerData)` - Update controller
- `updateLastSeen(controllerId)` - Update last_seen timestamp
- `deleteController(controllerId)` - Delete controller
- `getControllerAssets(controllerId)` - Get assets managed by controller

**API Endpoints**:
- GET `/api/controllers` - List all controllers
- GET `/api/controllers/:id` - Get controller details
- POST `/api/controllers` - Create controller
- PUT `/api/controllers/:id` - Update controller
- DELETE `/api/controllers/:id` - Delete controller
- GET `/api/controllers/:id/assets` - Get controller's assets
- POST `/api/controllers/:id/heartbeat` - Heartbeat/last_seen update

---

### 4. telemetryService.js (New)
**Endpoint Base**: `/api/telemetry`

**Methods**:
- `getTelemetryByPole(poleId, limit)` - Get telemetry records for pole
- `getTelemetryById(telemetryId)` - Get specific telemetry record
- `recordTelemetry(telemetryData)` - Record new telemetry data
- `getLatestTelemetry(poleId)` - Get most recent telemetry
- `getTelemetryRange(poleId, startTime, endTime)` - Get time-range data
- `getAveragePowerUsage(poleId, hours)` - Calculate power statistics
- `deleteTelemetry(telemetryId)` - Delete telemetry record

**API Endpoints**:
- GET `/api/telemetry/pole/:poleId` - Get telemetry data (with limit query)
- GET `/api/telemetry/:id` - Get specific record
- POST `/api/telemetry` - Record new telemetry
- GET `/api/telemetry/pole/:poleId/latest` - Get latest data
- GET `/api/telemetry/pole/:poleId/range` - Get time-range data
- GET `/api/telemetry/pole/:poleId/stats` - Get power statistics

---

### 5. faultDetectionService.js (Updated)
**Endpoint Base**: `/api/faults`

**Methods**:
- `reportFault(faultData)` - Report new fault
- `getOpenFaults()` - Get all open faults
- `getFaultsByPole(poleId)` - Get faults for specific pole
- `getFaultById(faultId)` - Get fault details
- `resolveFault(faultId, newStatus)` - Update fault status
- `getFaultsByZone(zoneId)` - Get faults by zone
- `getFaultStatistics(zoneId)` - Get fault stats for zone
- `deleteFault(faultId)` - Delete fault record

**Updated Fields**:
- Using `pole_id` instead of `light_id`
- Using `zone_id` for zone filtering
- Using `fault_code` instead of `fault_type`
- Status field now "open" or "resolved" instead of with timestamps

---

### 6. maintenanceService.js (Updated)
**Endpoint Base**: `/api/maintenance`

**Methods**:
- `createTicket(ticketData)` - Create maintenance ticket
- `getPendingTickets(limit)` - Get pending/in-progress tickets
- `getTicketsByUser(assignedTo, limit)` - Get user's tickets
- `getTicketHistory(limit)` - Get all ticket history
- `updateTicketStatus(ticketId, status)` - Update ticket status
- `getTicketById(ticketId)` - Get ticket details
- `getMaintenanceStatistics()` - Get overall statistics
- `deleteTicket(ticketId)` - Delete ticket

**Updated Fields**:
- Using `maintenance_tickets` table
- Using `ticket_id` as primary identifier
- Using `fault_id` to link to faults
- Status: "open", "in_progress", "completed"

---

### 7. automationRulesService.js (New)
**Endpoint Base**: `/api/automation-rules`

**Methods**:
- `getAllRules()` - Get all rules
- `getRulesByZone(zoneId)` - Get rules for zone
- `getActiveRulesByZone(zoneId)` - Get active rules for zone
- `getRuleById(ruleId)` - Get rule details
- `createRule(ruleData)` - Create new rule
- `updateRule(ruleId, ruleData)` - Update rule
- `toggleRuleStatus(ruleId, active)` - Toggle active/inactive
- `deleteRule(ruleId)` - Delete rule

**API Endpoints**:
- GET `/api/automation-rules` - List all rules
- GET `/api/automation-rules/zone/:zoneId` - Get zone rules
- GET `/api/automation-rules/zone/:zoneId/active` - Get active zone rules
- GET `/api/automation-rules/:id` - Get rule details
- POST `/api/automation-rules` - Create rule
- PUT `/api/automation-rules/:id` - Update rule
- POST `/api/automation-rules/:id/toggle` - Toggle active status
- DELETE `/api/automation-rules/:id` - Delete rule

---

## New Controllers

All new controllers follow the same pattern with:
- Input validation using express-validator
- Proper error handling and logging
- Consistent response format: `{ success: boolean, data: object, error?: string }`

### Controllers Added:
1. `zoneController.js`
2. `controllerController.js`
3. `telemetryController.js`
4. `automationRulesController.js`

### Controllers Updated:
1. `streetLightController.js` - Changed `sectionId` to `zoneId`
2. `faultDetectionService.js` - Updated field names to match schema
3. `maintenanceController.js` - Updated for maintenance_tickets table

---

## New Routes

### Route Files Added:
1. `/src/routes/zoneRoutes.js`
2. `/src/routes/controllerRoutes.js`
3. `/src/routes/telemetryRoutes.js`
4. `/src/routes/automationRulesRoutes.js`

### Route Files Updated:
1. `/src/routes/streetLightRoutes.js` - Updated parameter names

All routes include:
- Swagger/OpenAPI documentation
- Authentication middleware
- Input validation
- Error handling

---

## Server Configuration Update

### `/src/server.js` Changes:
Added new route registrations:
```javascript
const zoneRoutes = require('./routes/zoneRoutes');
const controllerRoutes = require('./routes/controllerRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const automationRulesRoutes = require('./routes/automationRulesRoutes');

// ...

app.use('/api/zones', zoneRoutes);
app.use('/api/controllers', controllerRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/automation-rules', automationRulesRoutes);
```

---

## API Endpoints Summary

### Zones
- `GET /api/zones` - List all zones
- `GET /api/zones/:id` - Get zone details
- `POST /api/zones` - Create zone
- `PUT /api/zones/:id` - Update zone
- `DELETE /api/zones/:id` - Delete zone
- `GET /api/zones/:id/stats` - Zone statistics

### Street Lights (Assets)
- `GET /api/lights` - List lights (with zoneId filter)
- `GET /api/lights/:id` - Get light details
- `POST /api/lights` - Create light
- `PATCH /api/lights/:id/status` - Update status
- `DELETE /api/lights/:id` - Delete light

### Controllers
- `GET /api/controllers` - List controllers
- `GET /api/controllers/:id` - Get controller details
- `POST /api/controllers` - Create controller
- `PUT /api/controllers/:id` - Update controller
- `DELETE /api/controllers/:id` - Delete controller
- `GET /api/controllers/:id/assets` - Get controller's assets
- `POST /api/controllers/:id/heartbeat` - Heartbeat

### Telemetry
- `GET /api/telemetry/pole/:poleId` - Get telemetry data
- `GET /api/telemetry/:id` - Get record details
- `POST /api/telemetry` - Record telemetry
- `GET /api/telemetry/pole/:poleId/latest` - Latest data
- `GET /api/telemetry/pole/:poleId/range` - Time-range data
- `GET /api/telemetry/pole/:poleId/stats` - Power statistics

### Faults
- `GET /api/faults` - List open faults
- `GET /api/faults/:id` - Get fault details
- `POST /api/faults` - Report fault
- `PUT /api/faults/:id` - Update fault status
- `DELETE /api/faults/:id` - Delete fault

### Maintenance
- `GET /api/maintenance` - List pending tickets
- `GET /api/maintenance/:id` - Get ticket details
- `POST /api/maintenance` - Create ticket
- `PUT /api/maintenance/:id` - Update ticket status
- `DELETE /api/maintenance/:id` - Delete ticket

### Automation Rules
- `GET /api/automation-rules` - List all rules
- `GET /api/automation-rules/zone/:zoneId` - Zone rules
- `GET /api/automation-rules/:id` - Get rule details
- `POST /api/automation-rules` - Create rule
- `PUT /api/automation-rules/:id` - Update rule
- `POST /api/automation-rules/:id/toggle` - Toggle status
- `DELETE /api/automation-rules/:id` - Delete rule

---

## Files Created

### Services (4 new files):
- `src/services/zoneService.js`
- `src/services/controllerService.js`
- `src/services/telemetryService.js`
- `src/services/automationRulesService.js`

### Controllers (4 new files):
- `src/controllers/zoneController.js`
- `src/controllers/controllerController.js`
- `src/controllers/telemetryController.js`
- `src/controllers/automationRulesController.js`

### Routes (4 new files):
- `src/routes/zoneRoutes.js`
- `src/routes/controllerRoutes.js`
- `src/routes/telemetryRoutes.js`
- `src/routes/automationRulesRoutes.js`

---

## Files Updated

- `src/services/streetLightService.js` - Changed to use `assets` table
- `src/services/faultDetectionService.js` - Changed to use `faults` table
- `src/services/maintenanceService.js` - Changed to use `maintenance_tickets` table
- `src/controllers/streetLightController.js` - Updated parameter handling
- `src/routes/streetLightRoutes.js` - Updated parameter documentation
- `src/server.js` - Added new route registrations

---

## Testing Recommendations

1. Test all CRUD operations for each new endpoint
2. Verify authentication middleware is working
3. Validate error handling for missing resources
4. Test foreign key relationships (zone → assets, controllers → assets, etc.)
5. Verify filtering/sorting capabilities
6. Test timestamp handling for telemetry and controller heartbeats
7. Validate JSON field handling for automation_rules.condition
8. Test pagination/limit parameters

---

## Next Steps

1. Generate seed data for testing
2. Run database migrations if needed
3. Test all API endpoints with Postman/Swagger UI
4. Update any frontend code to use new endpoint parameter names
5. Deploy database schema changes
6. Document any additional business logic requirements
