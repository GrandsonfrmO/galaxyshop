/**
 * Vérifier que tous les fichiers de test sont en place
 */

import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface FileCheck {
  path: string;
  description: string;
  required: boolean;
}

const filesToCheck: FileCheck[] = [
  // Test files
  {
    path: 'test-complete-flow.ts',
    description: 'Test complet du flux e-commerce',
    required: true,
  },
  {
    path: 'run-complete-test.sh',
    description: 'Script bash pour exécuter le test',
    required: false,
  },
  // Documentation
  {
    path: 'TEST_COMPLETE_FLOW.md',
    description: 'Documentation du test complet',
    required: true,
  },
  {
    path: 'QUICK_TEST.md',
    description: 'Guide rapide',
    required: true,
  },
  {
    path: '.kiro/TEST_GUIDE.md',
    description: 'Guide détaillé',
    required: true,
  },
  {
    path: '.kiro/TEST_SUMMARY.md',
    description: 'Résumé des tests',
    required: true,
  },
  {
    path: '.kiro/TEST_CI_CD_INTEGRATION.md',
    description: 'Intégration CI/CD',
    required: true,
  },
  {
    path: '.kiro/TESTS_INDEX.md',
    description: 'Index des tests',
    required: true,
  },
];

async function verifyFiles() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║          VÉRIFICATION DES FICHIERS DE TEST                 ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  let passed = 0;
  let failed = 0;
  const missingRequired: string[] = [];

  for (const file of filesToCheck) {
    const fullPath = path.join(process.cwd(), file.path);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      const stats = fs.statSync(fullPath);
      const size = (stats.size / 1024).toFixed(2);
      log(`✓ ${file.path} (${size} KB)`, 'green');
      log(`  ${file.description}`, 'cyan');
      passed++;
    } else {
      if (file.required) {
        log(`✗ ${file.path} - MANQUANT`, 'red');
        log(`  ${file.description}`, 'cyan');
        missingRequired.push(file.path);
        failed++;
      } else {
        log(`⚠ ${file.path} - OPTIONNEL`, 'yellow');
        log(`  ${file.description}`, 'cyan');
      }
    }
  }

  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                    RÉSUMÉ                                   ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  log(`\n✓ Fichiers trouvés : ${passed}`, 'green');
  log(`✗ Fichiers manquants : ${failed}`, failed > 0 ? 'red' : 'green');

  if (missingRequired.length > 0) {
    log('\n⚠️  Fichiers requis manquants :', 'red');
    missingRequired.forEach(f => log(`  - ${f}`, 'red'));
    return false;
  }

  log('\n✓ Tous les fichiers requis sont présents !', 'green');
  return true;
}

async function verifyEnvironment() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║          VÉRIFICATION DE L\'ENVIRONNEMENT                   ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  const envFile = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envFile);

  if (!envExists) {
    log('⚠️  .env.local n\'existe pas', 'yellow');
    log('  Créez le fichier avec les variables d\'environnement', 'cyan');
    return false;
  }

  const envContent = fs.readFileSync(envFile, 'utf-8');
  const hasDatabaseUrl = envContent.includes('DATABASE_URL');
  const hasResendKey = envContent.includes('RESEND_API_KEY');

  log(`${hasDatabaseUrl ? '✓' : '✗'} DATABASE_URL défini`, hasDatabaseUrl ? 'green' : 'red');
  log(`${hasResendKey ? '✓' : '✗'} RESEND_API_KEY défini`, hasResendKey ? 'green' : 'red');

  return hasDatabaseUrl && hasResendKey;
}

async function verifyPackageJson() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║          VÉRIFICATION DU PACKAGE.JSON                      ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const hasTestScript = packageJson.scripts?.['test:complete-flow'];
  const hasDbTestScript = packageJson.scripts?.['test:db'];

  log(`${hasTestScript ? '✓' : '✗'} Script test:complete-flow`, hasTestScript ? 'green' : 'red');
  log(`${hasDbTestScript ? '✓' : '✗'} Script test:db`, hasDbTestScript ? 'green' : 'red');

  if (hasTestScript) {
    log(`  Commande : ${packageJson.scripts['test:complete-flow']}`, 'cyan');
  }

  return hasTestScript && hasDbTestScript;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'yellow');
  log('║     VÉRIFICATION COMPLÈTE DES TESTS                        ║', 'yellow');
  log('╚════════════════════════════════════════════════════════════╝', 'yellow');

  const filesOk = await verifyFiles();
  const envOk = await verifyEnvironment();
  const packageOk = await verifyPackageJson();

  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                    RÉSUMÉ FINAL                             ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  const allOk = filesOk && envOk && packageOk;

  if (allOk) {
    log('\n✓ TOUS LES TESTS SONT PRÊTS !', 'green');
    log('\nPour exécuter le test complet :', 'cyan');
    log('  npm run test:complete-flow', 'yellow');
  } else {
    log('\n⚠️  CERTAINS ÉLÉMENTS MANQUENT', 'red');
    if (!filesOk) log('  - Fichiers de test manquants', 'red');
    if (!envOk) log('  - Variables d\'environnement manquantes', 'red');
    if (!packageOk) log('  - Scripts npm manquants', 'red');
  }

  log('\n');
  process.exit(allOk ? 0 : 1);
}

main().catch(console.error);
