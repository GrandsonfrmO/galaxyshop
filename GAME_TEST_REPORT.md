# 🎮 RAPPORT DE TEST - NEON VANGUARD

## 📋 Vue d'ensemble

Ce document contient les scripts et guides de test pour le mini-jeu Neon Vanguard.

---

## 🛠️ Scripts de Test Disponibles

### 1. Test Automatisé (Playwright)
**Fichier:** `scripts/test-game.mjs`

**Prérequis:**
```bash
npm install -D playwright
npx playwright install chromium
```

**Lancement:**
```bash
node scripts/test-game.mjs
```

**Ce qu'il teste:**
- ✅ Chargement de la page
- ✅ Navigation vers scène ORBIT
- ✅ Déclenchement du mini-jeu
- ✅ Vérification du menu
- ✅ Démarrage d'une partie
- ✅ Simulation de gameplay
- ✅ Détection d'erreurs console
- ✅ Test de performance (memory leak)
- ✅ Test de pause
- ✅ Capture d'écran

**Durée:** ~1 minute

---

### 2. Test Manuel (Guide Interactif)
**Fichier:** `scripts/test-game-manual.mjs`

**Lancement:**
```bash
node scripts/test-game-manual.mjs
```

**Ce qu'il fournit:**
- 📝 Checklist complète de 15 tests
- 🐛 Liste des bugs à surveiller
- 💡 Conseils de test
- 🎯 Critères de succès

**Durée:** ~10-15 minutes

---

## 🎯 Tests Prioritaires

### Critiques (À tester en premier)

1. **Memory Leak Audio**
   - Jouer pendant 15 minutes
   - Vérifier la mémoire dans F12 > Performance
   - ✅ Mémoire stable = pas de leak
   - ❌ Mémoire qui augmente constamment = leak

2. **Collision Detection**
   - Voler près des ennemis
   - Vérifier que les collisions sont justes
   - ✅ Contact visuel = dégâts
   - ❌ Dégâts sans contact = bug

3. **Feedback Visuel**
   - Mettre en pause (ESC)
   - Vérifier l'overlay avec stats
   - Prendre des dégâts
   - Vérifier le flash rouge

4. **Persistance**
   - Faire un high score
   - Rafraîchir la page (F5)
   - Vérifier que le score est sauvegardé

---

## 📊 Résultats Attendus

### Avant Corrections
```
❌ Memory leak après 10-15 min
❌ Collisions imprécises
❌ Pas d'overlay pause
❌ Pas de persistance
```

### Après Corrections
```
✅ Jeu stable pendant des heures
✅ Collisions 100% précises
✅ Overlay pause avec stats
✅ High scores sauvegardés
```

---

## 🐛 Bugs Connus (Avant Corrections)

### Critiques
1. **AudioContext Memory Leak**
   - Symptôme: Crash après 10-15 minutes
   - Cause: Nouveau contexte audio à chaque son
   - Fix: Réutiliser un contexte global

2. **Collision Imprécise**
   - Symptôme: Touché sans contact visuel
   - Cause: Distance euclidienne simple
   - Fix: AABB (Axis-Aligned Bounding Box)

### Moyens
3. **Pas d'Overlay Pause**
   - Symptôme: Pause invisible
   - Fix: Ajouter overlay avec stats

4. **Pas de Persistance**
   - Symptôme: High score perdu au refresh
   - Fix: LocalStorage

---

## 🔍 Comment Tester Chaque Correction

### Test 1: Memory Leak Audio ✅

**Avant:**
```typescript
// ❌ Crée un nouveau contexte à chaque son
const playSound = () => {
  const ctx = new AudioContext(); // LEAK!
}
```

**Après:**
```typescript
// ✅ Réutilise le contexte
const audioCtx = useRef<AudioContext>();
const playSound = () => {
  const ctx = getAudioContext(); // Réutilise
}
```

**Test:**
1. Ouvrir F12 > Performance > Memory
2. Cliquer "Record"
3. Jouer pendant 5 minutes
4. Arrêter l'enregistrement
5. Vérifier le graphique de mémoire

**Résultat attendu:**
- ✅ Ligne relativement plate (variations normales)
- ❌ Ligne qui monte constamment (leak)

---

### Test 2: Collision Detection ✅

