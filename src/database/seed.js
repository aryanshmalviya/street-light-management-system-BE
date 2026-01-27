const db = require('../database/connection');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Insert default users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const usersResult = await db.query(
      `INSERT INTO users (email, password, name, role)
       VALUES 
       ($1, $2, 'Admin User', 'admin'),
       ($3, $2, 'Operator User', 'operator'),
       ($4, $2, 'Viewer User', 'viewer')
       RETURNING id, email, name, role`,
      [
        'admin@nhai.com',
        hashedPassword,
        'operator@nhai.com',
        'viewer@nhai.com'
      ]
    );
    
    console.log('Default users created:');
    usersResult.rows.forEach(user => {
      console.log(`  ✓ ${user.email} (${user.role})`);
    });
    console.log('  Password for all: password123\n');

    // Insert highway sections
    const sectionResult = await db.query(
      `INSERT INTO highway_sections (name, highway_number, start_km, end_km, length_km, status)
       VALUES 
       ('Delhi-Gurugram Stretch', 'NH-8', 0, 30, 30, 'active'),
       ('Gurugram-Jaipur Stretch', 'NH-8', 30, 100, 70, 'active'),
       ('Mumbai-Pune Stretch', 'NH-4', 0, 120, 120, 'active')
       RETURNING id`
    );

    const sectionIds = sectionResult.rows.map(r => r.id);
    console.log('Sections created:', sectionIds);

    // Insert street lights
    for (const sectionId of sectionIds) {
      for (let i = 1; i <= 10; i++) {
        const latitude = parseFloat((28.5 + (Math.random() * 2)).toFixed(6));
        const longitude = parseFloat((77.0 + (Math.random() * 2)).toFixed(6));
        
        await db.query(
          `INSERT INTO street_lights (light_id, section_id, latitude, longitude, wattage, pole_height, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'operational')`,
          [
            `LIGHT-${sectionId}-${String(i).padStart(3, '0')}`,
            sectionId,
            latitude,
            longitude,
            parseInt(150, 10),
            parseFloat((10.5).toFixed(2)),
          ]
        );
      }
    }

    console.log('Street lights created');

    // Insert sample monitoring data
    const lightsResult = await db.query('SELECT id FROM street_lights LIMIT 5');
    for (const light of lightsResult.rows) {
      await db.query(
        `INSERT INTO monitoring_data (light_id, status, power_consumption, voltage, current, brightness_level, temperature)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          light.id,
          'operational',
          parseFloat((145 + Math.random() * 10).toFixed(2)),
          parseFloat((230 + Math.random() * 5).toFixed(2)),
          parseFloat((0.63 + Math.random() * 0.1).toFixed(2)),
          parseInt(82 + Math.random() * 10, 10),
          parseFloat((42 + Math.random() * 5).toFixed(2)),
        ]
      );
    }

    console.log('Monitoring data created');

    // Insert sample energy usage
    const sectionsForEnergy = sectionIds.slice(0, 2);
    const lightsForEnergy = await db.query('SELECT id, section_id FROM street_lights WHERE section_id = ANY($1) LIMIT 2', [sectionsForEnergy]);
    
    for (const sectionId of sectionsForEnergy) {
      const lightForSection = lightsForEnergy.rows.find(l => l.section_id === sectionId);
      await db.query(
        `INSERT INTO energy_usage (section_id, light_id, daily_consumption, cost, date)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          sectionId,
          lightForSection ? lightForSection.id : null,
          Math.round((500 + Math.random() * 100) * 100) / 100,
          Math.round((5000 + Math.random() * 1000) * 100) / 100,
          new Date().toISOString().split('T')[0],
        ]
      );
    }

    console.log('Energy usage data created');

    // Insert sample carbon tracking
    for (const sectionId of sectionsForEnergy) {
      const energyConsumed = 500 + Math.random() * 100;
      const co2Emissions = energyConsumed * 0.5; // 0.5 kg CO2 per kWh
      const reductionPercent = 10 + Math.random() * 5;
      
      await db.query(
        `INSERT INTO carbon_tracking (section_id, date, energy_consumed_kwh, co2_emissions_kg, carbon_credits, baseline_consumption, reduction_percentage)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          sectionId,
          new Date().toISOString().split('T')[0],
          Math.round(energyConsumed * 100) / 100,
          Math.round(co2Emissions * 100) / 100,
          Math.round((co2Emissions / 1000) * 100) / 100,
          600,
          Math.round(reductionPercent * 100) / 100,
        ]
      );
    }

    console.log('Carbon tracking data created');
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
