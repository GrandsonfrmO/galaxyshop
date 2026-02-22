# 📚 Documentation Grandson Clothes

Bienvenue dans la documentation complète du projet **Grandson Clothes - Immersive Store**.

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration
Créer/modifier `.env.local`:
```env
GEMINI_API_KEY=votre_clé_api_google
```

### 3. Lancer le serveur
```bash
npm run dev
```

Accès: `http://localhost:3000`

---

## 📖 Documentation Disponible

### 📊 [ANALYSE_SITE.md](.kiro/ANALYSE_SITE.md)
Vue d'ensemble complète du projet:
- Architecture générale
- Scènes et fonctionnalités
- Produits actuels
- Système de panier
- Configuration technique

### ⚙️ [CONFIGURATION.md](.kiro/CONFIGURATION.md)
Guide de configuration détaillé:
- Installation des dépendances
- Configuration API Gemini
- Variables d'environnement
- Gestion d'état (Zustand)
- Personnalisation du thème

### 🧩 [COMPOSANTS.md](.kiro/COMPOSANTS.md)
Documentation des composants:
- Composants Canvas (3D)
- Composants UI
- Composants Jeu
- Flux de données
- Exemples d'utilisation

### 🚀 [DEPLOIEMENT.md](.kiro/DEPLOIEMENT.md)
Guide de déploiement:
- Build production
- Vercel, Netlify, GitHub Pages
- Serveur personnel (VPS)
- Variables d'environnement
- Monitoring et analytics

### 🎯 [AMELIORATIONS.md](.kiro/AMELIORATIONS.md)
Roadmap et améliorations:
- Priorités (haute, moyenne, basse)
- Persistance panier
- Backend API
- Authentification
- Paiement Stripe
- Tests et optimisations

---

## 🎮 Fonctionnalités Principales

### 🌌 Scène Orbitale (ORBIT)
- Vue 3D interactive
- 3 produits positionnés dans l'espace
- Caméra orbitale contrôlable
- Animations fluides

### 🏪 Boutique (BOUTIQUE)
- Catalogue de produits
- Détails produit
- Sélection taille/couleur
- Ajout au panier

### 🛒 Panier
- Gestion des articles
- Calcul du total
- Détection des doublons
- Checkout (démo)

### 🎮 Mini-Jeu (NEON VANGUARD)
- Jeu arcade 2D
- Système de score
- Vies et santé
- Vagues progressives
- High score persistant

---

## 🏗️ Architecture

```
App.tsx (Racine)
├── SceneCanvas (3D)
│   ├── CameraRig
│   ├── TheOrbit / TheBoutique
│   └── ClickableProduct (x3)
├── NeonVanguard (Jeu 2D)
├── UIOverlay (Navigation)
├── ProductOverlay (Détail produit)
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

## 📦 Produits

| Produit | Prix | Catégorie | Tailles |
|---------|------|-----------|---------|
| Grandson Hoodie V1 | 350,000 GNF | Vêtements | S-XL |
| Orbit Cap | 120,000 GNF | Accessoires | One Size |
| Lunar Cargo Pants | 280,000 GNF | Pantalons | 30-36 |

---

## 🔧 Stack Technique

### Frontend
- **React** 19.2.4 - UI library
- **Three.js** 0.182.0 - 3D graphics
- **React Three Fiber** 9.5.0 - React + Three.js
- **Zustand** 5.0.11 - State management
- **Framer Motion** 12.34.0 - Animations
- **GSAP** 3.14.2 - Animation library
- **Tailwind CSS** - Styling
- **TypeScript** 5.8.2 - Type safety

### Build & Dev
- **Vite** 6.2.0 - Build tool
- **Node.js** 18+ - Runtime

### Services
- **Google Gemini API** - IA
- **Supabase** (optionnel) - Backend

---

## 🚀 Scripts Disponibles

```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run preview  # Prévisualiser build
```

---

## 🔐 Variables d'Environnement

### Requises
- `GEMINI_API_KEY` - Clé API Google Gemini

### Optionnelles
- `VITE_API_URL` - URL de l'API backend
- `VITE_STRIPE_KEY` - Clé publique Stripe

---

## 📱 Responsive Design

L'application est optimisée pour:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (320px+)

Utilise Tailwind CSS pour les breakpoints.

---

## 🎯 Cas d'Usage

### Utilisateur Standard
1. Accède à la boutique
2. Explore les produits en 3D
3. Sélectionne un produit
4. Ajoute au panier
5. Procède au checkout

### Joueur
1. Lance le mini-jeu
2. Contrôle le personnage
3. Tue les ennemis
4. Gagne des points
5. Vise le high score

### Administrateur
1. Accède au panneau admin
2. Ajoute/modifie/supprime produits
3. Voit les statistiques
4. Gère les commandes

---

## ⚠️ Limitations Actuelles

1. **Pas de persistance panier** - Vide au rechargement
2. **Pas de backend** - Données en mémoire
3. **Pas de paiement réel** - Checkout est une démo
4. **Pas d'authentification** - Pas de comptes utilisateurs
5. **Images placeholder** - Utilise picsum.photos

---

## 🔄 Flux de Données

```
Utilisateur interagit
    ↓
Composant appelle action Zustand
    ↓
Store met à jour l'état
    ↓
Composants re-render
    ↓
UI mise à jour
```

---

## 🧪 Tester Localement

### Tester le Panier
```javascript
// Console du navigateur
const { addToCart, products } = useStore.getState();
addToCart(products[0], 'M', 'Black');
```

### Tester le Jeu
```javascript
const { startGame } = useStore.getState();
startGame();
```

### Tester le Mode Admin
```javascript
const { toggleAdmin } = useStore.getState();
toggleAdmin();
```

---

## 🚀 Déploiement

### Options Recommandées
1. **Vercel** - Déploiement automatique depuis Git
2. **Netlify** - Interface intuitive
3. **GitHub Pages** - Gratuit et simple
4. **VPS Personnel** - Contrôle total

Voir [DEPLOIEMENT.md](.kiro/DEPLOIEMENT.md) pour les détails.

---

## 🎯 Prochaines Étapes

### Court Terme (1-2 semaines)
- [ ] Configurer `.env.local`
- [ ] Tester localement
- [ ] Implémenter persistance panier
- [ ] Ajouter backend API basique

### Moyen Terme (3-4 semaines)
- [ ] Authentification utilisateur
- [ ] Paiement Stripe
- [ ] Base de données
- [ ] Système de commandes

### Long Terme (5+ semaines)
- [ ] Recherche et filtres
- [ ] Système de notation
- [ ] Wishlist
- [ ] Notifications email
- [ ] Analytics avancées

Voir [AMELIORATIONS.md](.kiro/AMELIORATIONS.md) pour la roadmap complète.

---

## 📞 Support

### Ressources
- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev)

### Dépannage
Voir les sections "Dépannage" dans:
- [CONFIGURATION.md](.kiro/CONFIGURATION.md)
- [DEPLOIEMENT.md](.kiro/DEPLOIEMENT.md)

---

## 📄 Licence

Projet créé avec Vite + React + Three.js

---

## 🎉 Bon Développement!

Vous avez maintenant toute la documentation nécessaire pour:
- ✅ Comprendre l'architecture
- ✅ Configurer l'environnement
- ✅ Développer de nouvelles fonctionnalités
- ✅ Déployer en production
- ✅ Optimiser et améliorer

**Commencez par:** `npm install` puis `npm run dev`

