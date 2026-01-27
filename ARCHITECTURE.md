# Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend/Mobile App                │
│              (React/Vue/Flutter App)                │
└────────────────┬──────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    HTTP/REST         WebSocket
         │         (Real-time)
         │                │
┌────────▼────────────────▼────────────────────────────┐
│          Node.js Express API Server                  │
│     (src/server.js - Runs on port 3000)             │
└────────┬──────────────────────────────────┬──────────┘
         │                                  │
    ┌────▼──────────────┐         ┌────────▼─────┐
    │  API Endpoints    │         │  WebSocket   │
    │  - /api/lights    │         │  Connection  │
    │  - /api/monitoring│         │  for Updates │
    │  - /api/faults    │         └──────┬───────┘
    │  - /api/energy    │                │
    │  - /api/maintenance
    │  - /api/carbon    │
    └────┬──────────────┘
         │
    ┌────▼─────────────────────────────────┐
    │   Business Logic Layer (Services)    │
    │  - StreetLightService                │
    │  - MonitoringService                 │
    │  - FaultDetectionService             │
    │  - EnergyTrackingService             │
    │  - MaintenanceService                │
    │  - CarbonTrackingService             │
    └────┬─────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │  PostgreSQL Database                 │
    │  - highway_sections                  │
    │  - street_lights                     │
    │  - monitoring_data                   │
    │  - fault_detection                   │
    │  - energy_usage                      │
    │  - maintenance_schedule              │
    │  - carbon_tracking                   │
    │  - alerts                            │
    └──────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime:** Node.js v14+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Direct pg library (no ORM)
- **Authentication:** JWT
- **Real-time:** Socket.IO
- **Logging:** Winston
- **Security:** Helmet, CORS, bcryptjs

### Development Tools
- **Package Manager:** npm
- **Dev Server:** Nodemon
- **Testing:** Jest (ready to use)
- **Version Control:** Git

## Project Structure Explanation

```
nhai-streetlight/
├── src/
│   ├── server.js                 # Main app entry point
│   ├── database/
│   │   ├── connection.js         # PostgreSQL connection pool
│   │   ├── migrations.js         # Schema creation
│   │   └── seed.js              # Sample data
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── controllers/              # HTTP request handlers
│   │   ├── streetLightController.js
│   │   ├── monitoringController.js
│   │   ├── faultDetectionController.js
│   │   ├── energyTrackingController.js
│   │   ├── maintenanceController.js
│   │   └── carbonTrackingController.js
│   ├── services/                # Business logic
│   │   ├── streetLightService.js
│   │   ├── monitoringService.js
│   │   ├── faultDetectionService.js
│   │   ├── energyTrackingService.js
│   │   ├── maintenanceService.js
│   │   └── carbonTrackingService.js
│   ├── routes/                  # API endpoints
│   │   ├── streetLightRoutes.js
│   │   ├── monitoringRoutes.js
│   │   ├── faultDetectionRoutes.js
│   │   ├── energyTrackingRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   └── carbonTrackingRoutes.js
│   └── utils/
│       └── logger.js            # Winston logger
├── logs/                        # Application logs
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── README.md                    # Documentation
├── QUICKSTART.md               # Quick setup guide
├── API_REFERENCE.md            # Complete API docs
├── verify-setup.js             # Setup verification
└── knexfile.js                 # Knex config (for migrations)
```

## Data Flow

### Real-time Monitoring Data Flow
```
IoT Sensor
    ↓
POST /api/monitoring/record
    ↓
MonitoringController
    ↓
MonitoringService.recordMonitoringData()
    ↓
INSERT INTO monitoring_data (PostgreSQL)
    ↓
io.to(`light_${lightId}`).emit('monitoring_update', data)
    ↓
Connected Clients (WebSocket)
    ↓
Dashboard Updates in Real-time
```

### Fault Detection Flow
```
Monitoring System detects abnormality
    ↓
POST /api/faults/report
    ↓
FaultDetectionController
    ↓
FaultDetectionService.reportFault()
    ↓
INSERT INTO fault_detection (PostgreSQL)
    ↓
io.emit('fault_alert', { ... })
    ↓
Alert sent to Operators
    ↓
Maintenance auto-scheduled (future)
```

## Deployment Strategies

### Option 1: Docker Deployment (Recommended for Hackathon)

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/nhai_streetlight
      JWT_SECRET: your_secret_here
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nhai_streetlight
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 2: Cloud Deployment

#### AWS EC2
1. Launch Ubuntu instance
2. Install Node.js and PostgreSQL
3. Clone repository
4. Run migrations
5. Use PM2 for process management

#### Heroku
```bash
heroku login
heroku create nhai-streetlight
heroku addons:create heroku-postgresql
git push heroku main
```

#### Google Cloud Run
```bash
gcloud run deploy nhai-streetlight \
  --source . \
  --platform managed
```

### Option 3: Traditional Server Deployment

#### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name "nhai-api"
pm2 save
pm2 startup
```

#### Using Systemd (Linux)
Create `/etc/systemd/system/nhai-streetlight.service`:
```ini
[Unit]
Description=NHAI Street Lighting API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/nhai-streetlight
ExecStart=/usr/bin/node src/server.js
Restart=always
Environment="NODE_ENV=production"
Environment="DATABASE_URL=postgresql://..."

[Install]
WantedBy=multi-user.target
```

## Performance Optimization

### Database
- ✅ Indexed queries on frequently searched columns
- ✅ Connection pooling (pg library)
- ✅ Query optimization with LIMIT/OFFSET

### Caching (Future)
```javascript
// Add Redis for caching
const redis = require('redis');
const cache = redis.createClient();

// Cache monitoring data
cache.setex(`light:${lightId}:latest`, 60, JSON.stringify(data));
```

### API Scaling
- Horizontal scaling with load balancer
- Separate read/write PostgreSQL instances
- Message queue (RabbitMQ/Kafka) for batch operations

### WebSocket Scaling
- Use Socket.IO adapter for clustering
- Redis adapter for multiple server instances

## Security Considerations

### Currently Implemented
- ✅ JWT authentication on all endpoints
- ✅ Helmet for HTTP headers
- ✅ CORS protection
- ✅ Input validation with express-validator
- ✅ Environment variable isolation

### Recommended Additions
- [ ] Rate limiting (express-rate-limit)
- [ ] API key rotation
- [ ] SSL/TLS certificates
- [ ] Database encryption at rest
- [ ] Audit logging
- [ ] Request signing
- [ ] HTTPS enforcement
- [ ] Security headers (CSP, X-Frame-Options, etc.)

## Monitoring & Logging

### Current Setup
- Winston logger for application logs
- Console output in development
- File output (error.log, combined.log)

### Recommended Tools
- **Sentry** for error tracking
- **New Relic** for performance monitoring
- **ELK Stack** for centralized logging
- **Prometheus** for metrics
- **Grafana** for visualization

## Backup Strategy

### Database Backups
```bash
# Manual backup
pg_dump nhai_streetlight > backup_$(date +%Y%m%d).sql

# Automated daily backup (cron job)
0 2 * * * pg_dump nhai_streetlight > /backups/db_$(date +\%Y\%m\%d).sql
```

### Point-in-time Recovery (PITR)
Enable PostgreSQL WAL archiving for recovery.

## Testing Strategy

### Unit Tests
```javascript
// Example: StreetLightService test
describe('StreetLightService', () => {
  it('should get all lights', async () => {
    const lights = await StreetLightService.getAllLights();
    expect(lights).toBeArray();
  });
});
```

### Integration Tests
Test complete flows from API to database.

### Load Testing
```bash
npm install -g artillery
artillery quick --count 100 --num 1000 http://localhost:3000/api/health
```

## Continuous Integration/Deployment

### GitHub Actions Workflow
```yaml
name: CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run migrate
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Error tracking (Sentry) setup
- [ ] APM (Application Performance Monitoring) enabled
- [ ] Logs aggregation configured
- [ ] Monitoring/alerting setup
- [ ] Database indexed for production
- [ ] Connection pooling optimized
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Disaster recovery plan documented

## Scaling Considerations

### Horizontal Scaling
- Load balancer (nginx/HAProxy)
- Multiple Node.js instances
- Redis for session management

### Vertical Scaling
- More CPU/RAM per instance
- PostgreSQL optimization
- Query optimization

### Database Scaling
- Read replicas for reporting queries
- Sharding for massive datasets
- Archive old monitoring data

## Monitoring Alerts

### Key Metrics to Monitor
- API response time
- Database query time
- Error rates
- Memory usage
- CPU usage
- Connection pool status
- Disk space
- Active WebSocket connections

### Alert Thresholds
- Response time > 1000ms → Warning
- Error rate > 1% → Critical
- Memory > 80% → Warning
- CPU > 85% → Critical
- Database connections > 90% of pool → Warning

## Documentation for Hackathon Judges

Include these in your submission:
1. ✅ Architecture diagram
2. ✅ API documentation
3. ✅ Database schema
4. ✅ Setup instructions
5. ✅ Sample requests
6. ✅ Performance metrics
7. ✅ Environmental impact calculations
8. ✅ Scalability plan

## Future Enhancements

1. **Predictive Analytics**
   - ML model for fault prediction
   - Optimal scheduling suggestions

2. **Mobile App**
   - Native or React Native app
   - Offline-first synchronization

3. **Advanced Reporting**
   - PDF export
   - Scheduled reports
   - Custom dashboards

4. **Integration**
   - SMS/Email alerts
   - Weather API integration
   - Energy exchange APIs

5. **Optimization**
   - Automatic brightness adjustment
   - Time-based scheduling
   - Weather-based efficiency

---

**Version:** 1.0.0  
**Last Updated:** January 27, 2024
