#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * Guides you through configuring Neon, Resend, and .env.production
 */

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('\n🚀 Production Environment Setup\n');
console.log('This script will help you configure:');
console.log('  ✓ Neon Production Database');
console.log('  ✓ Resend Email Service');
console.log('  ✓ Security Keys');
console.log('  ✓ .env.production file\n');

async function main() {
  const config = {};

  // Step 1: Neon Database
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 STEP 1: Neon Production Database');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('Current DATABASE_URL from .env.local:');
  try {
    const envLocal = readFileSync('.env.local', 'utf-8');
    const dbMatch = envLocal.match(/DATABASE_URL=(.*)/);
    if (dbMatch) {
      console.log(`  ${dbMatch[1]}\n`);
    }
  } catch (err) {
    console.log('  (not found)\n');
  }

  console.log('Options:');
  console.log('  1. Use existing Neon database (from .env.local)');
  console.log('  2. Create new production database');
  console.log('  3. Enter different connection string\n');

  const dbChoice = await question('Choose option (1-3): ');

  if (dbChoice === '1') {
    try {
      const envLocal = readFileSync('.env.local', 'utf-8');
      const dbMatch = envLocal.match(/DATABASE_URL=(.*)/);
      if (dbMatch) {
        config.DATABASE_URL = dbMatch[1].trim();
        console.log('✓ Using existing database\n');
      }
    } catch (err) {
      console.log('❌ Could not read .env.local\n');
    }
  } else if (dbChoice === '2') {
    console.log('\n📝 To create a new Neon database:');
    console.log('  1. Go to: https://console.neon.tech');
    console.log('  2. Click "New Project"');
    console.log('  3. Name: "galactic-boutique-prod"');
    console.log('  4. Region: Choose closest to your users');
    console.log('  5. Copy the connection string\n');
    
    config.DATABASE_URL = await question('Enter DATABASE_URL: ');
  } else {
    config.DATABASE_URL = await question('Enter DATABASE_URL: ');
  }

  // Step 2: Resend Email
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 STEP 2: Resend Email Service');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Current RESEND_API_KEY from .env.local:');
  try {
    const envLocal = readFileSync('.env.local', 'utf-8');
    const resendMatch = envLocal.match(/RESEND_API_KEY=(.*)/);
    if (resendMatch) {
      const key = resendMatch[1].trim();
      console.log(`  ${key.substring(0, 10)}...${key.substring(key.length - 4)}\n`);
    }
  } catch (err) {
    console.log('  (not found)\n');
  }

  console.log('Options:');
  console.log('  1. Use existing Resend API key (from .env.local)');
  console.log('  2. Enter new API key\n');

  const resendChoice = await question('Choose option (1-2): ');

  if (resendChoice === '1') {
    try {
      const envLocal = readFileSync('.env.local', 'utf-8');
      const resendMatch = envLocal.match(/RESEND_API_KEY=(.*)/);
      const emailMatch = envLocal.match(/ADMIN_EMAIL=(.*)/);
      const fromMatch = envLocal.match(/RESEND_EMAIL_FROM=(.*)/);
      
      if (resendMatch) config.RESEND_API_KEY = resendMatch[1].trim();
      if (emailMatch) config.ADMIN_EMAIL = emailMatch[1].trim();
      if (fromMatch) config.RESEND_EMAIL_FROM = fromMatch[1].trim();
      
      console.log('✓ Using existing Resend configuration\n');
    } catch (err) {
      console.log('❌ Could not read .env.local\n');
    }
  } else {
    console.log('\n📝 To get Resend API key:');
    console.log('  1. Go to: https://resend.com/api-keys');
    console.log('  2. Click "Create API Key"');
    console.log('  3. Name: "galactic-boutique-prod"');
    console.log('  4. Copy the key\n');
    
    config.RESEND_API_KEY = await question('Enter RESEND_API_KEY: ');
    config.ADMIN_EMAIL = await question('Enter ADMIN_EMAIL: ');
    config.RESEND_EMAIL_FROM = await question('Enter RESEND_EMAIL_FROM: ');
  }

  // Step 3: Security Keys
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 STEP 3: Security Keys');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Generating secure random keys...\n');

  try {
    config.ADMIN_API_KEY = execSync('openssl rand -hex 32', { encoding: 'utf-8' }).trim();
    config.INTERNAL_API_KEY = execSync('openssl rand -hex 32', { encoding: 'utf-8' }).trim();
    config.ENCRYPTION_KEY = execSync('openssl rand -hex 32', { encoding: 'utf-8' }).trim();
    
    console.log('✓ Generated ADMIN_API_KEY');
    console.log('✓ Generated INTERNAL_API_KEY');
    console.log('✓ Generated ENCRYPTION_KEY\n');
  } catch (err) {
    console.log('⚠️  Could not generate keys with openssl');
    console.log('Using fallback random generation...\n');
    
    const generateKey = () => {
      const chars = '0123456789abcdef';
      let key = '';
      for (let i = 0; i < 64; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
      return key;
    };
    
    config.ADMIN_API_KEY = generateKey();
    config.INTERNAL_API_KEY = generateKey();
    config.ENCRYPTION_KEY = generateKey();
    
    console.log('✓ Generated ADMIN_API_KEY');
    console.log('✓ Generated INTERNAL_API_KEY');
    console.log('✓ Generated ENCRYPTION_KEY\n');
  }

  // Step 4: Write .env.production
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 STEP 4: Writing .env.production');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const envContent = `# Production Environment Variables
# Generated: ${new Date().toISOString()}
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Neon Database Connection String
DATABASE_URL=${config.DATABASE_URL}

# Resend Email API Key
RESEND_API_KEY=${config.RESEND_API_KEY}

# Admin Email for order notifications
ADMIN_EMAIL=${config.ADMIN_EMAIL}

# Resend Email From Address
RESEND_EMAIL_FROM=${config.RESEND_EMAIL_FROM}

# Security API Keys
ADMIN_API_KEY=${config.ADMIN_API_KEY}
INTERNAL_API_KEY=${config.INTERNAL_API_KEY}

# Encryption Key
ENCRYPTION_KEY=${config.ENCRYPTION_KEY}

# Optional Security Settings
IP_WHITELIST_ENABLED=false
WHITELISTED_IPS=
ALLOW_PRIVATE_IPS=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CSRF_TOKEN_EXPIRY=86400000

# Node Environment
NODE_ENV=production
`;

  writeFileSync('.env.production', envContent);
  console.log('✓ Created .env.production\n');

  // Step 5: Save keys for Vercel
  const vercelEnvContent = `# Vercel Environment Variables
# Copy these to Vercel Project Settings → Environment Variables
# Generated: ${new Date().toISOString()}

DATABASE_URL=${config.DATABASE_URL}
RESEND_API_KEY=${config.RESEND_API_KEY}
ADMIN_EMAIL=${config.ADMIN_EMAIL}
RESEND_EMAIL_FROM=${config.RESEND_EMAIL_FROM}
ADMIN_API_KEY=${config.ADMIN_API_KEY}
INTERNAL_API_KEY=${config.INTERNAL_API_KEY}
ENCRYPTION_KEY=${config.ENCRYPTION_KEY}
NODE_ENV=production
`;

  writeFileSync('.env.vercel', vercelEnvContent);
  console.log('✓ Created .env.vercel (for Vercel setup)\n');

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ SETUP COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Files created:');
  console.log('  ✓ .env.production (for local testing)');
  console.log('  ✓ .env.vercel (for Vercel deployment)\n');

  console.log('Next steps:');
  console.log('  1. Test locally: npm run test:complete-flow');
  console.log('  2. Initialize database: npm run db:init');
  console.log('  3. Add variables to Vercel (see .env.vercel)');
  console.log('  4. Deploy to Vercel\n');

  console.log('⚠️  IMPORTANT: Keep these keys secure!');
  console.log('   - Never commit .env.production or .env.vercel');
  console.log('   - Store keys in password manager');
  console.log('   - Rotate keys regularly\n');

  rl.close();
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  rl.close();
  process.exit(1);
});
