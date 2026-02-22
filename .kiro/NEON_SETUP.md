# 🗄️ Configuration Neon Database

## 🚀 Démarrage Rapide

### 1. Créer un Compte Neon

1. Aller sur [neon.tech](https://neon.tech)
2. Cliquer sur "Sign Up"
3. S'inscrire avec GitHub ou Email
4. Vérifier votre email

### 2. Créer un Projet

1. Dans le dashboard Neon, cliquer sur "New Project"
2. Remplir les informations:
   - **Project Name:** `grandson-clothes`
   - **Region:** Choisir la région la plus proche
   - **Database Name:** `grandson_db` (par défaut)
   - **Role Name:** `neondb_owner` (par défaut)

3. Cliquer sur "Create Project"

### 3. Obtenir la Connection String

1. Dans le projet, aller à "Connection string"
2. Copier la chaîne de connexion (format: `postgresql://...`)
3. Ajouter à `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
```

---

## 📊 Schéma de Base de Données

Créer les tables suivantes dans Neon:

### 1. Table Users (Utilisateurs)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. Table Products (Produits)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  position_x FLOAT,
  position_y FLOAT,
  position_z FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
```

### 3. Table Orders (Commandes)

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 4. Table Order Items (Articles de Commande)

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  price_at_purchase INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### 5. Table Cart (Panier)

```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
```

### 6. Table Game Scores (Scores du Jeu)

```sql
CREATE TABLE game_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  wave INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX idx_game_scores_score ON game_scores(score DESC);
```

---

## 🔧 Installation des Dépendances

### Installer le driver PostgreSQL

```bash
npm install pg
npm install --save-dev @types/pg
```

### Ou utiliser le driver Neon Serverless

```bash
npm install @neondatabase/serverless
```

---

## 💻 Créer un Service de Base de Données

Créer le fichier `services/database.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return pool.connect();
};

export default pool;
```

---

## 🌿 Créer des Branches de Développement

Neon permet de créer des branches isolées pour le développement:

### Via le Dashboard

1. Aller à "Branches" dans votre projet
2. Cliquer sur "New Branch"
3. Nommer la branche (ex: `development`, `staging`)
4. Cliquer sur "Create Branch"
5. Copier la connection string de la branche

### Ajouter à `.env.local`

```env
DATABASE_URL=postgresql://...@host/grandson_db (production)
DATABASE_URL_DEV=postgresql://...@host/grandson_db?branch=development
DATABASE_URL_STAGING=postgresql://...@host/grandson_db?branch=staging
```

---

## 📝 Insérer les Produits Initiaux

```sql
INSERT INTO products (name, description, price, category, image_url, sizes, colors)
VALUES
  (
    'Grandson Hoodie V1',
    'Heavyweight cotton hoodie with embroidered logo.',
    350000,
    'Vêtements',
    'https://picsum.photos/400/400?random=1',
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Black', 'Navy']
  ),
  (
    'Orbit Cap',
    '5-panel cap structured for deep space exploration.',
    120000,
    'Accessoires',
    'https://picsum.photos/400/400?random=2',
    ARRAY['One Size'],
    ARRAY['Beige', 'Olive']
  ),
  (
    'Lunar Cargo Pants',
    'Technical cargo pants with multiple pockets and relaxed fit.',
    280000,
    'Pantalons',
    'https://picsum.photos/400/400?random=3',
    ARRAY['30', '32', '34', '36'],
    ARRAY['Black', 'Grey']
  );
```

---

## 🔐 Variables d'Environnement

Ajouter à `.env.local`:

```env
# Neon Database
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db

# Optionnel: Branches de développement
DATABASE_URL_DEV=postgresql://user:password@host.neon.tech/grandson_db?branch=development
DATABASE_URL_STAGING=postgresql://user:password@host.neon.tech/grandson_db?branch=staging

# Gemini API
GEMINI_API_KEY=votre_clé_api
```

---

## 🧪 Tester la Connexion

Créer un fichier `test-db.ts`:

```typescript
import pool from './services/database';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connexion réussie:', result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
```

Lancer:
```bash
npx ts-node test-db.ts
```

---

## 📊 Avantages de Neon

✅ **Serverless** - Pas de serveur à gérer  
✅ **Autoscaling** - Ajuste automatiquement les ressources  
✅ **Scale-to-zero** - Économise les coûts en suspendant les branches inactives  
✅ **Branching** - Créez des copies isolées pour le développement  
✅ **PostgreSQL complet** - Toutes les fonctionnalités de PostgreSQL  
✅ **Gratuit pour démarrer** - Tier gratuit généreux  
✅ **Point-in-time recovery** - Récupérez les données à n'importe quel moment  

---

## 🚀 Prochaines Étapes

1. ✅ Créer un compte Neon
2. ✅ Créer un projet
3. ✅ Obtenir la connection string
4. ✅ Ajouter à `.env.local`
5. ✅ Installer les dépendances (`npm install pg`)
6. ✅ Créer le schéma de base de données
7. ✅ Insérer les données initiales
8. ✅ Tester la connexion
9. ✅ Intégrer dans l'application

---

## 📚 Ressources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [pg Driver](https://node-postgres.com)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)

