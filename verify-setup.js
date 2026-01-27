const db = require('./src/database/connection');
const logger = require('./src/utils/logger');

async function verifySetup() {
  try {
    console.log('🔍 Verifying NHAI Street Lighting Management System Setup...\n');

    // Check database connection
    console.log('✓ Checking database connection...');
    await db.query('SELECT 1');
    console.log('  ✅ Database connected successfully\n');

    // Check tables
    console.log('✓ Checking database tables...');
    const tables = [
      'users',
      'highway_sections',
      'street_lights',
      'monitoring_data',
      'fault_detection',
      'energy_usage',
      'maintenance_schedule',
      'carbon_tracking',
      'alerts',
    ];

    const result = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const existingTables = result.rows.map(r => r.table_name);

    for (const table of tables) {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - NOT FOUND`);
      }
    }
    console.log();

    // Check environment variables
    console.log('✓ Checking environment variables...');
    const envVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
    for (const envVar of envVars) {
      if (process.env[envVar]) {
        console.log(
          `  ✅ ${envVar} = ${envVar === 'JWT_SECRET' || envVar === 'DATABASE_URL' ? '***hidden***' : process.env[envVar]}`
        );
      } else {
        console.log(`  ⚠️  ${envVar} - NOT SET`);
      }
    }
    console.log();

    console.log('✓ Sample query - Count of lights...');
    const lightsCount = await db.query('SELECT COUNT(*) FROM street_lights');
    console.log(
      `  ✅ Found ${lightsCount.rows[0].count} street lights\n`
    );

    console.log('========================================');
    console.log('🎉 Setup verification successful!');
    console.log('========================================\n');

    console.log('Ready to start the server!');
    console.log('Run: npm start  (for production)');
    console.log('     npm run dev (for development)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification failed:');
    console.error(error.message);
    console.error('\nSetup Instructions:');
    console.error('1. Ensure PostgreSQL is running');
    console.error('2. Create database: createdb nhai_streetlight');
    console.error('3. Configure .env file with DATABASE_URL');
    console.error('4. Run migrations: npm run migrate');
    console.error('5. (Optional) Seed data: npm run seed\n');
    process.exit(1);
  }
}

verifySetup();
