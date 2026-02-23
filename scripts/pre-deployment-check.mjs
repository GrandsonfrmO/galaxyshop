#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const checks = {
  environment: [],
  files: [],
  dependencies: [],
  security: [],
  database: []
};

console.log('🔍 Pre-Deployment Verification\n');

// Check environment variables
console.log('📋 Checking Environment Variables...');
const envFile = path.join(rootDir, '.env.production');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  const requiredVars = [
    'DATABASE_URL',
    'GEMINI_API_KEY',
    'RESEND_API_KEY',
    'ADMIN_EMAIL',
    'RESEND_EMAIL_FROM',
    'ADMIN_API_KEY',
    'INTERNAL_API_KEY',
    'ENCRYPTION_KEY'
  ];

  requiredVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=PLACEHOLDER`)) {
      checks.environment.push({ name: varName, status: '✅' });
    } else {
      checks.environment.push({ name: varName, status: '❌ Missing or placeholder' });
    }
  });
} else {
  console.warn('⚠️  .env.production not found');
}

// Check required files
console.log('📁 Checking Required Files...');
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'vercel.json',
  'server.ts',
  'index.tsx',
  'index.html'
];

requiredFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    checks.files.push({ name: file, status: '✅' });
  } else {
    checks.files.push({ name: file, status: '❌ Missing' });
  }
});

// Check package.json scripts
console.log('📦 Checking Build Scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const requiredScripts = ['build', 'dev', 'db:migrate'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    checks.dependencies.push({ name: `npm run ${script}`, status: '✅' });
  } else {
    checks.dependencies.push({ name: `npm run ${script}`, status: '❌ Missing' });
  }
});

// Check security files
console.log('🔒 Checking Security Configuration...');
const securityFiles = [
  'services/security/index.ts',
  'services/security/authMiddleware.ts',
  'services/security/csrfProtection.ts',
  'services/security/encryption.ts',
  'services/security/inputSanitizer.ts',
  'services/security/rateLimiter.ts'
];

securityFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    checks.security.push({ name: file, status: '✅' });
  } else {
    checks.security.push({ name: file, status: '❌ Missing' });
  }
});

// Check database migrations
console.log('🗄️  Checking Database Migrations...');
const migrationsDir = path.join(rootDir, 'services', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  checks.database.push({ name: `Migrations found: ${migrations.length}`, status: '✅' });
} else {
  checks.database.push({ name: 'Migrations directory', status: '❌ Missing' });
}

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION RESULTS\n');

Object.entries(checks).forEach(([category, items]) => {
  console.log(`\n${category.toUpperCase()}`);
  console.log('-'.repeat(40));
  items.forEach(item => {
    console.log(`${item.status} ${item.name}`);
  });
});

// Summary
const allChecks = Object.values(checks).flat();
const passed = allChecks.filter(c => c.status.includes('✅')).length;
const failed = allChecks.filter(c => c.status.includes('❌')).length;

console.log('\n' + '='.repeat(60));
console.log(`\n📈 Summary: ${passed}/${allChecks.length} checks passed\n`);

if (failed > 0) {
  console.log(`⚠️  ${failed} checks failed. Please fix before deploying.\n`);
  process.exit(1);
} else {
  console.log('✅ All checks passed! Ready for deployment.\n');
  process.exit(0);
}
