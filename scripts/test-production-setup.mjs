#!/usr/bin/env node

/**
 * Production Setup Testing Script
 * Tests database connection, email service, and security configuration
 */

import pg from 'pg';
import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

const { Pool } = pg;

// Load production environment
config({ path: '.env.production' });

console.log('\n🧪 Testing Production Setup\n');

const results = {
  database: false,
  email: false,
  security: false,
  overall: false
};

// Test 1: Database Connection
async function testDatabase() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test 1: Database Connection');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found in .env.production\n');
    return false;
  }

  console.log('Testing connection to Neon...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✓ Connected to database\n');

    // Test query
    const result = await client.query('SELECT NOW() as time, version() as version');
    console.log('Database info:');
    console.log(`  Time: ${result.rows[0].time}`);
    console.log(`  Version: ${result.rows[0].version.split(',')[0]}\n`);

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.rows.length > 0) {
      console.log('Existing tables:');
      tables.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
      console.log('');
    } else {
      console.log('⚠️  No tables found. Run: npm run db:init\n');
    }

    client.release();
    await pool.end();
    
    console.log('✅ Database test PASSED\n');
    return true;
  } catch (err) {
    console.log(`❌ Database test FAILED: ${err.message}\n`);
    await pool.end();
    return false;
  }
}

// Test 2: Email Service
async function testEmail() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Test 2: Email Service');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in .env.production\n');
    return false;
  }

  if (!process.env.ADMIN_EMAIL) {
    console.log('❌ ADMIN_EMAIL not found in .env.production\n');
    return false;
  }

  if (!process.env.RESEND_EMAIL_FROM) {
    console.log('❌ RESEND_EMAIL_FROM not found in .env.production\n');
    return false;
  }

  console.log('Configuration:');
  console.log(`  API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
  console.log(`  From: ${process.env.RESEND_EMAIL_FROM}`);
  console.log(`  Admin: ${process.env.ADMIN_EMAIL}\n`);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('Testing Resend API...');
    
    // Note: This will send a real test email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Production Setup Test',
      html: `
        <h2>Production Setup Test</h2>
        <p>This is a test email from your Galactic Boutique production setup.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>If you received this, your email configuration is working correctly! ✅</p>
      `
    });

    if (error) {
      console.log(`❌ Email test FAILED: ${error.message}\n`);
      return false;
    }

    console.log(`✓ Test email sent (ID: ${data.id})`);
    console.log(`✓ Check ${process.env.ADMIN_EMAIL} for the test email\n`);
    console.log('✅ Email test PASSED\n');
    return true;
  } catch (err) {
    console.log(`❌ Email test FAILED: ${err.message}\n`);
    return false;
  }
}

// Test 3: Security Configuration
async function testSecurity() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Test 3: Security Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const checks = [];

  // Check ADMIN_API_KEY
  if (!process.env.ADMIN_API_KEY) {
    console.log('❌ ADMIN_API_KEY not found');
    checks.push(false);
  } else if (process.env.ADMIN_API_KEY.includes('CHANGE_ME') || 
             process.env.ADMIN_API_KEY.includes('dev-admin-key')) {
    console.log('⚠️  ADMIN_API_KEY is using default/dev value');
    checks.push(false);
  } else if (process.env.ADMIN_API_KEY.length < 32) {
    console.log('⚠️  ADMIN_API_KEY is too short (should be 64 chars)');
    checks.push(false);
  } else {
    console.log('✓ ADMIN_API_KEY is configured');
    checks.push(true);
  }

  // Check INTERNAL_API_KEY
  if (!process.env.INTERNAL_API_KEY) {
    console.log('❌ INTERNAL_API_KEY not found');
    checks.push(false);
  } else if (process.env.INTERNAL_API_KEY.includes('CHANGE_ME') || 
             process.env.INTERNAL_API_KEY.includes('dev-internal-key')) {
    console.log('⚠️  INTERNAL_API_KEY is using default/dev value');
    checks.push(false);
  } else if (process.env.INTERNAL_API_KEY.length < 32) {
    console.log('⚠️  INTERNAL_API_KEY is too short (should be 64 chars)');
    checks.push(false);
  } else {
    console.log('✓ INTERNAL_API_KEY is configured');
    checks.push(true);
  }

  // Check ENCRYPTION_KEY
  if (!process.env.ENCRYPTION_KEY) {
    console.log('⚠️  ENCRYPTION_KEY not found (optional but recommended)');
  } else if (process.env.ENCRYPTION_KEY.length < 32) {
    console.log('⚠️  ENCRYPTION_KEY is too short (should be 64 chars)');
  } else {
    console.log('✓ ENCRYPTION_KEY is configured');
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  NODE_ENV is not set to "production"');
  } else {
    console.log('✓ NODE_ENV is set to production');
  }

  console.log('');

  const passed = checks.every(c => c);
  if (passed) {
    console.log('✅ Security test PASSED\n');
  } else {
    console.log('❌ Security test FAILED\n');
    console.log('Run: node scripts/setup-production-env.mjs\n');
  }

  return passed;
}

// Run all tests
async function runTests() {
  results.database = await testDatabase();
  results.email = await testEmail();
  results.security = await testSecurity();
  results.overall = results.database && results.email && results.security;

  // Final summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Database:  ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Email:     ${results.email ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Security:  ${results.security ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  if (results.overall) {
    console.log('🎉 All tests passed! Ready for deployment.\n');
    console.log('Next steps:');
    console.log('  1. Push to GitHub: git push origin main');
    console.log('  2. Deploy to Vercel');
    console.log('  3. Add environment variables to Vercel (see .env.vercel)\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Fix issues before deploying.\n');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
