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
  database: [],
  build: []
};

console.log('\n🚀 VERCEL PRE-DEPLOYMENT VERIFICATION\n');
console.log('=' .repeat(60));

// ============================================
// 1. Check Environment Variables
// ============================================
console.log('\n📋 Checking Environment Variables...\n');

const envFile = path.join(rootDir, '.env.production');
const envLocalFile = path.join(rootDir, '.env.local');

let envContent = '';
if (fs.existsSync(envFile)) {
  envContent = fs.readFileSync(envFile, 'utf-8');
} else if (fs.existsSync(envLocalFile)) {
  envContent = fs.readFileSync(envLocalFile, 'utf-8');
  console.log('⚠️  Using .env.local instead of .env.production');
}

const requiredVars = [
  { name: 'DATABASE_URL', critical: true, description: 'Neon PostgreSQL connection string' },
  { name: 'GEMINI_API_KEY', critical: true, description: 'Google Gemini API key' },
  { name: 'RESEND_API_KEY', critical: true, description: 'Resend email API key' },
  { name: 'ADMIN_EMAIL', critical: true, description: 'Admin email for notifications' },
  { name: 'RESEND_EMAIL_FROM', critical: true, description: 'Email sender address' },
  { name: 'ADMIN_API_KEY', critical: true, description: 'Admin API key (security)' },
  { name: 'INTERNAL_API_KEY', critical: true, description: 'Internal API key (security)' },
  { name: 'ENCRYPTION_KEY', critical: true, description: 'Encryption key for sensitive data' },
  { name: 'NODE_ENV', critical: false, description: 'Node environment (should be production)' }
];

requiredVars.forEach(varConfig => {
  const { name, critical, description } = varConfig;
  const hasVar = envContent.includes(`${name}=`) && !envContent.includes(`${name}=PLACEHOLDER`);
  
  if (hasVar) {
    checks.environment.push({ 
      name: `${name} ✓`, 
      status: '✅',
      description 
    });
    console.log(`✅ ${name}`);
  } else {
    const status = critical ? '❌ CRITICAL' : '⚠️  WARNING';
    checks.environment.push({ 
      name, 
      status,
      description 
    });
    console.log(`${status} ${name} - ${description}`);
  }
});

// ============================================
// 2. Check Required Files
// ============================================
console.log('\n📁 Checking Required Files...\n');

const requiredFiles = [
  { path: 'package.json', critical: true },
  { path: 'vite.config.ts', critical: true },
  { path: 'tsconfig.json', critical: true },
  { path: 'vercel.json', critical: true },
  { path: 'server.ts', critical: true },
  { path: 'index.tsx', critical: true },
  { path: 'index.html', critical: true },
  { path: '.env.production', critical: false },
  { path: 'services/database.ts', critical: true },
  { path: 'services/productService.ts', critical: true },
  { path: 'services/orderService.ts', critical: true }
];

requiredFiles.forEach(fileConfig => {
  const filePath = path.join(rootDir, fileConfig.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    checks.files.push({ name: fileConfig.path, status: '✅' });
    console.log(`✅ ${fileConfig.path}`);
  } else {
    const status = fileConfig.critical ? '❌ CRITICAL' : '⚠️  WARNING';
    checks.files.push({ name: fileConfig.path, status });
    console.log(`${status} ${fileConfig.path}`);
  }
});

// ============================================
// 3. Check Build Scripts
// ============================================
console.log('\n📦 Checking Build Scripts...\n');

const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const requiredScripts = [
  { name: 'build', critical: true },
  { name: 'dev', critical: false },
  { name: 'db:migrate', critical: true },
  { name: 'pre-deploy', critical: false }
];

requiredScripts.forEach(scriptConfig => {
  const hasScript = packageJson.scripts && packageJson.scripts[scriptConfig.name];
  
  if (hasScript) {
    checks.dependencies.push({ name: `npm run ${scriptConfig.name}`, status: '✅' });
    console.log(`✅ npm run ${scriptConfig.name}`);
  } else {
    const status = scriptConfig.critical ? '❌ CRITICAL' : '⚠️  WARNING';
    checks.dependencies.push({ name: `npm run ${scriptConfig.name}`, status });
    console.log(`${status} npm run ${scriptConfig.name}`);
  }
});

