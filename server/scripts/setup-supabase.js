// server/scripts/setup-supabase.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is missing in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function setup() {
  console.log('🚀 Starting Supabase Setup...');

  try {
    // 1. Run Schema
    console.log('⏳ Running schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Schema initialized.');

    // 2. Prompt or Use Provided Admin Details
    // For this automated script, we use placeholders or args
    const adminName = process.argv[2] || 'System Administrator';
    const adminEmail = process.argv[3] || 'admin@playstation.com';
    const adminPassword = process.argv[4] || 'Admin@123';

    console.log(`⏳ Creating first Admin: ${adminEmail}...`);
    
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (userExists.rows.length > 0) {
      console.log('⚠️ Admin user already exists. Skipping creation.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await pool.query(
        'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
        [adminName, adminEmail, hashedPassword, 'HQ Command Center', 'admin']
      );
      console.log('✅ System Administrator created successfully.');
      console.log(`🔑 Login: ${adminEmail} / ${adminPassword}`);
    }

    console.log('🎉 Setup Complete! Your Store Rating System is ready for action.');
  } catch (err) {
    console.error('❌ Setup failed:', err);
  } finally {
    await pool.end();
  }
}

setup();
