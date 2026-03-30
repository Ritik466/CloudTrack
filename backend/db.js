const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

if (typeof process.env.DB_PASSWORD !== 'string' || process.env.DB_PASSWORD.length === 0) {
  throw new Error('DB_PASSWORD is missing. Add it to backend/.env');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'simple_demo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
