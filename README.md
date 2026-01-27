# NHAI Street Lighting Management System - Backend API

A comprehensive Node.js backend application for centralized automation, monitoring, and intelligent management of street lighting systems on National Highways.

## Features

✅ **Real-time Monitoring** - Live tracking of street light status, power consumption, voltage, current, and brightness levels
✅ **Fault Detection & Alerts** - Automatic detection and reporting of light failures with severity levels
✅ **Energy Usage Tracking** - Daily and monthly energy consumption monitoring with cost analysis
✅ **Maintenance Scheduling** - Automated maintenance scheduling with assignment and completion tracking
✅ **Carbon Footprint Tracking** - Environmental impact monitoring and carbon credit calculations
✅ **Swagger API Documentation** - Interactive API explorer for testing endpoints
✅ **Real-time Updates** - WebSocket support via Socket.IO for live data streaming
✅ **Centralized Control** - Unified management of all highway sections
✅ **Carbon Footprint Reporting** - Environmental impact tracking including CO2 emissions and carbon credits
✅ **Centralized Control** - Manage all highway sections and lights from a single dashboard
✅ **WebSocket Real-time Updates** - Live data streaming for monitoring dashboards
✅ **JWT Authentication** - Secure API access with role-based authorization

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT
- **Validation:** Express-validator
- **Logging:** Winston
- **Security:** Helmet, CORS

## Project Structure

```
src/
├── server.js                 # Main application file
├── database/
│   ├── connection.js         # Database connection pool
│   └── migrations.js         # Database schema creation
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── controllers/             # Request handlers
│   ├── streetLightController.js
│   ├── monitoringController.js
│   ├── faultDetectionController.js
│   ├── energyTrackingController.js
│   ├── maintenanceController.js
│   └── carbonTrackingController.js
├── services/                # Business logic layer
│   ├── streetLightService.js
│   ├── monitoringService.js
│   ├── faultDetectionService.js
│   ├── energyTrackingService.js
│   ├── maintenanceService.js
│   └── carbonTrackingService.js
├── routes/                  # API endpoints
│   ├── streetLightRoutes.js
│   ├── monitoringRoutes.js
│   ├── faultDetectionRoutes.js
│   ├── energyTrackingRoutes.js
│   ├── maintenanceRoutes.js
│   └── carbonTrackingRoutes.js
└── utils/
    └── logger.js           # Winston logger configuration
```

## Installation

### Prerequisites
- Node.js v14+
- PostgreSQL v12+

### Setup Steps

1. **Clone the repository**
   ```bash
   cd nhai-streetlight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/nhai_streetlight
   JWT_SECRET=your_secret_key_here
   PORT=3000
   ```

4. **Create the database**
   ```bash
   createdb nhai_streetlight
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Documentation (Swagger/OpenAPI)

### Interactive API Explorer

Once the server is running, access the **Swagger UI** at:

```
http://localhost:3000/api-docs
```

### Features in Swagger UI

✨ **Try It Out** - Test API endpoints directly in the browser
📋 **Complete Schema** - View request/response formats
🔐 **Authentication** - Add JWT tokens for protected endpoints  
📚 **Detailed Documentation** - Parameter descriptions and examples

### Using Swagger to Test Endpoints

1. Open `http://localhost:3000/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Fill in required parameters
5. Click "Execute" to send request
6. View response in real-time

### Example: Testing Create Light Endpoint

```bash
# The Swagger UI will auto-generate this curl command:
curl -X POST "http://localhost:3000/api/lights" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "light_id": "NH-001-001",
    "section_id": 1,
    "latitude": 28.7041,
    "longitude": 77.1025,
    "wattage": 150,
    "pole_height": 10.5
  }'
```

## API Endpoints

### Street Lights Management
- `GET /api/lights` - Get all lights
- `GET /api/lights/:id` - Get light by ID
- `POST /api/lights` - Create a new light
- `PATCH /api/lights/:id/status` - Update light status
- `DELETE /api/lights/:id` - Delete a light

### Real-time Monitoring
- `POST /api/monitoring/record` - Record monitoring data
- `GET /api/monitoring/:lightId/latest` - Get latest monitoring data
- `GET /api/monitoring/:lightId/range` - Get monitoring data for date range
- `GET /api/monitoring/section/status` - Get all lights status in section

