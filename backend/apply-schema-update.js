const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Read schema update file
const schemaPath = path.join(__dirname, 'update-schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'simple_demo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Ashajoshi123',
});

async function updateSchema() {
  try {
    console.log('Updating database schema for file attachments...');
    
    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
      console.log('✅ Applied:', statement.substring(0, 50) + '...');
    }

    console.log('✅ Database schema updated successfully!');
  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
  } finally {
    await pool.end();
  }
}

updateSchema();
