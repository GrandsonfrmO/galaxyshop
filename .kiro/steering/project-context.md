---
inclusion: auto
---

# 📚 Contexte du Projet - Grandson Clothes

## 🎯 Résumé Exécutif

**Grandson Clothes** est une boutique de vêtements immersive avec:
- Interface 3D interactive (Three.js)
- Mini-jeu arcade 2D (NeonVanguard)
- Système e-commerce complet
- Gestion d'état centralisée (Zustand)

**Stack:** React 19 + Three.js + Vite + TypeScript

---

## 🏗️ Architecture Clé

### Couches de l'Application
```
UI Layer (Modales, Navigation)
    ↓
3D/Game Layer (Canvas ou NeonVanguard)
    ↓
State Layer (Zustand Store)
```

### Scènes Disponibles
- **ORBIT:** Vue 3D par défaut avec 3 produits
- **BOUTIQUE:** Vue détaillée de la boutique
- **GAME:** Mini-jeu arcade 2D
- **TRANSITIONING:** État intermédiaire

---

## 📦 Produits Actuels

1. **Grandson Hoodie V1** - 350,000 GNF
2. **Orbit Cap** - 120,000 GNF
3. **Lunar Cargo Pants** - 280,000 GNF

---

## 🔑 Fichiers Importants

| Fichier | Rôle |
|---------|------|
| `store/useStore.ts` | Gestion d'état globale |
| `App.tsx` | Composant racine |
| `canvas/SceneCanvas.tsx` | Conteneur 3D |
| `game/NeonVanguard.tsx` | Mini-jeu |
| `ui/UIOverlay.tsx` | Navigation principale |

---

## 🚀 Commandes Essentielles

```bash
npm install      # Installer dépendances
npm run dev      # Démarrer développement (port 3000)
npm run build    # Build production
npm run preview  # Prévisualiser build
```

---

## 🔐 Configuration Requise

**`.env.local`:**
```env
GEMINI_API_KEY=votre_clé_api
```

---

## 📖 Documentation Complète

Voir les fichiers dans `.kiro/`:
- `ANALYSE_SITE.md` - Analyse détaillée
- `CONFIGURATION.md` - Guide de configuration
- `COMPOSANTS.md` - Documentation des composants
- `DEPLOIEMENT.md` - Guide de déploiement
- `AMELIORATIONS.md` - Roadmap et améliorations

---

## ⚠️ Points d'Attention

1. **Pas de persistance panier** - À implémenter
2. **Pas de backend** - Données en mémoire
3. **Pas de paiement réel** - Checkout est une démo
4. **Images placeholder** - À remplacer

---

## 🎯 Prochaines Étapes

1. Configurer `.env.local` avec clé Gemini
2. Lancer `npm run dev`
3. Tester les 3 scènes (Orbit, Boutique, Jeu)
4. Implémenter persistance panier
5. Ajouter backend API

