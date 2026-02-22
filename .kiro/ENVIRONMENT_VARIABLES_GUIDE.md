# 🔑 Guide Complet: Variables d'Environnement

## 📋 Variables Requises

### 1. GEMINI_API_KEY
**Description**: Clé API Google Gemini pour l'IA
**Où l'obtenir**: https://aistudio.google.com/app/apikeys
**Format**: `AIza...` (commence par AIza)
**Utilisation**: Génération de contenu IA

```bash
# Exemple
GEMINI_API_KEY=AIzaSyDxxx...
```

### 2. DATABASE_URL
**Description**: URL de connexion PostgreSQL Neon
**Où l'obtenir**: Dashboard Neon
**Format**: `postgresql://user:password@host.neon.tech/dbname`
**Utilisation**: Connexion à la base de données

```bash
# Exemple
DATABASE_URL=postgresql://grandson_user:password123@ep-cool-wave-12345.us-east-1.neon.tech/grandson_db
```

### 3. RESEND_API_KEY
**Description**: Clé API Resend pour l'email
**Où l'obtenir**: https://resend.com/api-keys
**Format**: `re_...` (commence par re_)
**Utilisation**: Envoi d'emails

```bash
# Exemple
RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
```

## 🔐 Où Ajouter les Variables

### Local Development (.env.local)
```bash
# .env.local (NE PAS COMMITER)
GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://...
RESEND_API_KEY=your_key_here
```

### Production (Vercel Dashboard)
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. **Settings** → **Environment Variables**
4. Ajouter chaque variable

### Preview Deployments
Les variables de production sont utilisées par défaut
Vous pouvez créer des variables spécifiques pour Preview

## 🛠️ Obtenir Chaque Clé

### GEMINI_API_KEY

#### Étape 1: Créer un compte Google
- Aller sur https://aistudio.google.com
- Se connecter avec un compte Google

#### Étape 2: Créer une clé API
1. Cliquer sur "Get API Key"
2. Cliquer "Create API Key"
3. Copier la clé

#### Étape 3: Vérifier la clé
```bash
# Tester localement
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### DATABASE_URL

#### Étape 1: Créer un compte Neon
- Aller sur https://neon.tech
- S'inscrire avec GitHub

#### Étape 2: Créer une base de données
1. Cliquer "New Project"
2. Nommer le projet (ex: "grandson_db")
3. Cliquer "Create Project"

#### Étape 3: Obtenir la connexion
1. Aller dans "Connection String"
2. Copier l'URL PostgreSQL
3. Format: `postgresql://user:password@host.neon.tech/dbname`

#### Étape 4: Vérifier la connexion
```bash
# Tester localement
psql "postgresql://user:password@host.neon.tech/dbname" -c "SELECT 1;"
```

### RESEND_API_KEY

#### Étape 1: Créer un compte Resend
- Aller sur https://resend.com
- S'inscrire

#### Étape 2: Créer une clé API
1. Aller dans "API Keys"
2. Cliquer "Create API Key"
3. Copier la clé

#### Étape 3: Vérifier le domaine
1. Aller dans "Domains"
2. Ajouter votre domaine (ex: noreply@grandson.com)
3. Vérifier les DNS records

#### Étape 4: Tester l'email
```bash
# Tester localement
npm run test-email
```

## 📝 Format des Variables

### DATABASE_URL - Format Exact
```
postgresql://[user]:[password]@[host]:[port]/[database]

Exemple:
postgresql://grandson_user:MySecurePassword123@ep-cool-wave-12345.us-east-1.neon.tech:5432/grandson_db

Parties:
- user: grandson_user
- password: MySecurePassword123
- host: ep-cool-wave-12345.us-east-1.neon.tech
- port: 5432 (optionnel, défaut 5432)
- database: grandson_db
```

### GEMINI_API_KEY - Format
```
AIza[A-Za-z0-9_-]{35}

Exemple:
AIzaSyDxxx...
```

### RESEND_API_KEY - Format
```
re_[A-Za-z0-9_-]{32}

Exemple:
re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
```

## ✅ Vérifier les Variables

### Localement
```bash
# Vérifier que .env.local existe
ls -la .env.local

# Vérifier les variables
cat .env.local

# Tester la base de données
npm run migrate:check

# Tester l'API
npm run dev:full
curl http://localhost:5000/health
```

### Sur Vercel
1. Dashboard Vercel
2. Sélectionner le projet
3. **Settings** → **Environment Variables**
4. Vérifier que toutes les variables sont présentes

## 🔒 Sécurité

### Ne Jamais Commiter
```bash
# ❌ MAUVAIS
git add .env.local
git commit -m "Add env vars"

# ✅ BON
# .env.local est dans .gitignore
git status  # .env.local ne doit pas apparaître
```

### Vérifier .gitignore
```bash
cat .gitignore | grep -E "\.env|secrets"
```

### Rotation des Clés
1. Générer une nouvelle clé
2. Ajouter dans Vercel
3. Tester
4. Supprimer l'ancienne clé

## 🚨 Erreurs Courantes

### Erreur: "Invalid API Key"
```
Cause: Clé API incorrecte ou expirée
Solution: 
1. Vérifier la clé dans le dashboard
2. Régénérer si nécessaire
3. Mettre à jour dans Vercel
```

### Erreur: "Database connection failed"
```
Cause: DATABASE_URL incorrecte
Solution:
1. Vérifier le format: postgresql://user:password@host/db
2. Vérifier que Neon est accessible
3. Tester: psql "DATABASE_URL" -c "SELECT 1;"
```

### Erreur: "Email not sent"
```
Cause: RESEND_API_KEY invalide ou domaine non vérifié
Solution:
1. Vérifier la clé API
2. Vérifier le domaine dans Resend
3. Vérifier les DNS records
```

## 📊 Checklist Variables

- [ ] GEMINI_API_KEY obtenue et testée
- [ ] DATABASE_URL obtenue et testée
- [ ] RESEND_API_KEY obtenue et testée
- [ ] .env.local créé localement
- [ ] .env.local dans .gitignore
- [ ] Variables ajoutées dans Vercel Dashboard
- [ ] Toutes les variables marquées comme "Production"
- [ ] Build réussit avec les variables
- [ ] API fonctionne localement
- [ ] Déploiement Vercel réussit

## 🔗 Ressources

- [Google AI Studio](https://aistudio.google.com)
- [Neon Console](https://console.neon.tech)
- [Resend Dashboard](https://resend.com)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 💡 Tips

1. **Backup des clés**: Garder une copie sécurisée
2. **Rotation régulière**: Changer les clés tous les 3-6 mois
3. **Monitoring**: Vérifier les logs pour les erreurs d'authentification
4. **Testing**: Toujours tester localement avant de déployer
