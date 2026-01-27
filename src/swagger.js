const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NHAI Street Lighting Management System API',
      version: '1.0.0',
      description:
        'Centralized automation, monitoring, and intelligent management of street lighting systems on National Highways',
      contact: {
        name: 'NHAI Technical Team',
        email: 'tech@nhai.gov.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
      {
        url: 'https://api.nhai-streetlight.com/api',
        description: 'Production Server',
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token for authentication',
        },
      },
      schemas: {
        StreetLight: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the street light',
            },
            light_id: {
              type: 'string',
              description: 'Unique light ID code',
            },
            section_id: {
              type: 'integer',
              description: 'Highway section ID',
            },
            latitude: {
              type: 'number',
              format: 'double',
              description: 'GPS latitude coordinate',
            },
            longitude: {
              type: 'number',
              format: 'double',
              description: 'GPS longitude coordinate',
            },
            wattage: {
              type: 'integer',
              description: 'Power consumption in watts',
            },
            pole_height: {
              type: 'number',
              format: 'float',
              description: 'Pole height in meters',
            },
            status: {
              type: 'string',
              enum: ['operational', 'faulty', 'maintenance', 'offline'],
              description: 'Current status of the light',
            },
            installation_date: {
              type: 'string',
              format: 'date-time',
              description: 'Installation date',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        MonitoringData: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            light_id: {
              type: 'integer',
            },
            status: {
              type: 'string',
              enum: ['on', 'off', 'dimmed'],
            },
            power_consumption: {
              type: 'number',
              format: 'float',
              description: 'Power consumption in watts',
            },
            voltage: {
              type: 'number',
              format: 'float',
              description: 'Voltage in volts',
            },
            current: {
              type: 'number',
              format: 'float',
              description: 'Current in amperes',
            },
            brightness_level: {
              type: 'integer',
              description: 'Brightness level (0-100)',
            },
            temperature: {
              type: 'number',
              format: 'float',
              description: 'Temperature in celsius',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FaultDetection: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            light_id: {
              type: 'integer',
            },
            fault_type: {
              type: 'string',
              enum: ['lamp_failure', 'power_loss', 'circuit_fault', 'sensor_failure'],
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['open', 'resolved'],
            },
            detected_at: {
              type: 'string',
              format: 'date-time',
            },
            resolved_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        EnergyUsage: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            section_id: {
              type: 'integer',
            },
            light_id: {
              type: 'integer',
            },
            daily_consumption: {
              type: 'number',
              format: 'float',
              description: 'Daily consumption in kWh',
            },
            monthly_consumption: {
              type: 'number',
              format: 'float',
              description: 'Monthly consumption in kWh',
            },
            cost: {
              type: 'number',
              format: 'float',
              description: 'Cost in currency units',
            },
            date: {
              type: 'string',
              format: 'date',
            },
          },
        },
        Maintenance: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            light_id: {
              type: 'integer',
            },
            section_id: {
              type: 'integer',
            },
            maintenance_type: {
              type: 'string',
              enum: ['preventive', 'corrective', 'emergency'],
            },
            scheduled_date: {
              type: 'string',
              format: 'date-time',
            },
            completed_date: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
            },
            assigned_to: {
              type: 'integer',
              description: 'User ID of assigned technician',
            },
            notes: {
              type: 'string',
            },
          },
        },
        CarbonTracking: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            section_id: {
              type: 'integer',
            },
            date: {
              type: 'string',
              format: 'date',
            },
            energy_consumed_kwh: {
              type: 'number',
              format: 'float',
              description: 'Energy consumed in kWh',
            },
            co2_emissions_kg: {
              type: 'number',
              format: 'float',
              description: 'CO2 emissions in kg',
            },
            carbon_credits: {
              type: 'number',
              format: 'float',
              description: 'Carbon credits earned',
            },
            baseline_consumption: {
              type: 'number',
              format: 'float',
              description: 'Baseline energy consumption for comparison',
            },
            reduction_percentage: {
              type: 'number',
              format: 'float',
              description: 'Percentage reduction from baseline',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
