# 🗄️ Configuration Complète de Neon Database

## ✅ Étapes de Configuration

### Étape 1: Créer un Compte Neon

1. Aller sur [neon.tech](https://neon.tech)
2. Cliquer sur "Sign Up"
3. S'inscrire avec GitHub ou Email
4. Vérifier votre email

### Étape 2: Créer un Projet Neon

1. Dans le dashboard Neon, cliquer sur "New Project"
2. Remplir les informations:
   - **Project Name:** `grandson-clothes`
   - **Region:** Choisir la région la plus proche (ex: `us-east-1`)
   - **Database Name:** `grandson_db` (par défaut)
   - **Role Name:** `neondb_owner` (par défaut)

3. Cliquer sur "Create Project"
4. Attendre que le projet soit créé (quelques secondes)

### Étape 3: Obtenir la Connection String

1. Dans le projet Neon, aller à l'onglet "Connection string"
2. Sélectionner "Node.js" dans le dropdown
3. Copier la chaîne de connexion complète
4. Elle ressemble à: `postgresql://user:password@host.neon.tech/grandson_db`

### Étape 4: Configurer les Variables d'Environnement

1. Ouvrir le fichier `.env.local`
2. Remplacer la ligne `DATABASE_URL` par votre connection string:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
```

**Important:** Ne pas commiter ce fichier à Git!

### Étape 5: Initialiser la Base de Données

Exécuter le script d'initialisation:

```bash
npx ts-node services/initDatabase.ts
```

Vous devriez voir:
```
✅ Database connection successful
✅ Database initialized successfully!
📊 Database Statistics: { users: 0, products: 3, orders: 0, ... }
```

---

## 🌿 Créer des Branches de Développement (Optionnel)

Neon permet de créer des branches isolées pour le développement:

### Via le Dashboard Neon

1. Aller à "Branches" dans votre projet
2. Cliquer sur "New Branch"
3. Nommer la branche:
   - `development` pour le développement
   - `staging` pour la mise en scène
4. Cliquer sur "Create Branch"
5. Copier la connection string de la branche

### Ajouter à `.env.local`

```env
# Production
DATABASE_URL=postgresql://...@host/grandson_db

# Development
DATABASE_URL_DEV=postgresql://...@host/grandson_db?branch=development

# Staging
DATABASE_URL_STAGING=postgresql://...@host/grandson_db?branch=staging
```

---

## 📊 Schéma de Base de Données

Le schéma suivant est automatiquement créé:

### Tables Principales

1. **users** - Utilisateurs et clients
2. **products** - Catalogue de produits
3. **orders** - Commandes
4. **order_items** - Articles dans les commandes
5. **cart_items** - Articles dans le panier
6. **game_scores** - Scores du jeu NeonVanguard

### Données Initiales

Les 3 produits suivants sont automatiquement insérés:
- Grandson Hoodie V1 (350,000 GNF)
- Orbit Cap (120,000 GNF)
- Lunar Cargo Pants (280,000 GNF)

---

## 🔧 Utiliser la Base de Données dans l'Application

### Importer le service

```typescript
import { query } from '@/services/database';

// Exécuter une requête
const result = await query('SELECT * FROM products');
console.log(result.rows);
```

### Exemples de Requêtes

**Récupérer tous les produits:**
```typescript
const result = await query('SELECT * FROM products');
const products = result.rows;
```

**Créer une commande:**
```typescript
const result = await query(
  'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
  [userId, totalAmount, 'pending']
);
const order = result.rows[0];
```

**Récupérer les commandes d'un utilisateur:**
```typescript
const result = await query(
  'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
  [userId]
);
const orders = result.rows;
```

---

## 🧪 Tester la Connexion

### Via le Script d'Initialisation

```bash
npx ts-node services/initDatabase.ts
```

### Via la Console

```typescript
import pool from '@/services/database';

const result = await pool.query('SELECT NOW()');
console.log('✅ Connexion réussie:', result.rows[0]);
```

---

## 📈 Avantages de Neon

✅ **Serverless** - Pas de serveur à gérer  
✅ **Autoscaling** - Ajuste automatiquement les ressources  
✅ **Scale-to-zero** - Économise les coûts en suspendant les branches inactives  
✅ **Branching** - Créez des copies isolées pour le développement  
✅ **PostgreSQL complet** - Toutes les fonctionnalités de PostgreSQL  
✅ **Gratuit pour démarrer** - Tier gratuit généreux  
✅ **Point-in-time recovery** - Récupérez les données à n'importe quel moment  
✅ **Monitoring** - Dashboard pour surveiller l'utilisation  

---

## 🚀 Prochaines Étapes

1. ✅ Créer un compte Neon
2. ✅ Créer un projet
3. ✅ Obtenir la connection string
4. ✅ Ajouter à `.env.local`
5. ✅ Exécuter `npx ts-node services/initDatabase.ts`
6. ✅ Intégrer dans l'application

---

## 🔐 Sécurité

### ✅ À Faire

- Stocker la connection string dans `.env.local`
- Ne pas commiter `.env.local` à Git
- Utiliser des variables d'environnement en production
- Activer SSL (activé par défaut dans Neon)
- Utiliser des rôles de base de données avec permissions limitées

### ❌ À Éviter

- Commiter la connection string à Git
- Hardcoder la connection string dans le code
- Utiliser le même mot de passe pour tous les rôles
- Exposer la connection string dans les logs

---

## 📚 Ressources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [pg Driver](https://node-postgres.com)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)

---

## ❓ Dépannage

### Erreur: "Connection refused"

**Cause:** La connection string est incorrecte ou le projet n'existe pas

**Solution:**
1. Vérifier la connection string dans le dashboard Neon
2. Vérifier que le projet est actif
3. Vérifier que la région est correcte

### Erreur: "ENOTFOUND"

**Cause:** Le hostname n'est pas résolvable

**Solution:**
1. Vérifier la connection string
2. Vérifier la connexion Internet
3. Vérifier que Neon n'est pas bloqué par un firewall

### Erreur: "Authentication failed"

**Cause:** Le mot de passe est incorrect

**Solution:**
1. Vérifier la connection string
2. Réinitialiser le mot de passe dans le dashboard Neon
3. Copier la nouvelle connection string

### Erreur: "Database does not exist"

**Cause:** Le nom de la base de données est incorrect

**Solution:**
1. Vérifier le nom de la base de données dans la connection string
2. Vérifier dans le dashboard Neon
3. Créer la base de données si elle n'existe pas

---

## 📞 Support

- [Neon Support](https://neon.tech/support)
- [Neon Community](https://neon.tech/community)
- [PostgreSQL Community](https://www.postgresql.org/community)

