#!/usr/bin/env tsx
/**
 * Script de vérification pré-déploiement Vercel
 * Exécuter: npx tsx verify-deployment.ts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, message: string) {
  results.push({
    name,
    passed: condition,
    message
  });
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function fileContains(filePath: string, text: string): boolean {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.includes(text);
}

console.log('🔍 Vérification pré-déploiement Vercel\n');

// 1. Fichiers de configuration
console.log('📋 Configuration Files:');
check('vercel.json', fileExists('vercel.json'), 'Configuration Vercel trouvée');
check('.env.production', fileExists('.env.production'), 'Fichier .env.production trouvé');
check('package.json', fileExists('package.json'), 'package.json trouvé');
check('vite.config.ts', fileExists('vite.config.ts'), 'vite.config.ts trouvé');
check('server.ts', fileExists('server.ts'), 'server.ts trouvé');

// 2. Sécurité
console.log('\n🔐 Sécurité:');
const gitignore = fileExists('.gitignore') ? fs.readFileSync('.gitignore', 'utf-8') : '';
check('.env.local ignoré', gitignore.includes('.env.local'), '.env.local dans .gitignore');
check('node_modules ignoré', gitignore.includes('node_modules'), 'node_modules dans .gitignore');

// 3. Git
console.log('\n📦 Git:');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  check('Git clean', status.trim() === '', 'Tous les fichiers sont commités');
} catch (e) {
  check('Git clean', false, 'Erreur lors de la vérification Git');
}

// 4. Build
console.log('\n🏗️ Build:');
try {
  console.log('  Compilation en cours...');
  execSync('npm run build', { stdio: 'pipe' });
  check('Build réussit', true, 'npm run build réussit');
} catch (e) {
  check('Build réussit', false, 'npm run build échoue');
}

// 5. Dépendances
console.log('\n📚 Dépendances:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
check('Express installé', !!packageJson.dependencies.express, 'Express trouvé');
check('React installé', !!packageJson.dependencies.react, 'React trouvé');
check('Vite installé', !!packageJson.devDependencies.vite, 'Vite trouvé');
check('TypeScript installé', !!packageJson.devDependencies.typescript, 'TypeScript trouvé');

// 6. Scripts
console.log('\n⚙️ Scripts:');
check('Script build', !!packageJson.scripts.build, 'Script build défini');
check('Script dev', !!packageJson.scripts.dev, 'Script dev défini');
check('Script server', !!packageJson.scripts.server, 'Script server défini');

// 7. Variables d'environnement
console.log('\n🔑 Variables d\'environnement:');
const envLocal = fileExists('.env.local') ? fs.readFileSync('.env.local', 'utf-8') : '';
check('GEMINI_API_KEY', envLocal.includes('GEMINI_API_KEY'), 'GEMINI_API_KEY configurée');
check('DATABASE_URL', envLocal.includes('DATABASE_URL'), 'DATABASE_URL configurée');
check('RESEND_API_KEY', envLocal.includes('RESEND_API_KEY'), 'RESEND_API_KEY configurée');

// 8. Résumé
console.log('\n' + '='.repeat(50));
const passed = results.filter(r => r.passed).length;
const total = results.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 Résumé: ${passed}/${total} vérifications réussies (${percentage}%)\n`);

if (percentage === 100) {
  console.log('🎉 Tout est prêt pour le déploiement Vercel!');
  console.log('\nProchaines étapes:');
  console.log('1. Créer un compte Vercel: https://vercel.com');
  console.log('2. Importer votre repository GitHub');
  console.log('3. Ajouter les variables d\'environnement');
  console.log('4. Cliquer "Deploy"');
  process.exit(0);
} else {
  console.log('⚠️  Veuillez corriger les erreurs avant de déployer:');
  results
    .filter(r => !r.passed)
    .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
  process.exit(1);
}
