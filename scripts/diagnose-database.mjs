#!/usr/bin/env node

/**
 * Database Diagnostic Script
 * Checks database schema, tables, and data
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runDiagnostics() {
  console.log('🔍 Database Diagnostics\n');

  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database\n');

    // Check tables
    console.log('2️⃣ Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${tables.rows.length} tables:`);
    tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    console.log();

    // Check orders table structure
    console.log('3️⃣ Checking orders table structure...');
    const ordersColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `);
    
    if (ordersColumns.rows.length === 0) {
      console.log('❌ Orders table not found!\n');
    } else {
      console.log(`✅ Orders table has ${ordersColumns.rows.length} columns:`);
      const requiredColumns = ['customer_name', 'customer_email', 'customer_phone', 'delivery_zone', 'delivery_fee', 'subtotal', 'total_amount'];
      ordersColumns.rows.forEach(col => {
        const isRequired = requiredColumns.includes(col.column_name);
        const icon = isRequired ? '⭐' : '  ';
        console.log(`   ${icon} ${col.column_name} (${col.data_type})`);
      });
      console.log();

      // Check for missing columns
      const existingColumns = ordersColumns.rows.map(c => c.column_name);
      const missing = requiredColumns.filter(c => !existingColumns.includes(c));
      if (missing.length > 0) {
        console.log(`⚠️ Missing columns: ${missing.join(', ')}\n`);
      } else {
        console.log('✅ All required columns present\n');
      }
    }

    // Check data
    console.log('4️⃣ Checking data...');
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM orders) as orders,
        (SELECT COUNT(*) FROM order_items) as order_items,
        (SELECT COUNT(*) FROM delivery_zones) as delivery_zones,
        (SELECT COUNT(*) FROM email_logs) as email_logs
    `);
    
    const data = counts.rows[0];
    console.log(`✅ Data counts:`);
    console.log(`   Products: ${data.products}`);
    console.log(`   Orders: ${data.orders}`);
    console.log(`   Order Items: ${data.order_items}`);
    console.log(`   Delivery Zones: ${data.delivery_zones}`);
    console.log(`   Email Logs: ${data.email_logs}`);
    console.log();

    // Check recent orders
    if (data.orders > 0) {
      console.log('5️⃣ Recent orders:');
      const recentOrders = await pool.query(`
        SELECT id, customer_name, customer_email, total_amount, status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      recentOrders.rows.forEach(order => {
        console.log(`   #${order.id} - ${order.customer_name} (${order.status})`);
        console.log(`      Email: ${order.customer_email}`);
        console.log(`      Amount: ${order.total_amount} GNF`);
        console.log(`      Created: ${new Date(order.created_at).toLocaleString()}`);
      });
      console.log();
    }

    // Check email logs
    if (data.email_logs > 0) {
      console.log('6️⃣ Email logs summary:');
      const emailStats = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM email_logs
        GROUP BY status
      `);
      
      emailStats.rows.forEach(stat => {
        console.log(`   ${stat.status}: ${stat.count}`);
      });
      console.log();

      // Check failed emails
      const failedEmails = await pool.query(`
        SELECT id, email_type, recipient_email, error_message
        FROM email_logs
        WHERE status = 'failed'
        LIMIT 5
      `);

      if (failedEmails.rows.length > 0) {
        console.log('⚠️ Failed emails:');
        failedEmails.rows.forEach(email => {
          console.log(`   ${email.email_type} to ${email.recipient_email}`);
          console.log(`      Error: ${email.error_message?.substring(0, 100)}`);
        });
        console.log();
      }
    }

    // Check migrations
    console.log('7️⃣ Checking migrations:');
    const migrations = await pool.query(`
      SELECT name, executed_at
      FROM migrations
      ORDER BY executed_at
    `);
    
    if (migrations.rows.length === 0) {
      console.log('⚠️ No migrations executed yet\n');
    } else {
      console.log(`✅ ${migrations.rows.length} migrations executed:`);
      migrations.rows.forEach(m => {
        console.log(`   ✓ ${m.name}`);
      });
      console.log();
    }

    console.log('✨ Diagnostics complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

runDiagnostics();