### Fault Detection
- `POST /api/faults/report` - Report a fault
- `GET /api/faults/open` - Get all open faults
- `GET /api/faults/:lightId` - Get faults for a specific light
- `PATCH /api/faults/:faultId/resolve` - Resolve a fault
- `GET /api/faults/section/stats` - Get fault statistics

### Energy Tracking
- `POST /api/energy/record` - Record energy usage
- `GET /api/energy/daily?sectionId=X&date=YYYY-MM-DD` - Get daily usage
- `GET /api/energy/monthly?sectionId=X&month=M&year=YYYY` - Get monthly usage
- `GET /api/energy/trends?sectionId=X&days=30` - Get energy trends

### Maintenance Scheduling
- `POST /api/maintenance/schedule` - Schedule maintenance
- `GET /api/maintenance/pending?sectionId=X` - Get pending tasks
- `GET /api/maintenance/history?sectionId=X` - Get maintenance history
- `PATCH /api/maintenance/:maintenanceId/complete` - Mark as complete
- `GET /api/maintenance/stats?sectionId=X` - Get statistics

### Carbon Footprint
- `POST /api/carbon/record` - Record carbon footprint data
- `GET /api/carbon/report?sectionId=X&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get report
- `GET /api/carbon/daily?sectionId=X&date=YYYY-MM-DD` - Get daily data
- `GET /api/carbon/trends?sectionId=X&months=12` - Get monthly trends
- `GET /api/carbon/impact?sectionId=X` - Get environmental impact

### Health Check
- `GET /api/health` - Check API status

## Database Schema

### Tables
- **users** - System users with role-based access
- **highway_sections** - NH sections managed by the system
- **street_lights** - Individual light fixtures with GPS coordinates
- **monitoring_data** - Real-time sensor data for each light
- **fault_detection** - Fault reports and resolution tracking
- **energy_usage** - Daily and hourly energy consumption logs
- **maintenance_schedule** - Scheduled and completed maintenance tasks
- **carbon_tracking** - CO2 emissions and carbon credits tracking
- **alerts** - System alerts for anomalies

## WebSocket Events

### Client-side Emit
- `subscribe_light` - Subscribe to updates for a specific light
- `unsubscribe_light` - Unsubscribe from a light

### Server-side Emit
- `monitoring_update` - Real-time monitoring data
- `fault_alert` - New fault detected
- `alert_notification` - System alert

## Authentication

All API endpoints (except `/api/health`) require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Sample Requests

### Record Monitoring Data
```bash
curl -X POST http://localhost:3000/api/monitoring/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "light_id": 1,
    "status": "operational",
    "power_consumption": 150.5,
    "voltage": 230,
    "current": 0.65,
    "brightness_level": 85,
    "temperature": 45.2
  }'
```

### Report a Fault
```bash
curl -X POST http://localhost:3000/api/faults/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "light_id": 5,
    "fault_type": "lamp_failure",
    "severity": "high",
    "description": "Light not switching on at dusk"
  }'
```

### Record Energy Usage
```bash
curl -X POST http://localhost:3000/api/energy/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "section_id": 1,
    "light_id": 5,
    "daily_consumption": 12.5,
    "cost": 125.0,
    "date": "2024-01-27"
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `SOCKET_IO_CORS` | Socket.IO CORS origin | localhost:3000 |

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error messages
- `combined.log` - All logs

Console output includes colorized logs in development mode.

## Performance Optimization

- Indexed database queries for fast lookups
- Connection pooling for PostgreSQL
- Real-time WebSocket instead of polling
- Request validation before processing
- Error handling and graceful degradation

## Future Enhancements

- [ ] Machine learning for predictive fault detection
- [ ] Mobile app for field technicians
- [ ] Integration with weather APIs for optimal scheduling
- [ ] SMS/Email alerts for critical faults
- [ ] Advanced analytics and reporting dashboard
- [ ] Integration with renewable energy systems
- [ ] Multi-language support

## Contributing

This is a hackathon project. Contributions are welcome!

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact the development team.
