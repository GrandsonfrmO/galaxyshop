/**
 * Database Connection Test
 * Test de connexion à la base de données Neon
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

console.log('\n🧪 DATABASE CONNECTION TEST\n');
console.log('================================\n');

// Check if DATABASE_URL is configured
if (!DATABASE_URL) {
  console.log('❌ DATABASE_URL not configured in .env.local\n');
  console.log('📝 To configure:');
  console.log('1. Create a Neon account at https://neon.tech');
  console.log('2. Create a project named "grandson-clothes"');
  console.log('3. Copy the connection string');
  console.log('4. Add to .env.local:\n');
  console.log('   DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db\n');
  console.log('5. Run this test again\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL found\n');
console.log('Connection String (masked):');
const maskedUrl = DATABASE_URL.replace(/:[^:]*@/, ':****@');
console.log(`   ${maskedUrl}\n`);

// Try to connect
(async () => {
  try {
    console.log('🔄 Attempting to connect...\n');

    const { Pool } = await import('pg');

    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!\n');
    console.log('Current database time:', result.rows[0].now);

    // Get database info
    const dbInfo = await pool.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);

    console.log('\n📊 Database Information:');
    console.log('   Database:', dbInfo.rows[0].database);
    console.log('   User:', dbInfo.rows[0].user);
    console.log('   Version:', dbInfo.rows[0].version.split(',')[0]);

    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n📋 Tables in Database:');
    if (tables.rows.length === 0) {
      console.log('   ⚠️  No tables found');
      console.log('\n   Run: npx ts-node services/initDatabase.ts');
    } else {
      tables.rows.forEach((table) => {
        console.log(`   ✅ ${table.table_name}`);
      });
    }

    // Check products
    const products = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('\n📦 Products:');
    console.log(`   Total: ${products.rows[0].count}`);

    if (products.rows[0].count > 0) {
      const productList = await pool.query('SELECT id, name, price FROM products LIMIT 5');
      productList.rows.forEach((product) => {
        console.log(`   - ${product.name} (${product.price} GNF)`);
      });
    }

    // Check users
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('\n👥 Users:');
    console.log(`   Total: ${users.rows[0].count}`);

    // Check orders
    const orders = await pool.query('SELECT COUNT(*) as count FROM orders');
    console.log('\n📦 Orders:');
    console.log(`   Total: ${orders.rows[0].count}`);

    console.log('\n================================');
    console.log('✅ All tests passed!\n');

    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.log('❌ Connection failed!\n');
    console.log('Error:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Possible causes:');
      console.log('   - Invalid hostname in connection string');
      console.log('   - No internet connection');
      console.log('   - Firewall blocking connection');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible causes:');
      console.log('   - Database server is down');
      console.log('   - Wrong port in connection string');
    } else if (error.code === '28P01') {
      console.log('\n💡 Possible causes:');
      console.log('   - Wrong password in connection string');
      console.log('   - Wrong username in connection string');
    } else if (error.code === '3D000') {
      console.log('\n💡 Possible causes:');
      console.log('   - Database does not exist');
      console.log('   - Wrong database name in connection string');
    }

    console.log('\n📝 Connection String Format:');
    console.log('   postgresql://user:password@host.neon.tech/database_name\n');

    process.exit(1);
  }
})();
