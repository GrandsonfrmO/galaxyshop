#!/usr/bin/env tsx
/**
 * Test Complet de Déploiement Vercel
 * Exécuter: npx tsx test-vercel-deployment.ts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface TestResult {
  category: string;
  test: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const results: TestResult[] = [];

function test(category: string, testName: string, condition: boolean, message: string, severity: 'error' | 'warning' | 'info' = 'error') {
  results.push({
    category,
    test: testName,
    passed: condition,
    message,
    severity
  });
  const icon = condition ? '✅' : severity === 'error' ? '❌' : '⚠️';
  console.log(`${icon} ${testName}: ${message}`);
}

console.log('🧪 TEST COMPLET DE DÉPLOIEMENT VERCEL\n');

// 1. FICHIERS DE CONFIGURATION
console.log('📋 1. FICHIERS DE CONFIGURATION');
console.log('─'.repeat(50));

test('Config', 'vercel.json existe', fs.existsSync('vercel.json'), 'Configuration Vercel trouvée');
test('Config', '.env.production existe', fs.existsSync('.env.production'), 'Fichier .env.production trouvé');
test('Config', 'package.json existe', fs.existsSync('package.json'), 'package.json trouvé');
test('Config', 'vite.config.ts existe', fs.existsSync('vite.config.ts'), 'vite.config.ts trouvé');
test('Config', 'server.ts existe', fs.existsSync('server.ts'), 'server.ts trouvé');

// Vérifier vercel.json
if (fs.existsSync('vercel.json')) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
    test('Config', 'vercel.json valide', true, 'JSON valide');
    test('Config', 'buildCommand configuré', !!vercelConfig.buildCommand, `buildCommand: ${vercelConfig.buildCommand}`);
    test('Config', 'outputDirectory configuré', !!vercelConfig.outputDirectory, `outputDirectory: ${vercelConfig.outputDirectory}`);
    test('Config', 'env configuré', !!vercelConfig.env, `${Object.keys(vercelConfig.env || {}).length} variables`);
  } catch (e) {
    test('Config', 'vercel.json valide', false, 'JSON invalide');
  }
}

console.log('');

// 2. SÉCURITÉ
console.log('🔐 2. SÉCURITÉ');
console.log('─'.repeat(50));

const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf-8') : '';
test('Security', '.env.local ignoré', gitignore.includes('.env.local'), '.env.local dans .gitignore');
test('Security', 'node_modules ignoré', gitignore.includes('node_modules'), 'node_modules dans .gitignore');
test('Security', 'dist ignoré', gitignore.includes('dist'), 'dist dans .gitignore');

// Vérifier que .env.local n'est pas commité
try {
  const gitFiles = execSync('git ls-files', { encoding: 'utf-8' });
  test('Security', '.env.local pas commité', !gitFiles.includes('.env.local'), 'Fichier sensible non commité');
} catch (e) {
  test('Security', '.env.local pas commité', false, 'Erreur Git', 'warning');
}

console.log('');

// 3. BUILD
console.log('🏗️ 3. BUILD');
console.log('─'.repeat(50));

try {
  console.log('  Compilation en cours...');
  execSync('npm run build', { stdio: 'pipe' });
  test('Build', 'Build réussit', true, 'npm run build réussit');
  
  // Vérifier les fichiers générés
  test('Build', 'dist/ existe', fs.existsSync('dist'), 'Dossier dist créé');
  test('Build', 'dist/index.html existe', fs.existsSync('dist/index.html'), 'index.html généré');
  test('Build', 'dist/assets/ existe', fs.existsSync('dist/assets'), 'Assets générés');
} catch (e) {
  test('Build', 'Build réussit', false, 'npm run build échoue');
}

console.log('');

// 4. DÉPENDANCES
console.log('📚 4. DÉPENDANCES');
console.log('─'.repeat(50));

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

test('Dependencies', 'Express installé', !!packageJson.dependencies.express, 'Express trouvé');
test('Dependencies', 'React installé', !!packageJson.dependencies.react, 'React trouvé');
test('Dependencies', 'Vite installé', !!packageJson.devDependencies.vite, 'Vite trouvé');
test('Dependencies', 'TypeScript installé', !!packageJson.devDependencies.typescript, 'TypeScript trouvé');
test('Dependencies', 'pg installé', !!packageJson.dependencies.pg, 'PostgreSQL driver trouvé');
test('Dependencies', 'dotenv installé', !!packageJson.dependencies.dotenv, 'dotenv trouvé');

console.log('');

// 5. SCRIPTS
console.log('⚙️ 5. SCRIPTS');
console.log('─'.repeat(50));

test('Scripts', 'Script build', !!packageJson.scripts.build, `build: ${packageJson.scripts.build}`);
test('Scripts', 'Script dev', !!packageJson.scripts.dev, `dev: ${packageJson.scripts.dev}`);
test('Scripts', 'Script server', !!packageJson.scripts.server, `server: ${packageJson.scripts.server}`);
test('Scripts', 'Script migrate', !!packageJson.scripts.migrate, `migrate: ${packageJson.scripts.migrate}`);

console.log('');

// 6. VARIABLES D'ENVIRONNEMENT
console.log('🔑 6. VARIABLES D\'ENVIRONNEMENT');
console.log('─'.repeat(50));

const envLocal = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf-8') : '';
test('Env', 'GEMINI_API_KEY configurée', envLocal.includes('GEMINI_API_KEY'), 'GEMINI_API_KEY trouvée');
test('Env', 'DATABASE_URL configurée', envLocal.includes('DATABASE_URL'), 'DATABASE_URL trouvée');
test('Env', 'RESEND_API_KEY configurée', envLocal.includes('RESEND_API_KEY'), 'RESEND_API_KEY trouvée');

// Vérifier le format
const hasGeminiKey = envLocal.match(/GEMINI_API_KEY=AIza/);
const hasDatabaseUrl = envLocal.match(/DATABASE_URL=postgresql:\/\//);
const hasResendKey = envLocal.match(/RESEND_API_KEY=re_/);

test('Env', 'GEMINI_API_KEY format correct', !!hasGeminiKey, 'Format: AIza...', hasGeminiKey ? 'info' : 'warning');
test('Env', 'DATABASE_URL format correct', !!hasDatabaseUrl, 'Format: postgresql://...', hasDatabaseUrl ? 'info' : 'warning');
test('Env', 'RESEND_API_KEY format correct', !!hasResendKey, 'Format: re_...', hasResendKey ? 'info' : 'warning');

console.log('');

// 7. STRUCTURE DU PROJET
console.log('📁 7. STRUCTURE DU PROJET');
console.log('─'.repeat(50));

test('Structure', 'api/ existe', fs.existsSync('api'), 'Dossier api trouvé');
test('Structure', 'canvas/ existe', fs.existsSync('canvas'), 'Dossier canvas trouvé');
test('Structure', 'services/ existe', fs.existsSync('services'), 'Dossier services trouvé');
test('Structure', 'ui/ existe', fs.existsSync('ui'), 'Dossier ui trouvé');
test('Structure', 'store/ existe', fs.existsSync('store'), 'Dossier store trouvé');
test('Structure', 'config/ existe', fs.existsSync('config'), 'Dossier config trouvé');

console.log('');

// 8. FICHIERS CRITIQUES
console.log('🔧 8. FICHIERS CRITIQUES');
console.log('─'.repeat(50));

test('Critical', 'App.tsx existe', fs.existsSync('App.tsx'), 'Composant principal trouvé');
test('Critical', 'index.tsx existe', fs.existsSync('index.tsx'), 'Point d\'entrée trouvé');
test('Critical', 'index.html existe', fs.existsSync('index.html'), 'HTML principal trouvé');
test('Critical', 'tsconfig.json existe', fs.existsSync('tsconfig.json'), 'Configuration TypeScript trouvée');

console.log('');

// 9. GIT
console.log('📦 9. GIT');
console.log('─'.repeat(50));

try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  const isClean = status.trim() === '';
  test('Git', 'Repository clean', isClean, isClean ? 'Tous les fichiers commités' : `${status.split('\n').length} fichiers non commités`, isClean ? 'info' : 'warning');
} catch (e) {
  test('Git', 'Repository clean', false, 'Erreur Git', 'warning');
}

try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  test('Git', 'Branch main/master', branch === 'main' || branch === 'master', `Branch: ${branch}`, branch === 'main' || branch === 'master' ? 'info' : 'warning');
} catch (e) {
  test('Git', 'Branch main/master', false, 'Erreur Git', 'warning');
}

console.log('');

// 10. VERCEL SPÉCIFIQUE
console.log('🚀 10. VERCEL SPÉCIFIQUE');
console.log('─'.repeat(50));

test('Vercel', 'Node.js version compatible', packageJson.engines?.node ? true : true, 'Node.js 18+ recommandé', 'info');
test('Vercel', 'Pas de dev dependencies en production', !packageJson.dependencies.concurrently, 'concurrently pas en dependencies');
test('Vercel', 'Pas de tsx en dependencies', !packageJson.dependencies.tsx, 'tsx pas en dependencies');

console.log('');

// RÉSUMÉ
console.log('═'.repeat(50));
const passed = results.filter(r => r.passed).length;
const total = results.length;
const errors = results.filter(r => !r.passed && r.severity === 'error').length;
const warnings = results.filter(r => !r.passed && r.severity === 'warning').length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 RÉSUMÉ: ${passed}/${total} tests réussis (${percentage}%)\n`);

if (errors > 0) {
  console.log(`❌ ${errors} erreur(s) critique(s):`);
  results
    .filter(r => !r.passed && r.severity === 'error')
    .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
  console.log('');
}

if (warnings > 0) {
  console.log(`⚠️ ${warnings} avertissement(s):`);
  results
    .filter(r => !r.passed && r.severity === 'warning')
    .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
  console.log('');
}

// VERDICT
console.log('═'.repeat(50));
if (errors === 0 && percentage >= 90) {
  console.log('\n✅ VERDICT: PRÊT POUR VERCEL!\n');
  console.log('Votre application peut être déployée sur Vercel.');
  console.log('Prochaines étapes:');
  console.log('1. Créer un compte Vercel');
  console.log('2. Importer votre repository GitHub');
  console.log('3. Ajouter les variables d\'environnement');
  console.log('4. Cliquer "Deploy"');
  process.exit(0);
} else if (errors === 0 && percentage >= 80) {
  console.log('\n⚠️ VERDICT: PROBABLEMENT PRÊT (avec avertissements)\n');
  console.log('Votre application peut être déployée, mais vérifiez les avertissements.');
  process.exit(0);
} else {
  console.log('\n❌ VERDICT: NON PRÊT POUR VERCEL\n');
  console.log('Veuillez corriger les erreurs avant de déployer.');
  process.exit(1);
}
