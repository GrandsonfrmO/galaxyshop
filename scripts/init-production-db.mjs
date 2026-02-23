#!/usr/bin/env node

/**
 * Initialize Production Database
 * Runs migrations and optionally seeds data
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load production environment
config({ path: '.env.production' });

console.log('\n🗄️  Initializing Production Database\n');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.production');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration(client, filename, description) {
  console.log(`Running: ${description}...`);
  
  try {
    const sql = readFileSync(join(__dirname, '..', 'services', 'migrations', filename), 'utf-8');
    await client.query(sql);
    console.log(`✓ ${description} completed\n`);
    return true;
  } catch (err) {
    console.error(`❌ ${description} failed: ${err.message}\n`);
    return false;
  }
}

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Running Migrations');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Run migrations in order
    const migrations = [
      ['001_initial_schema.sql', 'Initial schema'],
      ['002_enhance_orders.sql', 'Enhanced orders'],
      ['003_product_multiple_images.sql', 'Multiple product images'],
      ['004_critical_fixes.sql', 'Critical fixes'],
      ['005_security_fixes.sql', 'Security fixes']
    ];

    let allSuccess = true;
    for (const [file, desc] of migrations) {
      const success = await runMigration(client, file, desc);
      if (!success) {
        allSuccess = false;
        console.log('⚠️  Continuing with remaining migrations...\n');
      }
    }

    // Check final state
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Database Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Tables created:');
    tables.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    console.log('');

    // Count records
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM orders) as orders,
        (SELECT COUNT(*) FROM delivery_zones) as zones
    `);

    console.log('Current data:');
    console.log(`  Products: ${counts.rows[0].products}`);
    console.log(`  Orders: ${counts.rows[0].orders}`);
    console.log(`  Delivery Zones: ${counts.rows[0].zones}`);
    console.log('');

    if (allSuccess) {
      console.log('✅ Database initialization complete!\n');
      
      if (counts.rows[0].products === '0') {
        console.log('💡 Tip: Run "npm run seed" to add sample products\n');
      }
    } else {
      console.log('⚠️  Database initialization completed with warnings\n');
    }

  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
