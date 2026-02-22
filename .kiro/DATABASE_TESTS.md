# 🧪 Tests de Base de Données

## 📋 Fichiers de Test

### 1. `test-database.ts` - Test de Connexion
**Objectif:** Vérifier la connexion à la base de données Neon

**Exécuter:**
```bash
npx ts-node test-database.ts
```

**Résultat attendu:**
```
✅ Connection successful!
✅ Database initialized successfully!
📊 Database Statistics: { users: 0, products: 3, orders: 0, ... }
```

**Erreurs possibles:**
- ❌ DATABASE_URL not configured
- ❌ Connection refused
- ❌ Authentication failed

### 2. `test-database-demo.ts` - Test de Démonstration
**Objectif:** Montrer les fonctionnalités disponibles

**Exécuter:**
```bash
npx ts-node test-database-demo.ts
```

**Résultat attendu:**
```
✅ All tests passed!
✅ Available functions: getAllProducts(), createOrder(), ...
```

---

## 🚀 Étapes pour Tester

### Étape 1: Créer un Compte Neon
1. Aller sur https://neon.tech
2. Cliquer "Sign Up"
3. S'inscrire avec GitHub ou Email

### Étape 2: Créer un Projet
1. Cliquer "New Project"
2. Nommer: `grandson-clothes`
3. Région: `us-east-1`
4. Cliquer "Create Project"

### Étape 3: Obtenir la Connection String
1. Aller à "Connection string"
2. Sélectionner "Node.js"
3. Copier la chaîne complète

### Étape 4: Configurer `.env.local`
```env
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
```

### Étape 5: Initialiser la Base de Données
```bash
npx ts-node services/initDatabase.ts
```

### Étape 6: Tester la Connexion
```bash
npx ts-node test-database.ts
```

### Étape 7: Tester les Fonctionnalités
```bash
npx ts-node test-database-demo.ts
```

---

## ✅ Tests Inclus

### Test 1: Connection
- Vérifie la connexion à la base de données
- Affiche l'heure actuelle du serveur

### Test 2: Database Information
- Affiche le nom de la base de données
- Affiche l'utilisateur connecté
- Affiche la version de PostgreSQL

### Test 3: Tables
- Liste toutes les tables créées
- Vérifie que le schéma est correct

### Test 4: Products
- Compte le nombre de produits
- Affiche les détails des produits

### Test 5: Users
- Compte le nombre d'utilisateurs
- Affiche les détails des utilisateurs

### Test 6: Orders
- Compte le nombre de commandes
- Affiche les détails des commandes

### Test 7: Create Test User
- Crée un utilisateur de test
- Vérifie que l'insertion fonctionne

### Test 8: Query Functions
- Liste toutes les fonctions disponibles
- Montre comment les utiliser

---

## 📊 Résultats Attendus

### Après Initialisation

```
📊 Database Information:
   Database: grandson_db
   User: neondb_owner
   Version: PostgreSQL 15.x

📋 Tables in Database:
   ✅ users
   ✅ products
   ✅ orders
   ✅ order_items
   ✅ cart_items
   ✅ game_scores

📦 Products:
   Total: 3
   - Grandson Hoodie V1 (350000 GNF)
   - Orbit Cap (120000 GNF)
   - Lunar Cargo Pants (280000 GNF)

👥 Users:
   Total: 0

📦 Orders:
   Total: 0
```

---

## 🔧 Dépannage

### Erreur: "DATABASE_URL not configured"

**Cause:** La variable d'environnement n'est pas définie

**Solution:**
1. Créer un compte Neon
2. Créer un projet
3. Copier la connection string
4. Ajouter à `.env.local`

### Erreur: "Connection refused"

**Cause:** La base de données n'est pas accessible

**Solution:**
1. Vérifier la connection string
2. Vérifier la connexion Internet
3. Vérifier que le projet Neon est actif

### Erreur: "Authentication failed"

**Cause:** Le mot de passe est incorrect

**Solution:**
1. Vérifier la connection string
2. Réinitialiser le mot de passe dans Neon
3. Copier la nouvelle connection string

### Erreur: "Database does not exist"

**Cause:** Le nom de la base de données est incorrect

**Solution:**
1. Vérifier le nom dans la connection string
2. Vérifier dans le dashboard Neon
3. Créer la base de données si nécessaire

---

## 📚 Fonctions Disponibles

### Produits
```typescript
import { getAllProducts, getProductById, createProduct } from '@/services/queries';

// Récupérer tous les produits
const products = await getAllProducts();

// Récupérer un produit
const product = await getProductById(1);

// Créer un produit
const newProduct = await createProduct({
  name: 'New Product',
  price: 100000,
  category: 'Vêtements'
});
```

### Utilisateurs
```typescript
import { getUserByEmail, createUser } from '@/services/queries';

// Récupérer un utilisateur
const user = await getUserByEmail('test@example.com');

// Créer un utilisateur
const newUser = await createUser({
  email: 'new@example.com',
  name: 'New User'
});
```

### Commandes
```typescript
import { createOrder, getOrderById, getUserOrders } from '@/services/queries';

// Créer une commande
const order = await createOrder(userId, 500000);

// Récupérer une commande
const order = await getOrderById(1);

// Récupérer les commandes d'un utilisateur
const orders = await getUserOrders(userId);
```

### Panier
```typescript
import { addToCart, getCartItems, removeFromCart } from '@/services/queries';

// Ajouter au panier
await addToCart(userId, productId, 1, 'M', 'Black');

// Récupérer le panier
const cartItems = await getCartItems(userId);

// Supprimer du panier
await removeFromCart(cartItemId);
```

### Jeu
```typescript
import { saveGameScore, getTopScores } from '@/services/queries';

// Sauvegarder un score
await saveGameScore(userId, 1250, 5);

// Récupérer les top scores
const topScores = await getTopScores(10);
```

### Statistiques
```typescript
import { getDashboardStats, getMonthlyRevenue } from '@/services/queries';

// Récupérer les statistiques
const stats = await getDashboardStats();

// Récupérer le revenu mensuel
const revenue = await getMonthlyRevenue();
```

---

## ✨ Prêt à Tester!

1. Créer un compte Neon
2. Créer un projet
3. Configurer `.env.local`
4. Exécuter: `npx ts-node test-database.ts`

