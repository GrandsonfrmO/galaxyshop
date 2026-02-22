# 🧩 Guide des Composants

## 📋 Vue d'Ensemble

L'application est organisée en 4 couches principales:

```
┌─────────────────────────────────────┐
│  UI Overlay (Navigation, Modales)   │
├─────────────────────────────────────┤
│  3D Scene (Three.js) OU Game (2D)   │
├─────────────────────────────────────┤
│  Store (Zustand - État Globale)     │
└─────────────────────────────────────┘
```

---

## 🎬 Composants Canvas (3D)

### `SceneCanvas.tsx`
**Rôle:** Conteneur principal pour la scène 3D

**Props:** Aucune (utilise le store)

**Contient:**
- `CameraRig` - Contrôle de caméra
- `TheOrbit` ou `TheBoutique` - Scènes
- Lumières et environnement

**Exemple d'utilisation:**
```typescript
<SceneCanvas />
```

---

### `CameraRig.tsx`
**Rôle:** Gestion de la caméra orbitale

**Fonctionnalités:**
- Rotation autour du centre
- Zoom avec souris
- Contrôle tactile mobile

**Paramètres modifiables:**
```typescript
const distance = 8;        // Distance de la caméra
const rotationSpeed = 0.5; // Vitesse de rotation
```

---

### `ClickableProduct.tsx`
**Rôle:** Produit 3D interactif

**Props:**
```typescript
interface Props {
  product: Product;
  position: [number, number, number];
  onClick: () => void;
}
```

**Événements:**
- Click → Ouvre le détail produit
- Hover → Animation de surbrillance

**Exemple:**
```typescript
<ClickableProduct 
  product={product}
  position={product.position}
  onClick={() => setSelectedProduct(product)}
/>
```

---

### `TheOrbit.tsx`
**Rôle:** Scène orbitale (vue par défaut)

**Contient:**
- Fond spatial
- 3 produits positionnés
- Animations

**Position des produits:**
```
[-4.5, 0.8, 0]  ← Hoodie (gauche)
[0, 1.4, 0]     ← Cap (centre)
[4.5, 0.8, 0]   ← Pants (droite)
```

---

### `TheBoutique.tsx`
**Rôle:** Scène boutique détaillée

**Différences avec Orbit:**
- Vue plus proche
- Détails supplémentaires
- Animations différentes

---

### `SpaceGame.tsx`
**Rôle:** Environnement spatial (fond)

**Contient:**
- Étoiles
- Planètes
- Effets de parallaxe

---

## 🎮 Composants UI

### `UIOverlay.tsx`
**Rôle:** Barre de navigation principale

**Éléments:**
- Logo/Titre
- Boutons de navigation
- Indicateurs d'état

**Actions:**
```typescript
- Accueil → setScene('ORBIT')
- Boutique → toggleShop(true)
- Jeu → startGame()
- Panier → toggleCart(true)
```

---

### `ProductOverlay.tsx`
**Rôle:** Affichage détail d'un produit

**Affiche:**
- Image du produit
- Nom et description
- Prix
- Sélecteur de taille/couleur
- Bouton "Ajouter au panier"

**État:**
```typescript
const selectedProduct = useStore(state => state.selectedProduct);
```

**Fermeture:**
- Click en dehors
- Bouton X
- Sélection d'un autre produit

---

### `CartSidebar.tsx`
**Rôle:** Panneau du panier

**Affiche:**
- Liste des articles
- Quantités
- Prix unitaires
- Total
- Boutons (Vider, Passer la commande)

**Actions:**
```typescript
removeFromCart(cartId)
clearCart()
toggleCheckout(true)
```

**Calcul du total:**
```typescript
const total = cart.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0
);
```

---

### `CheckoutModal.tsx`
**Rôle:** Processus de paiement

**Étapes:**
1. Résumé de la commande
2. Informations de livraison
3. Méthode de paiement
4. Confirmation

**À implémenter:**
- Validation des champs
- Intégration Stripe/PayPal
- Envoi de la commande

---

### `ShopModal.tsx`
**Rôle:** Catalogue de produits

