# Quick Start Guide - NHAI Street Lighting Management System

## Prerequisites
- Node.js v14 or higher
- PostgreSQL v12 or higher
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Create a new PostgreSQL database:
```bash
createdb nhai_streetlight
```

### 3. Configure Environment
Copy the example env file and update with your credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/nhai_streetlight
JWT_SECRET=your_secret_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

### 4. Initialize Database
Create all tables:
```bash
npm run migrate
```

### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

### 6. Start the Server
For production:
```bash
npm start
```

For development (with auto-reload):
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Testing the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### View All Lights
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/lights
```

## Key Features Ready to Use

### 1. Real-time Monitoring
- Record live sensor data from street lights
- Track power consumption, voltage, current, brightness
- Query historical monitoring data

### 2. Fault Detection
- Report equipment failures
- Track fault severity and status
- Get statistics on open vs resolved issues

### 3. Energy Tracking
- Record daily energy consumption
- Analyze monthly usage patterns
- View cost breakdowns

### 4. Maintenance Management
- Schedule preventive maintenance
- Assign tasks to technicians
- Track completion status

### 5. Carbon Footprint
- Track CO2 emissions
- Calculate carbon credits
- Monitor environmental impact

## Project Structure
```
src/
├── server.js              # Main server
├── database/              # DB connection & migrations
├── middleware/            # Auth & validation
├── services/              # Business logic
├── controllers/           # API handlers
└── routes/                # Endpoint definitions
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Run production server |
| `npm run dev` | Run with auto-reload |
| `npm run migrate` | Create database tables |
| `npm run seed` | Add sample data |
| `npm test` | Run tests |

## Database Tables Created

1. **users** - System users
2. **highway_sections** - NH sections
3. **street_lights** - Light fixtures
4. **monitoring_data** - Real-time sensor data
5. **fault_detection** - Fault reports
6. **energy_usage** - Energy consumption logs
7. **maintenance_schedule** - Maintenance tasks
8. **carbon_tracking** - Emissions data
9. **alerts** - System alerts

## API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

## Next Steps

1. Integrate with IoT sensors for real-time data
2. Build frontend dashboard
3. Setup email/SMS alerts
4. Configure backup and monitoring
5. Deploy to production server

## Troubleshooting

**Database connection error:**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify database exists: `psql -l`

**Port already in use:**
- Change PORT in .env
- Or kill process: `kill -9 $(lsof -t -i:3000)`

**Migration fails:**
- Drop and recreate database
- Check PostgreSQL logs
- Verify user has CREATE privilege

## Documentation

- [Full API Documentation](./README.md)
- [Database Schema](./README.md#database-schema)
- [Sample Requests](./README.md#sample-requests)

## Support

Contact the development team for issues or questions.
