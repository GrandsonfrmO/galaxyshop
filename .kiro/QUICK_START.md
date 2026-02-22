# ⚡ Quick Start - Grandson Clothes

## 🎯 En 5 Minutes

### 1️⃣ Installer
```bash
npm install
```

### 2️⃣ Configurer
Créer `.env.local`:
```env
GEMINI_API_KEY=votre_clé_api
```

### 3️⃣ Lancer
```bash
npm run dev
```

### 4️⃣ Accéder
```
http://localhost:3000
```

### 5️⃣ Tester
- Cliquer sur les produits
- Ajouter au panier
- Jouer au jeu

---

## 🗺️ Navigation

```
┌─────────────────────────────────────┐
│  ACCUEIL (ORBIT)                    │
│  - Vue 3D                           │
│  - 3 produits                       │
│  - Caméra interactive               │
└─────────────────────────────────────┘
         ↓ Click produit
┌─────────────────────────────────────┐
│  DÉTAIL PRODUIT                     │
│  - Image                            │
│  - Description                      │
│  - Sélecteur taille/couleur         │
│  - Ajouter au panier                │
└─────────────────────────────────────┘
         ↓ Ajouter
┌─────────────────────────────────────┐
│  PANIER                             │
│  - Articles                         │
│  - Total                            │
│  - Passer la commande               │
└─────────────────────────────────────┘
         ↓ Checkout
┌─────────────────────────────────────┐
│  PAIEMENT (DÉMO)                    │
│  - Résumé commande                  │
│  - Informations livraison           │
│  - Confirmation                     │
└─────────────────────────────────────┘
```

---

## 🎮 Jeu

```
┌─────────────────────────────────────┐
│  NEON VANGUARD                      │
│  ┌─────────────────────────────────┐│
│  │ Score: 1250  Health: 75  Lives: 2││
│  │                                  ││
│  │        [Ennemis]                 ││
│  │                                  ││
│  │           [Joueur]               ││
│  │                                  ││
│  │  Wave: 3                         ││
│  └─────────────────────────────────┘│
│  Contrôles: Flèches + Espace        │
└─────────────────────────────────────┘
```

---

## 📦 Produits

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Grandson Hoodie  │  │   Orbit Cap      │  │ Lunar Cargo      │
│                  │  │                  │  │ Pants            │
│ 350,000 GNF      │  │ 120,000 GNF      │  │ 280,000 GNF      │
│                  │  │                  │  │                  │
│ S, M, L, XL      │  │ One Size         │  │ 30, 32, 34, 36   │
│ Black, Navy      │  │ Beige, Olive     │  │ Black, Grey      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev          # Lancer serveur (port 3000)

# Production
npm run build        # Créer build
npm run preview      # Tester build

# Nettoyage
rm -rf node_modules  # Supprimer dépendances
npm install          # Réinstaller
```

---

## 🐛 Dépannage Rapide

### ❌ "Port 3000 déjà utilisé"
```bash
# Utiliser un autre port
# Modifier vite.config.ts: port: 3001
```

### ❌ "GEMINI_API_KEY not found"
```bash
# Vérifier .env.local existe
# Vérifier la clé est correcte
# Redémarrer: npm run dev
```

### ❌ "Panier vide après rechargement"
```
C'est normal - à implémenter avec localStorage
```

### ❌ "Erreur 3D"
```bash
# Vérifier la console (F12)
# Vérifier les logs: npm run dev
```

---

## 📊 État de l'Application

```typescript
// Accéder au store
const store = useStore.getState();

// Voir l'état
console.log(store);

// Modifier l'état
store.setScene('BOUTIQUE');
store.addToCart(product, 'M', 'Black');
store.startGame();
```

---

## 🎨 Personnalisation Rapide

### Changer la couleur de fond
**Fichier:** `index.html`
```css
body {
  background: #050505;  /* Changer ici */
}
```

### Ajouter un produit
**Fichier:** `store/useStore.ts`
```typescript
const INITIAL_PRODUCTS = [
  // Ajouter ici
];
```

### Changer le prix
**Fichier:** `store/useStore.ts`
```typescript
{
  id: '1',
  price: 350000,  // Changer ici
}
```

---

## 📱 Tester sur Mobile

### Accès Local
```
http://<votre-ip>:3000
```

### Avec ngrok (tunnel)
```bash
npm install -g ngrok
ngrok http 3000
# Utiliser l'URL fournie
```

---

## 🚀 Déployer en 1 Minute

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📚 Documentation Complète

- 📊 [ANALYSE_SITE.md](.kiro/ANALYSE_SITE.md) - Vue d'ensemble
- ⚙️ [CONFIGURATION.md](.kiro/CONFIGURATION.md) - Configuration
- 🧩 [COMPOSANTS.md](.kiro/COMPOSANTS.md) - Composants
- 🚀 [DEPLOIEMENT.md](.kiro/DEPLOIEMENT.md) - Déploiement
- 🎯 [AMELIORATIONS.md](.kiro/AMELIORATIONS.md) - Roadmap

---

## ✅ Checklist Démarrage

- [ ] `npm install` ✓
- [ ] `.env.local` configuré ✓
- [ ] `npm run dev` lancé ✓
- [ ] App accessible sur `http://localhost:3000` ✓
- [ ] Produits affichés ✓
- [ ] Panier fonctionne ✓
- [ ] Jeu jouable ✓

---

## 🎉 Prêt!

Vous êtes maintenant prêt à:
- ✅ Développer
- ✅ Tester
- ✅ Déployer

**Bon développement!** 🚀

