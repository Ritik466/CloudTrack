const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Read schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

if (typeof process.env.DB_PASSWORD !== 'string' || process.env.DB_PASSWORD.length === 0) {
  throw new Error('DB_PASSWORD is missing. Add it to backend/.env');
}

const databaseName = process.env.DB_NAME || 'simple_demo';
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

// First connect to postgres database to create our database
const pool = new Pool({
  ...connectionConfig,
  database: 'postgres', // Connect to default postgres database
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Drop the database if it exists to recreate with new schema
    await pool.query(`DROP DATABASE IF EXISTS ${databaseName}`);
    console.log('Dropped existing database');

    // Create the database
    await pool.query(`CREATE DATABASE ${databaseName}`);
    console.log(`Database "${databaseName}" created successfully`);
  } catch (error) {
    console.error('Error setting up database:', error.message);
    return;
  } finally {
    await pool.end();
  }

  // Now connect to our database and run schema
  const appPool = new Pool({
    ...connectionConfig,
    database: databaseName,
  });

  try {
    // Run the schema as one script so SQL bodies containing semicolons still execute correctly.
    await appPool.query(schema);

    console.log('Database schema and initial data loaded successfully!');
  } catch (error) {
    console.error('Error setting up schema:', error.message);
  } finally {
    await appPool.end();
  }
}

setupDatabase();