// ============================================
// 4. Check Security Configuration
// ============================================
console.log('\n🔒 Checking Security Configuration...\n');

const securityFiles = [
  { path: 'services/security/index.ts', critical: true },
  { path: 'services/security/authMiddleware.ts', critical: true },
  { path: 'services/security/csrfProtection.ts', critical: true },
  { path: 'services/security/encryption.ts', critical: true },
  { path: 'services/security/inputSanitizer.ts', critical: true },
  { path: 'services/security/rateLimiter.ts', critical: true }
];

securityFiles.forEach(fileConfig => {
  const filePath = path.join(rootDir, fileConfig.path);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    checks.security.push({ name: fileConfig.path, status: '✅' });
    console.log(`✅ ${fileConfig.path}`);
  } else {
    const status = fileConfig.critical ? '❌ CRITICAL' : '⚠️  WARNING';
    checks.security.push({ name: fileConfig.path, status });
    console.log(`${status} ${fileConfig.path}`);
  }
});

// ============================================
// 5. Check Database Migrations
// ============================================
console.log('\n🗄️  Checking Database Migrations...\n');

const migrationsDir = path.join(rootDir, 'services', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  checks.database.push({ name: `Migrations found: ${migrations.length}`, status: '✅' });
  console.log(`✅ Found ${migrations.length} migrations:`);
  migrations.forEach(m => console.log(`   - ${m}`));
} else {
  checks.database.push({ name: 'Migrations directory', status: '❌ CRITICAL' });
  console.log('❌ CRITICAL: Migrations directory not found');
}

// ============================================
// 6. Check Build Output
// ============================================
console.log('\n🏗️  Checking Build Configuration...\n');

const viteConfigPath = path.join(rootDir, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
  if (viteConfig.includes('dist')) {
    checks.build.push({ name: 'Vite output directory', status: '✅' });
    console.log('✅ Vite output directory configured');
  } else {
    checks.build.push({ name: 'Vite output directory', status: '⚠️  WARNING' });
    console.log('⚠️  Vite output directory not explicitly configured');
  }
}

const vercelJsonPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));
  if (vercelJson.outputDirectory === 'dist') {
    checks.build.push({ name: 'Vercel output directory', status: '✅' });
    console.log('✅ Vercel output directory set to dist');
  } else {
    checks.build.push({ name: 'Vercel output directory', status: '⚠️  WARNING' });
    console.log('⚠️  Vercel output directory not set to dist');
  }
}

// ============================================
// Print Summary
// ============================================
console.log('\n' + '='.repeat(60));
console.log('\n📊 VERIFICATION SUMMARY\n');

const allChecks = Object.values(checks).flat();
const passed = allChecks.filter(c => c.status === '✅').length;
const warnings = allChecks.filter(c => c.status.includes('WARNING')).length;
const failed = allChecks.filter(c => c.status.includes('CRITICAL')).length;

console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Critical: ${failed}`);
console.log(`📈 Total: ${allChecks.length}\n`);

// ============================================
// Recommendations
// ============================================
if (failed > 0) {
  console.log('🚨 CRITICAL ISSUES FOUND\n');
  console.log('Please fix the following before deploying:\n');
  
  allChecks
    .filter(c => c.status.includes('CRITICAL'))
    .forEach(c => {
      console.log(`❌ ${c.name}`);
      if (c.description) console.log(`   ${c.description}`);
    });
  
  console.log('\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('⚠️  WARNINGS\n');
  console.log('Consider fixing the following:\n');
  
  allChecks
    .filter(c => c.status.includes('WARNING'))
    .forEach(c => {
      console.log(`⚠️  ${c.name}`);
      if (c.description) console.log(`   ${c.description}`);
    });
  
  console.log('\n');
}

// ============================================
// Next Steps
// ============================================
console.log('=' .repeat(60));
console.log('\n✅ PRE-DEPLOYMENT CHECKLIST COMPLETE\n');
console.log('Next steps:\n');
console.log('1. Verify all environment variables in Vercel dashboard');
console.log('2. Run: npm run build');
console.log('3. Test locally: npm run server');
console.log('4. Push to GitHub');
console.log('5. Monitor deployment in Vercel dashboard\n');

process.exit(0);
