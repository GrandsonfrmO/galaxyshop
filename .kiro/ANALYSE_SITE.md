# 📊 Analyse du Site - Grandson Clothes Immersive Store

## 🎯 Vue d'ensemble
**Nom du projet:** Grandson Clothes - Immersive Store  
**Type:** Application React 3D interactive avec e-commerce et mini-jeu  
**Stack:** React 19 + Three.js + Vite + TypeScript  
**Devise:** GNF (Franc Guinéen)

---

## 🏗️ Architecture Générale

### Structure du Projet
```
├── canvas/              # Composants 3D (Three.js/React Three Fiber)
├── game/                # Jeu 2D (NeonVanguard)
├── ui/                  # Composants UI (modales, panneaux)
├── store/               # Gestion d'état (Zustand)
├── services/            # Données et services
├── lib/                 # Configuration (Prisma schema)
└── types.ts             # Types TypeScript globaux
```

---

## 🎮 Scènes Principales

### 1. **ORBIT** (Scène par défaut)
- Vue 3D de l'espace avec produits positionnés
- Caméra orbitale interactive
- Affichage des 3 produits principaux

### 2. **BOUTIQUE** (Shop Mode)
- Vue détaillée de la boutique
- Affichage des produits avec overlay

### 3. **GAME** (NeonVanguard)
- Mini-jeu 2D arcade
- Système de score et vies
- Gestion des vagues d'ennemis

### 4. **TRANSITIONING**
- État intermédiaire entre scènes

---

## 📦 Produits Actuels

| ID | Nom | Prix (GNF) | Catégorie | Tailles | Couleurs |
|----|-----|-----------|-----------|---------|----------|
| 1 | Grandson Hoodie V1 | 350,000 | Vêtements | S-XL | Black, Navy |
| 2 | Orbit Cap | 120,000 | Accessoires | One Size | Beige, Olive |
| 3 | Lunar Cargo Pants | 280,000 | Pantalons | 30-36 | Black, Grey |

---

## 🛒 Système de Panier

**Fonctionnalités:**
- Ajout/suppression d'articles
- Sélection de taille et couleur
- Gestion des quantités
- Détection des doublons (même produit + taille + couleur)
- Stockage en mémoire (pas de persistance)

**État du panier:**
```typescript
cart: CartItem[]
isCartOpen: boolean
isCheckoutOpen: boolean
```

---

## 🎮 Système de Jeu (NeonVanguard)

**Mécanique:**
- Score: Points gagnés en tuant des ennemis
- Santé: 100 HP (diminue avec les dégâts)
- Vies: 3 vies (game over à 0)
- Vagues: Progression des niveaux de difficulté

**Persistance:**
- High score sauvegardé dans localStorage
- Clé: `neon_vanguard_highscore`

---

## 🔐 Authentification & Admin

**Mode Admin:**
- Toggle via `toggleAdmin()`
- Accès au panneau d'administration
- Gestion des produits (CRUD)

**API Gemini:**
- Clé stockée dans `.env.local`
- Variable: `GEMINI_API_KEY`
- Utilisée pour fonctionnalités IA

---

## 🎨 Composants UI Principaux

| Composant | Rôle |
|-----------|------|
| `UIOverlay` | Barre de navigation principale |
| `ProductOverlay` | Affichage détail produit |
| `CartSidebar` | Panneau du panier |
| `CheckoutModal` | Processus de paiement |
| `ShopModal` | Catalogue de produits |
| `AdminPanel` | Gestion admin |

---

## 🎨 Composants 3D (Canvas)

| Composant | Fonction |
|-----------|----------|
| `SceneCanvas` | Conteneur principal 3D |
| `CameraRig` | Contrôle de la caméra |
| `ClickableProduct` | Produits interactifs 3D |
| `SpaceGame` | Environnement spatial |
| `TheBoutique` | Scène boutique |
| `TheOrbit` | Scène orbitale |

---

## 🔧 Configuration Technique

### Vite
- **Port:** 3000
- **Host:** 0.0.0.0 (accessible en réseau)
- **Alias:** `@/` → racine du projet

### TypeScript
- **Target:** ES2022
- **Module:** ESNext
- **JSX:** react-jsx

### Dépendances Clés
```json
{
  "react": "^19.2.4",
  "three": "^0.182.0",
  "@react-three/fiber": "^9.5.0",
  "zustand": "^5.0.11",
  "gsap": "^3.14.2",
  "framer-motion": "^12.34.0",
  "@google/genai": "^1.41.0"
}
```

---

## 📱 Optimisations Mobiles

- `touch-action: none` pour contrôle du jeu
- `user-select: none` pour UX fluide
- Viewport non-zoomable: `user-scalable=no`
- Gestion des événements tactiles

---

## 🚀 Scripts Disponibles

```bash
npm run dev      # Démarrage développement (port 3000)
npm run build    # Build production
npm run preview  # Aperçu du build
```

---

## ⚠️ Points d'Attention

1. **Pas de persistance panier:** Les articles ne sont pas sauvegardés
2. **Pas de backend:** Données en mémoire uniquement
3. **Pas de paiement réel:** Checkout est une démo
4. **Images placeholder:** Utilise picsum.photos
5. **Prisma schema:** Présent mais non utilisé (pas de DB)

---

## 🔄 Flux de Données

```
useStore (Zustand)
    ↓
App.tsx (sélectionne la scène)
    ├→ SceneCanvas (3D)
    ├→ NeonVanguard (Jeu)
    └→ UI Components (Modales/Panneaux)
```

---

## 📋 Checklist Configuration

- [x] Dépendances installées
- [ ] `.env.local` configuré avec clé Gemini
- [ ] Port 3000 disponible
- [ ] Node.js 18+ installé
- [ ] Vérifier les performances 3D

---

## 🎯 Prochaines Étapes Recommandées

1. **Backend:** Implémenter API pour produits/commandes
2. **Persistance:** Ajouter localStorage/DB pour panier
3. **Paiement:** Intégrer Stripe/PayPal
4. **Images:** Remplacer placeholders par vraies images
5. **Analytics:** Tracker les interactions utilisateur
6. **SEO:** Ajouter métadonnées dynamiques

