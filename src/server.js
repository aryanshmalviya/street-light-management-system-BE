require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const logger = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const streetLightRoutes = require('./routes/streetLightRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');
const faultDetectionRoutes = require('./routes/faultDetectionRoutes');
const energyTrackingRoutes = require('./routes/energyTrackingRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const carbonTrackingRoutes = require('./routes/carbonTrackingRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const controllerRoutes = require('./routes/controllerRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const automationRulesRoutes = require('./routes/automationRulesRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS || '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    tryItOutEnabled: true,
    filter: true,
    docExpansion: 'list'
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lights', streetLightRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/controllers', controllerRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/automation-rules', automationRulesRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/faults', faultDetectionRoutes);
app.use('/api/energy', energyTrackingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/carbon', carbonTrackingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
