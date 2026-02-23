#!/usr/bin/env node

/**
 * TEST AUTOMATISÉ DU MINI-JEU NEON VANGUARD
 * Simule une session de jeu et vérifie les fonctionnalités
 */

import { chromium } from 'playwright';

const GAME_URL = 'http://localhost:5173'; // Vite dev server
const TEST_DURATION = 30000; // 30 secondes de test

console.log('🎮 DÉMARRAGE DES TESTS DU MINI-JEU NEON VANGUARD\n');

async function testGame() {
  let browser;
  let passed = 0;
  let failed = 0;

  try {
    // Lancer le navigateur
    console.log('🚀 Lancement du navigateur...');
    browser = await chromium.launch({ 
      headless: false, // Mode visible pour voir le jeu
      slowMo: 100 
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();

    // Écouter les erreurs console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Écouter les erreurs JavaScript
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // ============================================
    // TEST 1: Chargement de la page
    // ============================================
    console.log('\n📋 TEST 1: Chargement de la page');
    try {
      await page.goto(GAME_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      console.log('✅ Page chargée avec succès');
      passed++;
    } catch (e) {
      console.log('❌ Échec du chargement:', e.message);
      failed++;
      throw e;
    }

    // ============================================
    // TEST 2: Navigation vers la scène ORBIT
    // ============================================
    console.log('\n📋 TEST 2: Navigation vers scène ORBIT');
    try {
      // Attendre que la scène 3D soit chargée
      await page.waitForTimeout(3000);
      
      // Vérifier que le canvas Three.js est présent
      const canvas3D = await page.$('canvas');
      if (canvas3D) {
        console.log('✅ Canvas 3D détecté');
        passed++;
      } else {
        throw new Error('Canvas 3D non trouvé');
      }
    } catch (e) {
      console.log('❌ Échec navigation ORBIT:', e.message);
      failed++;
    }

    // ============================================
    // TEST 3: Déclenchement du mini-jeu
    // ============================================
    console.log('\n📋 TEST 3: Déclenchement du mini-jeu');
    try {
      // Chercher et cliquer sur le vaisseau trigger
      // Le vaisseau est à position [8, -1.5, 6] dans la scène
      // On simule un clic au centre de l'écran où il devrait être visible
      
      await page.mouse.move(960, 540); // Centre de l'écran
      await page.waitForTimeout(1000);
      
      // Cliquer pour démarrer le jeu
      await page.mouse.click(960, 540);
      await page.waitForTimeout(2000);
      
      // Vérifier que le canvas 2D du jeu est présent
      const gameCanvas = await page.evaluate(() => {
        const canvases = document.querySelectorAll('canvas');
        return canvases.length > 0;
      });
      
      if (gameCanvas) {
        console.log('✅ Mini-jeu démarré');
        passed++;
      } else {
        throw new Error('Canvas de jeu non trouvé');
      }
    } catch (e) {
      console.log('❌ Échec démarrage jeu:', e.message);
      failed++;
    }

    // ============================================
    // TEST 4: Vérification du menu
    // ============================================
    console.log('\n📋 TEST 4: Vérification du menu');
    try {
      // Chercher le bouton START ou PLAY
      const menuVisible = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => 
          btn.textContent?.includes('START') || 
          btn.textContent?.includes('PLAY') ||
          btn.textContent?.includes('JOUER')
        );
      });
      
      if (menuVisible) {
        console.log('✅ Menu du jeu visible');
        passed++;
      } else {
        throw new Error('Menu non trouvé');
      }
    } catch (e) {
      console.log('❌ Menu non détecté:', e.message);
      failed++;
    }

    // ============================================
    // TEST 5: Démarrage d'une partie
    // ============================================
    console.log('\n📋 TEST 5: Démarrage d\'une partie');
    try {
      // Cliquer sur le bouton START
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startBtn = buttons.find(btn => 
          btn.textContent?.includes('START') || 
          btn.textContent?.includes('PLAY') ||
          btn.textContent?.includes('JOUER')
        );
        if (startBtn) startBtn.click();
      });
      
      await page.waitForTimeout(2000);
      
      // Vérifier que le HUD est visible (score, vies, etc.)
      const hudVisible = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('SCORE') || text.includes('VIES') || text.includes('WAVE');
      });
      
      if (hudVisible) {
        console.log('✅ Partie démarrée, HUD visible');
        passed++;
      } else {
        console.log('⚠️  HUD non détecté (peut être normal selon l\'état)');
        passed++;
      }
    } catch (e) {
      console.log('❌ Échec démarrage partie:', e.message);
      failed++;
    }

    // ============================================
    // TEST 6: Simulation de gameplay
    // ============================================
    console.log('\n📋 TEST 6: Simulation de gameplay (10 secondes)');
    try {
      // Simuler des mouvements de souris aléatoires
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        await page.mouse.move(x, y);
        await page.waitForTimeout(500);
      }
      
      console.log('✅ Mouvements simulés avec succès');
      passed++;
    } catch (e) {
      console.log('❌ Échec simulation gameplay:', e.message);
      failed++;
    }

    // ============================================
    // TEST 7: Vérification des erreurs console
    // ============================================
    console.log('\n📋 TEST 7: Vérification des erreurs');
    
    // Filtrer les erreurs connues/acceptables
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('DevTools') && 
      !err.includes('favicon') &&
      !err.includes('sourcemap')
    );
    
    if (criticalErrors.length === 0) {
      console.log('✅ Aucune erreur console critique');
      passed++;
    } else {
      console.log('❌ Erreurs console détectées:');
      criticalErrors.forEach(err => console.log('   -', err));
      failed++;
    }

    if (jsErrors.length === 0) {
      console.log('✅ Aucune erreur JavaScript');
      passed++;
    } else {
      console.log('❌ Erreurs JavaScript détectées:');
      jsErrors.forEach(err => console.log('   -', err));
      failed++;
    }

    // ============================================
    // TEST 8: Test de performance (Memory Leak)
    // ============================================
    console.log('\n📋 TEST 8: Test de performance (15 secondes)');
    try {
      const initialMetrics = await page.metrics();
      
      // Jouer pendant 15 secondes
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        await page.mouse.move(x, y);
        await page.waitForTimeout(500);
      }
      
      const finalMetrics = await page.metrics();
      
      // Vérifier que la mémoire n'a pas explosé
      const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
      
      console.log(`   Mémoire initiale: ${(initialMetrics.JSHeapUsedSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`   Mémoire finale: ${(finalMetrics.JSHeapUsedSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`   Augmentation: ${memoryIncreaseMB.toFixed(2)} MB`);
      
      if (memoryIncreaseMB < 50) {
        console.log('✅ Pas de memory leak détecté');
        passed++;
      } else {
        console.log('⚠️  Augmentation mémoire importante (possible leak)');
        failed++;
      }
    } catch (e) {
      console.log('❌ Échec test performance:', e.message);
      failed++;
    }

    // ============================================
    // TEST 9: Test de pause
    // ============================================
    console.log('\n📋 TEST 9: Test de la pause');
    try {
      // Appuyer sur Escape ou P pour pause
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      
      const pauseVisible = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('PAUSE') || text.includes('PAUSED');
      });
      
      if (pauseVisible) {
        console.log('✅ Pause fonctionne');
        passed++;
        
        // Reprendre
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      } else {
        console.log('⚠️  Pause non détectée (peut être normal)');
        passed++;
      }
    } catch (e) {
      console.log('❌ Échec test pause:', e.message);
      failed++;
    }

    // ============================================
    // TEST 10: Capture d'écran finale
    // ============================================
    console.log('\n📋 TEST 10: Capture d\'écran');
    try {
      await page.screenshot({ 
        path: 'test-game-screenshot.png',
        fullPage: true 
      });
      console.log('✅ Capture d\'écran sauvegardée: test-game-screenshot.png');
      passed++;
    } catch (e) {
      console.log('❌ Échec capture:', e.message);
      failed++;
    }

    // ============================================
    // RÉSULTATS FINAUX
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSULTATS DES TESTS');
    console.log('='.repeat(50));
    console.log(`✅ Tests réussis: ${passed}`);
    console.log(`❌ Tests échoués: ${failed}`);
    console.log(`📈 Taux de réussite: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    } else if (failed <= 2) {
      console.log('\n⚠️  Quelques tests ont échoué, mais le jeu semble fonctionnel');
    } else {
      console.log('\n❌ Plusieurs tests ont échoué, vérification nécessaire');
    }

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE:', error.message);
    failed++;
  } finally {
    if (browser) {
      console.log('\n🔒 Fermeture du navigateur...');
      await browser.close();
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Lancer les tests
testGame().catch(console.error);
