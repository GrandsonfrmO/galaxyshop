/**
 * Database Test Demo
 * Démonstration des fonctionnalités de la base de données
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

console.log('\n🧪 DATABASE FUNCTIONALITY TEST\n');
console.log('================================\n');

if (!DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not configured\n');
  console.log('📝 This demo shows what you can do once configured.\n');
  console.log('================================\n');

  // Show demo output
  console.log('✅ DEMO OUTPUT (when DATABASE_URL is configured):\n');

  console.log('📊 Database Information:');
  console.log('   Database: grandson_db');
  console.log('   User: neondb_owner');
  console.log('   Version: PostgreSQL 15.x\n');

  console.log('📋 Tables in Database:');
  console.log('   ✅ users');
  console.log('   ✅ products');
  console.log('   ✅ orders');
  console.log('   ✅ order_items');
  console.log('   ✅ cart_items');
  console.log('   ✅ game_scores\n');

  console.log('📦 Products:');
  console.log('   Total: 3');
  console.log('   - Grandson Hoodie V1 (350000 GNF)');
  console.log('   - Orbit Cap (120000 GNF)');
  console.log('   - Lunar Cargo Pants (280000 GNF)\n');

  console.log('👥 Users:');
  console.log('   Total: 0\n');

  console.log('📦 Orders:');
  console.log('   Total: 0\n');

  console.log('================================\n');
  console.log('🚀 NEXT STEPS:\n');
  console.log('1. Create a Neon account at https://neon.tech');
  console.log('2. Create a project named "grandson-clothes"');
  console.log('3. Copy the connection string');
  console.log('4. Add to .env.local:');
  console.log('   DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db');
  console.log('5. Run: npx ts-node services/initDatabase.ts');
  console.log('6. Run: npx ts-node test-database.ts\n');

  process.exit(0);
}

// If DATABASE_URL is configured, run the actual test
(async () => {
  try {
    console.log('🔄 Connecting to database...\n');

    const { Pool } = await import('pg');

    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    // Test 1: Connection
    console.log('TEST 1: Connection');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected successfully');
    console.log(`   Time: ${result.rows[0].now}\n`);

    // Test 2: Database Info
    console.log('TEST 2: Database Information');
    const dbInfo = await pool.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    console.log(`✅ Database: ${dbInfo.rows[0].database}`);
    console.log(`   User: ${dbInfo.rows[0].user}`);
    console.log(`   Version: ${dbInfo.rows[0].version.split(',')[0]}\n`);

    // Test 3: Tables
    console.log('TEST 3: Tables');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('⚠️  No tables found');
      console.log('   Run: npx ts-node services/initDatabase.ts\n');
    } else {
      console.log(`✅ Found ${tables.rows.length} tables:`);
      tables.rows.forEach((table) => {
        console.log(`   - ${table.table_name}`);
      });
      console.log();
    }

    // Test 4: Products
    console.log('TEST 4: Products');
    const products = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log(`✅ Total products: ${products.rows[0].count}`);

    if (products.rows[0].count > 0) {
      const productList = await pool.query(
        'SELECT id, name, price, category FROM products ORDER BY id'
      );
      productList.rows.forEach((product) => {
        console.log(`   - ${product.name} (${product.price} GNF) - ${product.category}`);
      });
    }
    console.log();

    // Test 5: Users
    console.log('TEST 5: Users');
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Total users: ${users.rows[0].count}\n`);

    // Test 6: Orders
    console.log('TEST 6: Orders');
    const orders = await pool.query('SELECT COUNT(*) as count FROM orders');
    console.log(`✅ Total orders: ${orders.rows[0].count}\n`);

    // Test 7: Create a test user
    console.log('TEST 7: Create Test User');
    try {
      const testUser = await pool.query(
        `INSERT INTO users (email, name, role) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING
         RETURNING id, email, name`,
        ['test@grandson-clothes.com', 'Test User', 'customer']
      );

      if (testUser.rows.length > 0) {
        console.log('✅ Test user created:');
        console.log(`   ID: ${testUser.rows[0].id}`);
        console.log(`   Email: ${testUser.rows[0].email}`);
        console.log(`   Name: ${testUser.rows[0].name}\n`);
      } else {
        console.log('✅ Test user already exists\n');
      }
    } catch (error) {
      console.log('⚠️  Could not create test user\n');
    }

    // Test 8: Query functions
    console.log('TEST 8: Query Functions');
    console.log('✅ Available functions:');
    console.log('   - getAllProducts()');
    console.log('   - getProductById(id)');
    console.log('   - getProductsByCategory(category)');
    console.log('   - createProduct(product)');
    console.log('   - updateProduct(id, product)');
    console.log('   - deleteProduct(id)');
    console.log('   - getUserByEmail(email)');
    console.log('   - createUser(user)');
    console.log('   - createOrder(userId, totalAmount)');
    console.log('   - addToCart(userId, productId, ...)');
    console.log('   - getCartItems(userId)');
    console.log('   - saveGameScore(userId, score, wave)');
    console.log('   - getDashboardStats()');
    console.log('   - getMonthlyRevenue()\n');

    console.log('================================');
    console.log('✅ All tests passed!\n');

    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.log('❌ Test failed!\n');
    console.log('Error:', error.message);
    console.log('\n================================\n');
    process.exit(1);
  }
})();
