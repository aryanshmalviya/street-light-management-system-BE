# Database Seeding Guide

## Overview
The seed script populates your PostgreSQL database with sample data for testing and development.

## Prerequisites
1. **PostgreSQL running** - Make sure your database server is running
2. **Database created** - Run migrations first: `npm run migrate`
3. **Connection configured** - Check `.env` file has correct DATABASE_URL

## What Gets Seeded

### 1. Highway Sections (3 records)
- Delhi-Gurugram Stretch (NH-8)
- Gurugram-Jaipur Stretch (NH-8)
- Mumbai-Pune Stretch (NH-4)

### 2. Street Lights (30 records)
- 10 lights per section
- Random coordinates in Delhi/NCR region
- All set to 'operational' status

### 3. Monitoring Data (5 records)
- Sample power consumption
- Voltage and current readings
- Brightness levels
- Temperature data

### 4. Energy Usage (2 records)
- Daily consumption data
- Cost calculation
- For first 2 sections

### 5. Carbon Tracking (2 records)
- CO2 emissions data
- Carbon credits earned
- Baseline comparisons

## How to Run

### Step 1: Ensure Database is Ready
```bash
npm run migrate
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

### Expected Output
```
Sections created: [ 1, 2, 3 ]
Street lights created
Monitoring data created
Energy usage data created
Carbon tracking data created
Database seeding completed successfully!
```

## Troubleshooting

### Error: Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
```bash
# Windows (if installed as service)
net start postgresql-x64-15

# macOS with Homebrew
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Error: Database does not exist
```
Error: database "nhai_streetlight" does not exist
```
**Solution**: Run migrations first
```bash
npm run migrate
```

### Error: Column does not exist
```
Error: column "xxx" of relation "energy_usage" does not exist
```
**Solution**: The table structure doesn't match. Run migrations again:
```bash
npm run migrate
```

### Error: Permission denied
```
Error: permission denied for schema public
```
**Solution**: Ensure your PostgreSQL user has proper permissions
```sql
-- In PostgreSQL console
GRANT ALL PRIVILEGES ON DATABASE nhai_streetlight TO postgres;
```

## Verify Seeding Worked

### Check in PostgreSQL Console
```sql
-- Connect to database
psql -U postgres -d nhai_streetlight

-- Check highway sections
SELECT COUNT(*) FROM highway_sections;  -- Should be 3

-- Check street lights
SELECT COUNT(*) FROM street_lights;  -- Should be 30

-- Check monitoring data
SELECT COUNT(*) FROM monitoring_data;  -- Should be 5

-- Check energy usage
SELECT COUNT(*) FROM energy_usage;  -- Should be 2

-- Check carbon tracking
SELECT COUNT(*) FROM carbon_tracking;  -- Should be 2

-- Exit
\q
```

### Check in Node.js
```javascript
const db = require('./src/database/connection');

async function verify() {
  const sections = await db.query('SELECT COUNT(*) FROM highway_sections');
  console.log('Sections:', sections.rows[0].count);
  
  const lights = await db.query('SELECT COUNT(*) FROM street_lights');
  console.log('Lights:', lights.rows[0].count);
}

verify();
```

## Resetting Seed Data

If you need to clear and reseed:

### Option 1: Drop and Recreate (Complete Reset)
```bash
# Drop database
dropdb -U postgres nhai_streetlight

# Recreate and migrate
npm run migrate

# Reseed
npm run seed
```

### Option 2: Delete and Reseed (Keep Schema)
```sql
-- In PostgreSQL console
psql -U postgres -d nhai_streetlight

-- Delete data (in order to respect foreign keys)
DELETE FROM carbon_tracking;
DELETE FROM energy_usage;
DELETE FROM monitoring_data;
DELETE FROM fault_detection;
DELETE FROM maintenance_schedule;
DELETE FROM street_lights;
DELETE FROM highway_sections;
DELETE FROM alerts;

-- Then run seed again
\q
```
```bash
npm run seed
```

## Customizing Seed Data

Edit `src/database/seed.js` to customize:

### Change Highway Sections
```javascript
const sectionResult = await db.query(
  `INSERT INTO highway_sections (name, highway_number, start_km, end_km, length_km, status)
   VALUES 
   ('Your Section 1', 'NH-XX', 0, 50, 50, 'active'),
   ('Your Section 2', 'NH-YY', 0, 100, 100, 'active')
   RETURNING id`
);
```

### Change Number of Lights
```javascript
for (let i = 1; i <= 20; i++) {  // Change 20 to desired number
  // ... rest of light creation
}
```

### Change Monitoring Data
```javascript
const lightsResult = await db.query('SELECT id FROM street_lights LIMIT 10');  // Change 10 to desired count
```

## Running Seed with Other Commands

```bash
# Migrate and seed together
npm run migrate && npm run seed

# Development workflow
npm run migrate && npm run seed && npm run dev
```

## Tips

1. **Run migrations first** - Always ensure schema is up-to-date
2. **Check .env file** - Verify DATABASE_URL is correct
3. **PostgreSQL running** - Ensure database server is active
4. **No partial data** - Seed either completes fully or fails entirely
5. **Idempotent** - Safe to run multiple times

## Next Steps After Seeding

1. ✅ Start development server: `npm run dev`
2. ✅ Open Swagger UI: http://localhost:3000/api-docs
3. ✅ Test endpoints with seeded data
4. ✅ Create additional test data as needed

## Common Commands

```bash
# Full setup
npm install && npm run migrate && npm run seed && npm run dev

# Just reseed
npm run seed

# Check what's in database
psql -U postgres -d nhai_streetlight -c "SELECT COUNT(*) as total_lights FROM street_lights;"

# Reset everything
dropdb -U postgres nhai_streetlight && npm run migrate && npm run seed
```

## Support

If seeding fails:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Check migrations ran successfully
4. Review error message in console
5. Check database permissions
6. Review [SWAGGER_EXAMPLES.md](SWAGGER_EXAMPLES.md) for database setup help

---

**Status**: Ready to seed! Run `npm run seed` after migrations.
