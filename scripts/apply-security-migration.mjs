#!/usr/bin/env node

/**
 * Apply Security Migration
 * Applies the security fixes migration to the database
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in environment variables');
  process.exit(1);
}

async function applyMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔐 Applying security migration...');
    await client.connect();

    // Read the migration file
    const migrationPath = resolve('./services/migrations/005_security_fixes.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing...`);
      console.log(`${statement.substring(0, 80)}...`);

      try {
        await client.query(statement);
        console.log(`✅ Success`);
      } catch (error) {
        // Check if it's a "already exists" error (safe to ignore)
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Already exists (skipping)`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Security migration applied successfully!');
    console.log('\n📋 Changes made:');
    console.log('  ✓ Added foreign key constraint on delivery_zone');
    console.log('  ✓ Created indexes for performance');
    console.log('  ✓ Created email_logs table for retry mechanism');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
