# 📚 Documentation Grandson Clothes

Bienvenue dans la documentation complète du projet **Grandson Clothes - Immersive Store**.

## 🎯 Démarrage Rapide

```bash
# 1. Installer
npm install

# 2. Configurer
echo "GEMINI_API_KEY=votre_clé_api" > .env.local

# 3. Lancer
npm run dev

# 4. Accéder
# http://localhost:3000
```

---

## 📖 Documentation

### 🚀 Nouveau? Commencez ici
- **[QUICK_START.md](QUICK_START.md)** - Démarrage en 5 minutes
- **[INDEX.md](INDEX.md)** - Navigation complète

### 📊 Comprendre le Projet
- **[ANALYSE_SITE.md](ANALYSE_SITE.md)** - Vue d'ensemble complète
- **[CONFIGURATION.md](CONFIGURATION.md)** - Configuration détaillée

### 🧩 Développer
- **[COMPOSANTS.md](COMPOSANTS.md)** - Documentation des composants
- **[COMMANDES.md](COMMANDES.md)** - Commandes essentielles

### 🚀 Déployer
- **[DEPLOIEMENT.md](DEPLOIEMENT.md)** - Guide de déploiement

### 🎯 Améliorer
- **[AMELIORATIONS.md](AMELIORATIONS.md)** - Roadmap et améliorations

---

## 🎮 Fonctionnalités

### 🌌 Scène Orbitale
- Vue 3D interactive
- 3 produits positionnés
- Caméra orbitale

### 🏪 Boutique
- Catalogue de produits
- Détails produit
- Sélection taille/couleur

### 🛒 Panier
- Gestion des articles
- Calcul du total
- Checkout (démo)

### 🎮 Mini-Jeu
- Jeu arcade 2D
- Système de score
- High score persistant

---

## 🏗️ Architecture

```
App.tsx
├── SceneCanvas (3D)
├── NeonVanguard (Jeu)
├── UIOverlay (Navigation)
├── ProductOverlay (Détail)
├── CartSidebar (Panier)
├── CheckoutModal (Paiement)
├── ShopModal (Catalogue)
└── AdminPanel (Admin)

Store (Zustand)
├── Scene State
├── Product State
├── Cart State
└── Game State
```

---

## 📦 Stack Technique

- **React** 19.2.4
- **Three.js** 0.182.0
- **Zustand** 5.0.11
- **Vite** 6.2.0
- **TypeScript** 5.8.2
- **Tailwind CSS**

---

## 🚀 Scripts

```bash
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Prévisualiser build
```

---

## 🔐 Configuration

### Variables d'Environnement
```env
GEMINI_API_KEY=votre_clé_api
```

### Ports
- Développement: `http://localhost:3000`
- Preview: `http://localhost:4173`

---

## 📱 Produits

| Produit | Prix | Catégorie |
|---------|------|-----------|
| Grandson Hoodie V1 | 350,000 GNF | Vêtements |
| Orbit Cap | 120,000 GNF | Accessoires |
| Lunar Cargo Pants | 280,000 GNF | Pantalons |

---

## ⚠️ Limitations Actuelles

- ❌ Pas de persistance panier
- ❌ Pas de backend
- ❌ Pas de paiement réel
- ❌ Pas d'authentification
- ❌ Images placeholder

---

## 🎯 Prochaines Étapes

1. **Court terme:** Persistance panier, backend API
2. **Moyen terme:** Authentification, paiement Stripe
3. **Long terme:** Recherche, ratings, wishlist

Voir [AMELIORATIONS.md](AMELIORATIONS.md) pour la roadmap complète.

---

## 📞 Support

### Ressources
- [React Docs](https://react.dev)
- [Three.js Docs](https://threejs.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev)

### Dépannage
- Voir [CONFIGURATION.md](CONFIGURATION.md) - Dépannage
- Voir [COMMANDES.md](COMMANDES.md) - Troubleshooting

---

## 🚀 Déploiement

### Options Recommandées
1. **Vercel** - Déploiement automatique
2. **Netlify** - Interface intuitive
3. **GitHub Pages** - Gratuit et simple

Voir [DEPLOIEMENT.md](DEPLOIEMENT.md) pour les détails.

---

## 📚 Documentation Complète

Tous les documents sont disponibles dans le dossier `.kiro/`:

```
.kiro/
├── README.md              # Ce fichier
├── INDEX.md               # Navigation
├── QUICK_START.md         # Démarrage rapide
├── ANALYSE_SITE.md        # Vue d'ensemble
├── CONFIGURATION.md       # Configuration
├── COMPOSANTS.md          # Composants
├── DEPLOIEMENT.md         # Déploiement
├── AMELIORATIONS.md       # Roadmap
├── COMMANDES.md           # Commandes
└── steering/
    └── project-context.md # Contexte du projet
```

---

## ✅ Checklist Démarrage

- [ ] `npm install`
- [ ] `.env.local` configuré
- [ ] `npm run dev` lancé
- [ ] App accessible sur `http://localhost:3000`
- [ ] Produits affichés
- [ ] Panier fonctionne
- [ ] Jeu jouable

---

## 🎉 Prêt!

Vous êtes maintenant prêt à développer, tester et déployer.

**Commencez par:** [QUICK_START.md](QUICK_START.md)

---

## 📄 Licence

Projet créé avec Vite + React + Three.js

---

**Bon développement!** 🚀

