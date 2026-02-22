# ⚙️ Guide de Configuration - Grandson Clothes

## 🚀 Démarrage Rapide

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Configuration de l'API Gemini

**Fichier:** `.env.local`

```env
GEMINI_API_KEY=votre_clé_api_ici
```

**Obtenir une clé:**
1. Aller sur [Google AI Studio](https://ai.google.dev/)
2. Créer un nouveau projet
3. Générer une clé API
4. Copier-coller dans `.env.local`

### 3. Lancer le Serveur de Développement
```bash
npm run dev
```

L'app sera accessible à: `http://localhost:3000`

---

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `GEMINI_API_KEY` | Clé API Google Gemini | ✅ Oui |

### Ports et Réseau

**Vite Config (vite.config.ts):**
```typescript
server: {
  port: 3000,        // Port d'écoute
  host: '0.0.0.0',   // Accessible en réseau local
}
```

**Accès réseau:**
- Local: `http://localhost:3000`
- Réseau: `http://<votre-ip>:3000`

### Alias TypeScript

```typescript
// Utiliser @/ pour importer depuis la racine
import { useStore } from '@/store/useStore';
```

---

## 📊 Gestion d'État (Zustand)

### Accéder au Store

```typescript
import { useStore } from '@/store/useStore';

function MyComponent() {
  const scene = useStore(state => state.scene);
  const setScene = useStore(state => state.setScene);
  
  return <div>{scene}</div>;
}
```

### Actions Disponibles

**Navigation:**
```typescript
setScene('ORBIT' | 'BOUTIQUE' | 'GAME' | 'TRANSITIONING')
```

**Produits:**
```typescript
addProduct(product)
updateProduct(product)
deleteProduct(id)
setProducts(products)
```

**Panier:**
```typescript
addToCart(product, size, color)
removeFromCart(cartId)
clearCart()
toggleCart(isOpen?)
```

**Jeu:**
```typescript
startGame()
endGame()
resetGame()
incrementScore(points)
takeDamage(amount)
playerDied()
```

---

## 🎨 Personnalisation

### Ajouter un Produit

**Fichier:** `store/useStore.ts`

```typescript
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '4',
    name: 'Nouveau Produit',
    price: 150000,
    description: 'Description du produit',
    category: 'Catégorie',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White'],
    imageUrl: 'https://...',
    position: [0, 0, 0]  // Position 3D
  }
];
```

### Modifier les Couleurs du Thème

**Fichier:** `index.html`

```css
body {
  background: #050505;  /* Couleur de fond */
  color: white;         /* Couleur du texte */
}
```

### Changer les Polices

**Fichier:** `index.html`

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;800&display=swap" rel="stylesheet">
```

---

## 🎮 Configuration du Jeu

### Paramètres NeonVanguard

**Fichier:** `game/NeonVanguard.tsx`

Paramètres modifiables:
- Vitesse du joueur
- Cadence de tir
- Santé initiale
- Nombre de vies
- Difficulté des vagues

### High Score

Stocké dans localStorage:
```typescript
localStorage.getItem('neon_vanguard_highscore')
localStorage.setItem('neon_vanguard_highscore', score)
```

---

## 🛒 Configuration du Panier

### Devise

Actuellement: **GNF (Franc Guinéen)**

Pour changer, modifier dans:
- `store/useStore.ts` (commentaires)
- `ui/CartSidebar.tsx` (affichage)
- `ui/CheckoutModal.tsx` (total)

### Taxes et Frais

À implémenter dans `CheckoutModal.tsx`:
```typescript
const taxRate = 0.18;  // 18% TVA
const shippingFee = 5000;  // Frais de port
```

---

## 🔐 Mode Admin

### Activer le Mode Admin

**Via Console:**
```javascript
// Dans la console du navigateur
localStorage.setItem('admin_mode', 'true');
location.reload();
```

**Via Code:**
```typescript
const toggleAdmin = useStore(state => state.toggleAdmin);
toggleAdmin();
```

### Fonctionnalités Admin

- Ajouter/modifier/supprimer produits
- Voir les statistiques
- Gérer les commandes (à implémenter)

---

## 🚨 Dépannage

### Port 3000 Déjà Utilisé

```bash
# Changer le port dans vite.config.ts
server: {
  port: 3001,  // Nouveau port
}
```

### Erreur "GEMINI_API_KEY not found"

1. Vérifier que `.env.local` existe
2. Vérifier la clé est correcte
3. Redémarrer le serveur: `npm run dev`

### Problèmes de Performance 3D

1. Réduire la qualité des textures
2. Diminuer le nombre de lumières
3. Optimiser les modèles 3D
4. Vérifier les logs: `npm run dev`

### Panier Vide Après Rechargement

C'est normal - le panier n'est pas persisté. À implémenter:
```typescript
// Sauvegarder dans localStorage
localStorage.setItem('cart', JSON.stringify(cart));
```

---

## 📦 Build Production

### Créer un Build

```bash
npm run build
```

Génère un dossier `dist/` prêt pour le déploiement.

### Prévisualiser le Build

```bash
npm run preview
```

### Déployer

Options recommandées:
- **Vercel:** `vercel deploy`
- **Netlify:** `netlify deploy`
- **GitHub Pages:** Configuration dans vite.config.ts

---

## 🔗 Ressources Utiles

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev)
- [Google Gemini API](https://ai.google.dev)

---

## ✅ Checklist de Configuration

- [ ] Dépendances installées (`npm install`)
- [ ] `.env.local` configuré avec clé Gemini
- [ ] Serveur lancé (`npm run dev`)
- [ ] App accessible sur `http://localhost:3000`
- [ ] Produits affichés correctement
- [ ] Panier fonctionnel
- [ ] Jeu jouable
- [ ] Mode admin accessible

