const db = require('../database/connection');

async function seedDatabase() {
  try {
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
        await db.query(
          `INSERT INTO street_lights (light_id, section_id, latitude, longitude, wattage, pole_height, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'operational')`,
          [
            `LIGHT-${sectionId}-${String(i).padStart(3, '0')}`,
            sectionId,
            28.5 + (Math.random() * 2),
            77.0 + (Math.random() * 2),
            150,
            10.5,
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
          145 + Math.random() * 10,
          230 + Math.random() * 5,
          0.63 + Math.random() * 0.1,
          82 + Math.random() * 10,
          42 + Math.random() * 5,
        ]
      );
    }

    console.log('Monitoring data created');

    // Insert sample energy usage
    const sectionsForEnergy = sectionIds.slice(0, 2);
    for (const sectionId of sectionsForEnergy) {
      await db.query(
        `INSERT INTO energy_usage (section_id, daily_consumption, cost, date)
         VALUES ($1, $2, $3, $4)`,
        [
          sectionId,
          500 + Math.random() * 100,
          5000 + Math.random() * 1000,
          new Date().toISOString().split('T')[0],
        ]
      );
    }

    console.log('Energy usage data created');

    // Insert sample carbon tracking
    for (const sectionId of sectionsForEnergy) {
      await db.query(
        `INSERT INTO carbon_tracking (section_id, date, energy_consumed_kwh, co2_emissions_kg, carbon_credits, baseline_consumption, reduction_percentage)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          sectionId,
          new Date().toISOString().split('T')[0],
          500 + Math.random() * 100,
          250 + Math.random() * 50,
          5 + Math.random() * 2,
          600,
          10 + Math.random() * 5,
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
