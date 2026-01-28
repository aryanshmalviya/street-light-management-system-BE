const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  max: 20,
  idleTimeoutMillis: 120000,      
  connectionTimeoutMillis: 120000, 
});


pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