**Avant:**
```typescript
// ❌ Distance euclidienne imprécise
const dist = Math.hypot(e.x - player.x, e.y - player.y);
if (dist < hitRadius) { /* collision */ }
```

**Après:**
```typescript
// ✅ AABB précis
if (checkAABBCollision(playerHitbox, enemyHitbox)) {
  /* collision */
}
```

**Test:**
1. Voler très près d'un ennemi sans le toucher
2. Vérifier qu'il n'y a pas de dégâts
3. Toucher légèrement un ennemi
4. Vérifier qu'il y a des dégâts

**Résultat attendu:**
- ✅ Dégâts uniquement au contact visuel
- ❌ Dégâts sans contact = bug

---

### Test 3: Feedback Visuel ✅

**Ajouts:**
- Overlay pause avec stats
- Flash rouge lors des dégâts
- Barre de vie HUD

**Test:**
1. Appuyer sur ESC pendant le jeu
2. Vérifier l'overlay pause
3. Vérifier les stats (score, vague, vies)
4. Prendre des dégâts
5. Vérifier le flash rouge

**Résultat attendu:**
- ✅ Overlay visible avec toutes les infos
- ✅ Flash rouge visible lors des dégâts
- ✅ Barre de vie mise à jour

---

### Test 4: Persistance ✅

**Ajout:**
- LocalStorage pour high scores

**Test:**
1. Jouer et faire un score (ex: 5000)
2. Retourner au menu
3. Vérifier que le high score est affiché
4. Rafraîchir la page (F5)
5. Vérifier que le high score est toujours là

**Résultat attendu:**
- ✅ High score sauvegardé après refresh
- ✅ Stats visibles dans le menu

---

## 📈 Métriques de Performance

### Cibles
- **FPS:** 60 FPS constant
- **Mémoire:** < 200 MB
- **Augmentation mémoire:** < 50 MB sur 15 min
- **Temps de chargement:** < 3 secondes

### Comment Mesurer

**FPS:**
```javascript
// Dans la console
let fps = 0;
let lastTime = performance.now();
const measureFPS = () => {
  const now = performance.now();
  fps = 1000 / (now - lastTime);
  lastTime = now;
  console.log('FPS:', Math.round(fps));
  requestAnimationFrame(measureFPS);
};
measureFPS();
```

**Mémoire:**
1. F12 > Performance
2. Cliquer sur "Memory"
3. Cliquer "Record"
4. Jouer pendant 5 minutes
5. Arrêter et analyser

---

## ✅ Checklist de Validation Finale

Avant de considérer le jeu prêt pour la production:

### Fonctionnalités
- [ ] Menu fonctionne
- [ ] Briefing s'affiche
- [ ] Gameplay fluide
- [ ] Contrôles réactifs
- [ ] Ennemis variés
- [ ] Boss apparaît vague 5
- [ ] Bonus fonctionnent
- [ ] HUD mis à jour
- [ ] Pause fonctionne
- [ ] Game Over s'affiche

### Performance
- [ ] 60 FPS constant
- [ ] Pas de memory leak
- [ ] Pas de lag après 15 min
- [ ] Chargement rapide

### Audio
- [ ] Sons laser
- [ ] Sons explosion
- [ ] Sons bonus
- [ ] Pas de crackling

### Visuel
- [ ] Animations fluides
- [ ] Particules visibles
- [ ] Feedback dégâts
- [ ] Overlay pause

### Persistance
- [ ] High score sauvegardé
- [ ] Stats affichées
- [ ] Survit au refresh

---

## 🚀 Commandes Rapides

```bash
# Lancer le serveur
npm run dev

# Test automatisé
node scripts/test-game.mjs

# Guide manuel
node scripts/test-game-manual.mjs

# Vérifier les erreurs
# Ouvrir F12 > Console

# Mesurer la performance
# F12 > Performance > Record
```

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifier la console (F12)
2. Vérifier les fichiers de correction:
   - `GAME_FIXES_CRITIQUES.md`
   - `game/PATCHES_TO_APPLY.ts`
3. Appliquer les patches si nécessaire

---

**Dernière mise à jour:** 2024
**Version du jeu:** 1.0.0
**Status:** ✅ Prêt pour les tests
