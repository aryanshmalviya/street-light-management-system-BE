#!/usr/bin/env node

const db = require('./src/database/connection');

async function checkDatabase() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║          DATABASE SEEDING DIAGNOSTIC TOOL                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // Test 1: Database Connection
    console.log('🔍 Test 1: Database Connection');
    const connTest = await db.query('SELECT NOW()');
    console.log('   ✅ Connected to database successfully');
    console.log(`   Current time: ${connTest.rows[0].now}\n`);

    // Test 2: Check Tables Exist
    console.log('🔍 Test 2: Checking if tables exist');
    const tablesQuery = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tablesResult = await db.query(tablesQuery);
    const tables = tablesResult.rows.map(r => r.table_name);
    
    if (tables.length === 0) {
      console.log('   ❌ No tables found! Run migrations first:');
      console.log('      $ npm run migrate\n');
    } else {
      console.log(`   ✅ Found ${tables.length} tables:`);
      tables.forEach(t => console.log(`      • ${t}`));
      console.log();
    }

    // Test 3: Check Data in Tables
    console.log('🔍 Test 3: Data in tables');
    const requiredTables = [
      'highway_sections',
      'street_lights',
      'monitoring_data',
      'energy_usage',
      'carbon_tracking',
      'fault_detection',
      'maintenance_schedule'
    ];

    let hasData = false;
    for (const table of requiredTables) {
      try {
        const countResult = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        const status = count > 0 ? '✅' : '❌';
        console.log(`   ${status} ${table}: ${count} records`);
        if (count > 0) hasData = true;
      } catch (err) {
        console.log(`   ⚠️  ${table}: TABLE NOT FOUND`);
      }
    }
    console.log();

    if (!hasData) {
      console.log('📊 No data found. Ready to seed!\n');
    } else {
      console.log('📊 Database has data.\n');
    }

    // Test 4: Check for Issues
    console.log('🔍 Test 4: Checking for common issues');
    
    // Check street lights without sections
    const orphanLights = await db.query(`
      SELECT COUNT(*) as count FROM street_lights 
      WHERE section_id NOT IN (SELECT id FROM highway_sections)
    `);
    if (parseInt(orphanLights.rows[0].count) > 0) {
      console.log(`   ⚠️  Found ${orphanLights.rows[0].count} street lights without valid sections`);
    } else {
      console.log('   ✅ No orphaned street lights');
    }

    // Check monitoring data without lights
    const orphanMonitoring = await db.query(`
      SELECT COUNT(*) as count FROM monitoring_data 
      WHERE light_id NOT IN (SELECT id FROM street_lights)
    `);
    if (parseInt(orphanMonitoring.rows[0].count) > 0) {
      console.log(`   ⚠️  Found ${orphanMonitoring.rows[0].count} monitoring records without valid lights`);
    } else {
      console.log('   ✅ No orphaned monitoring data');
    }

    console.log();

    // Test 5: Sample Data
    console.log('🔍 Test 5: Sample data from tables');
    
    try {
      const sectionSample = await db.query('SELECT * FROM highway_sections LIMIT 1');
      if (sectionSample.rows.length > 0) {
        console.log('   ✅ Highway Section:');
        console.log(`      ${JSON.stringify(sectionSample.rows[0], null, 2)}`);
      }
    } catch (err) {
      console.log('   ℹ️  No highway sections data');
    }

    try {
      const lightSample = await db.query('SELECT * FROM street_lights LIMIT 1');
      if (lightSample.rows.length > 0) {
        console.log('\n   ✅ Street Light:');
        console.log(`      ${JSON.stringify(lightSample.rows[0], null, 2)}`);
      }
    } catch (err) {
      console.log('   ℹ️  No street lights data');
    }

    console.log('\n');

    // Recommendations
    console.log('💡 Recommendations');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (tables.length === 0) {
      console.log('   1. Run migrations: npm run migrate');
      console.log('   2. Run seed: npm run seed\n');
    } else if (!hasData) {
      console.log('   ✨ Database schema is ready!');
      console.log('   ✅ Run: npm run seed\n');
    } else {
      console.log('   📊 Database already has data');
      console.log('   ℹ️  To reseed:');
      console.log('      Option 1 (Clear and reseed):');
      console.log('         psql -U postgres -d nhai_streetlight -c "DELETE FROM carbon_tracking;');
      console.log('         DELETE FROM energy_usage; DELETE FROM monitoring_data;');
      console.log('         DELETE FROM fault_detection; DELETE FROM maintenance_schedule;');
      console.log('         DELETE FROM street_lights; DELETE FROM highway_sections;"');
      console.log('         npm run seed');
      console.log('      Option 2 (Full reset):');
      console.log('         dropdb -U postgres nhai_streetlight');
      console.log('         npm run migrate');
      console.log('         npm run seed\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check if PostgreSQL is running');
    console.error('   2. Verify DATABASE_URL in .env file');
    console.error('   3. Ensure database user has permissions');
    console.error('   4. Run: npm run migrate (to create tables)\n');
    process.exit(1);
  }
}

checkDatabase();
