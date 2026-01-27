const db = require('./src/database/connection');

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...\n');

    // Delete all records in the correct order (respecting foreign keys)
    const tables = [
      'alerts',
      'fault_detection',
      'maintenance_schedule',
      'carbon_tracking',
      'energy_usage',
      'monitoring_data',
      'street_lights',
      'highway_sections',
      'users'
    ];

    for (const table of tables) {
      await db.query(`DELETE FROM ${table}`);
      console.log(`✅ Cleared ${table}`);
    }

    console.log('\n✅ All records deleted successfully!');
    console.log('\n📊 Running seed script...\n');

    // Now run the seed
    const seedModule = require('./src/database/seed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  }
}

resetDatabase();