**Affiche:**
- Grille de produits
- Filtres par catégorie
- Recherche
- Pagination

**Interactions:**
- Click sur produit → ProductOverlay
- Ajouter au panier direct

---

### `AdminPanel.tsx`
**Rôle:** Gestion administrative

**Fonctionnalités:**
- Ajouter produit
- Modifier produit
- Supprimer produit
- Voir statistiques

**Accès:**
```typescript
const isAdmin = useStore(state => state.isAdmin);
if (!isAdmin) return null;
```

---

## 🎮 Composants Jeu

### `NeonVanguard.tsx`
**Rôle:** Mini-jeu arcade 2D

**Mécanique:**
- Joueur contrôlable
- Ennemis qui attaquent
- Système de score
- Vagues progressives

**Contrôles:**
- Flèches/WASD → Mouvement
- Espace/Click → Tir
- ESC → Quitter

**État du jeu:**
```typescript
gameScore: number
gameHealth: number
gameLives: number
gameWave: number
isGameOver: boolean
```

**Événements:**
```typescript
incrementScore(points)      // Ennemi tué
takeDamage(amount)          // Touché par ennemi
playerDied()                // Perte d'une vie
nextWave()                  // Passage au niveau suivant
endGame()                   // Fin du jeu
```

---

## 🔄 Flux de Données

### Ajouter un Produit au Panier

```
ProductOverlay
    ↓
Sélectionner taille/couleur
    ↓
Click "Ajouter au panier"
    ↓
addToCart(product, size, color)
    ↓
useStore met à jour cart[]
    ↓
CartSidebar se met à jour
    ↓
isCartOpen = true (auto-ouverture)
```

### Changer de Scène

```
UIOverlay (click bouton)
    ↓
setScene('BOUTIQUE')
    ↓
useStore met à jour scene
    ↓
App.tsx re-render
    ↓
Affiche le bon composant
```

### Jouer au Jeu

```
UIOverlay (click "Jeu")
    ↓
startGame()
    ↓
scene = 'GAME'
    ↓
NeonVanguard s'affiche
    ↓
Joueur contrôle le personnage
    ↓
incrementScore() / takeDamage()
    ↓
playerDied() ou endGame()
    ↓
Afficher écran de fin
```

---

## 🎨 Personnalisation des Composants

### Modifier les Couleurs

**Fichier:** Chaque composant

```typescript
// Avant
className="bg-black text-white"

// Après
className="bg-gray-900 text-yellow-400"
```

### Ajouter des Animations

**Utiliser Framer Motion:**
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenu
</motion.div>
```

### Ajouter des Icônes

**Utiliser Lucide React:**
```typescript
import { ShoppingCart, Menu, X } from 'lucide-react';

<ShoppingCart size={24} />
```

---

## 🧪 Tester les Composants

### Tester ProductOverlay

```typescript
// Dans la console
const { setSelectedProduct } = useStore.getState();
setSelectedProduct(useStore.getState().products[0]);
```

### Tester le Panier

```typescript
const { addToCart, products } = useStore.getState();
addToCart(products[0], 'M', 'Black');
```

### Tester le Jeu

```typescript
const { startGame } = useStore.getState();
startGame();
```

---

## 📱 Responsive Design

### Breakpoints Tailwind

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Exemple Responsive

```typescript
<div className="
  w-full md:w-1/2 lg:w-1/3
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
">
  Contenu responsive
</div>
```

---

## 🔗 Dépendances des Composants

```
App.tsx
├── SceneCanvas
│   ├── CameraRig
│   ├── TheOrbit
│   │   └── ClickableProduct (x3)
│   └── TheBoutique
├── UIOverlay
├── ProductOverlay
├── CartSidebar
├── CheckoutModal
├── ShopModal
├── AdminPanel
└── NeonVanguard
```

---

## ✅ Checklist Composants

- [ ] Tous les composants importent useStore
- [ ] Pas de props drilling excessif
- [ ] Animations fluides
- [ ] Responsive sur mobile
- [ ] Accessibilité (alt text, labels)
- [ ] Pas de console.log en production

