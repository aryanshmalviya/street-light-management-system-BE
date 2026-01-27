const db = require('./connection');

async function createTables() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'operator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Street Lights table
    await db.query(`
      CREATE TABLE IF NOT EXISTS street_lights (
        id SERIAL PRIMARY KEY,
        light_id VARCHAR(100) UNIQUE NOT NULL,
        section_id INTEGER NOT NULL ,
        latitude DECIMAL(9, 6),
        longitude DECIMAL(9, 6),
        wattage INTEGER,
        status VARCHAR(50) DEFAULT 'operational',
        installation_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Real-time Monitoring table
    await db.query(`
      CREATE TABLE IF NOT EXISTS monitoring_data (
        id SERIAL PRIMARY KEY,
        light_id INTEGER NOT NULL REFERENCES street_lights(id) ON DELETE CASCADE,
        status VARCHAR(50),
        power_consumption DECIMAL(10, 2),
        voltage DECIMAL(6, 2),
        current DECIMAL(6, 2),
        brightness_level INTEGER,
        temperature DECIMAL(5, 2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_monitoring_light_id ON monitoring_data(light_id);
      CREATE INDEX IF NOT EXISTS idx_monitoring_timestamp ON monitoring_data(timestamp);
    `);

    // Fault Detection table
    await db.query(`
      CREATE TABLE IF NOT EXISTS fault_detection (
        id SERIAL PRIMARY KEY,
        light_id INTEGER NOT NULL REFERENCES street_lights(id) ON DELETE CASCADE,
        fault_type VARCHAR(100),
        severity VARCHAR(50),
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_fault_light_id ON fault_detection(light_id);
      CREATE INDEX IF NOT EXISTS idx_fault_status ON fault_detection(status);
    `);

    // Energy Usage Tracking table
    await db.query(`
      CREATE TABLE IF NOT EXISTS energy_usage (
        id SERIAL PRIMARY KEY,
        section_id INTEGER NOT NULL REFERENCES highway_sections(id) ON DELETE CASCADE,
        light_id INTEGER REFERENCES street_lights(id) ON DELETE CASCADE,
        daily_consumption DECIMAL(10, 2),
        monthly_consumption DECIMAL(12, 2),
        cost DECIMAL(10, 2),
        date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_energy_section_id ON energy_usage(section_id);
      CREATE INDEX IF NOT EXISTS idx_energy_date ON energy_usage(date);
    `);

    // Maintenance Scheduling table
    await db.query(`
      CREATE TABLE IF NOT EXISTS maintenance_schedule (
        id SERIAL PRIMARY KEY,
        light_id INTEGER REFERENCES street_lights(id) ON DELETE CASCADE,
        section_id INTEGER NOT NULL REFERENCES highway_sections(id) ON DELETE CASCADE,
        maintenance_type VARCHAR(100),
        scheduled_date TIMESTAMP,
        completed_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        assigned_to INTEGER R EFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMEST AMP
      );
      CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_schedule(status);
      CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance_schedule(scheduled_date);
    `);

    // Carbon Footprint Tracking table
    await db.query(`
      CREATE TABLE IF NOT EXISTS carbon_tracking (
        id SERIAL PRIMARY KEY,
        section_id INTEGER NOT NULL REFERENCES highway_sections(id) ON DELETE CASCADE,
        date DATE,
        energy_consumed_kwh DECIMAL(12, 2),
        co2_emissions_kg DECIMAL(12, 2),
        carbon_credits DECIMAL(12, 4),
        baseline_consumption DECIMAL(12, 2),
        reduction_percentage DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_carbon_section_date ON carbon_tracking(section_id, date);
    `);

    // Alerts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        light_id INTEGER REFERENCES street_lights(id) ON DELETE CASCADE,
        section_id INTEGER REFERENCES highway_sections(id) ON DELETE CASCADE,
        alert_type VARCHAR(100),
        message TEXT,
        severity VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        acknowledged_by INTEGER REFERENCES users(id),
        acknowledged_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
      CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
    `);

    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
