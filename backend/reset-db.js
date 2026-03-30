const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Read schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// First connect to postgres database
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Ashajoshi123',
});

async function resetDatabase() {
  try {
    console.log('Resetting database...');

    // Force terminate all connections to simple_demo database
    await pool.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = 'simple_demo' AND pid <> pg_backend_pid()
    `);
    console.log('Terminated existing connections');

    // Drop the database
    await pool.query(`DROP DATABASE IF EXISTS simple_demo`);
    console.log('Dropped existing database');

    // Create the database
    await pool.query(`CREATE DATABASE simple_demo`);
    console.log('Database "simple_demo" created successfully');
  } catch (error) {
    console.error('Error resetting database:', error.message);
    return;
  } finally {
    await pool.end();
  }

  // Now connect to our database and run schema
  const appPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: 'simple_demo',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Ashajoshi123',
  });

  try {
    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await appPool.query(statement);
    }

    console.log('Database schema and initial data loaded successfully!');
  } catch (error) {
    console.error('Error setting up schema:', error.message);
  } finally {
    await appPool.end();
  }
}

resetDatabase();
