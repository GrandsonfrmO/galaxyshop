# Neon Database Migration Guide

## Configuration Neon

### 1. Vérifier la connexion Neon

Assurez-vous que votre `.env.local` contient :

```env
DATABASE_URL=postgresql://[user]:[password]@[host].neon.tech/[database]?sslmode=require
```

### 2. Exécuter les migrations

#### Option 1 : Via npm script (recommandé)

```bash
npm run migrate
```

#### Option 2 : Directement avec ts-node

```bash
npx ts-node services/runMigrations.ts
```

#### Option 3 : Via Neon CLI

```bash
neonctl sql --project-id [project-id] < services/migrations/001_initial_schema.sql
```

## Structure des migrations

Les migrations sont stockées dans `services/migrations/` avec le format :
- `001_initial_schema.sql` - Schéma initial
- `002_add_feature.sql` - Nouvelle fonctionnalité
- etc.

Chaque migration est exécutée une seule fois et enregistrée dans la table `migrations`.

## Vérifier les migrations

### Via psql

```bash
psql $DATABASE_URL -c "SELECT * FROM migrations;"
```

### Via Node.js

```typescript
import { query } from './services/database';

const result = await query('SELECT * FROM migrations');
console.log(result.rows);
```

## Créer une nouvelle migration

1. Créer un fichier `services/migrations/002_your_migration.sql`
2. Ajouter votre SQL
3. Exécuter `npm run migrate`

Exemple :

```sql
-- Migration: 002_add_user_profile
-- Description: Add user profile fields
-- Created: 2026-02-21

ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

CREATE INDEX idx_users_phone ON users(phone);
```

## Données initiales

Les données initiales sont insérées dans la migration `001_initial_schema.sql` :

- 3 produits de test
- 3 zones de livraison
- Paramètres PWA par défaut

## Rollback (annulation)

Pour annuler une migration, vous devez :

1. Créer une nouvelle migration avec les commandes UNDO
2. Exécuter la nouvelle migration

Exemple :

```sql
-- Migration: 003_rollback_user_profile
-- Description: Rollback user profile fields

ALTER TABLE users DROP COLUMN IF EXISTS bio;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users DROP COLUMN IF EXISTS phone;

DROP INDEX IF EXISTS idx_users_phone;
```

## Vérifier l'état de la base de données

### Voir toutes les tables

```bash
psql $DATABASE_URL -c "\dt"
```

### Voir la structure d'une table

```bash
psql $DATABASE_URL -c "\d products"
```

### Voir les index

```bash
psql $DATABASE_URL -c "\di"
```

## Troubleshooting

### Erreur : "relation already exists"

La table existe déjà. Utilisez `IF NOT EXISTS` dans vos migrations.

### Erreur : "permission denied"

Vérifiez que votre utilisateur Neon a les permissions nécessaires.

### Erreur : "connection refused"

Vérifiez que `DATABASE_URL` est correct et que Neon est accessible.

## Bonnes pratiques

1. ✅ Toujours utiliser `IF NOT EXISTS` pour les CREATE
2. ✅ Toujours utiliser `IF EXISTS` pour les DROP
3. ✅ Créer des index pour les colonnes fréquemment interrogées
4. ✅ Ajouter des commentaires descriptifs
5. ✅ Tester les migrations sur une branche Neon d'abord
6. ✅ Garder les migrations petites et focalisées
7. ✅ Documenter les changements de schéma

## Intégration CI/CD

Pour exécuter les migrations automatiquement au déploiement :

```yaml
# .github/workflows/deploy.yml
- name: Run migrations
  run: npm run migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoring

Vérifier les migrations exécutées :

```sql
SELECT name, executed_at FROM migrations ORDER BY executed_at DESC;
```

Voir les tables créées :

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Support

Pour plus d'informations sur Neon :
- [Documentation Neon](https://neon.tech/docs)
- [Neon CLI](https://neon.tech/docs/reference/neon-cli)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
