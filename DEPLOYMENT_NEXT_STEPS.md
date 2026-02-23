# 🚀 PROCHAINES ÉTAPES - DÉPLOIEMENT VERCEL

**Status**: ✅ Clés générées et `.env.production` créé  
**Prochaine étape**: Configurer Neon production

---

## 📋 RÉSUMÉ DE CE QUI A ÉTÉ FAIT

✅ **Clés de sécurité générées** :
- ADMIN_API_KEY: `5a98b5f6c4e591f4fad284931ccd22c647814243eb31bea101556baca2011f01`
- INTERNAL_API_KEY: `dedda7763228faac013e1dbc0ee4b6caac8db2d115c46e16d927757a99eb8170`
- ENCRYPTION_KEY: `5bf6f712a4ff1727e4eeb240e7c9b72be694cf58e163f13345dd9d37577f3b64`

✅ **`.env.production` créé** avec les clés générées

✅ **`.env.production` déjà dans `.gitignore`** (pas de risque de commit)

---

## 🎯 ÉTAPES À FAIRE MAINTENANT

### ÉTAPE 1: CONFIGURER NEON PRODUCTION (30 min)

#### 1.1 Créer une base de données Neon

1. Aller sur https://console.neon.tech
2. Cliquer sur "New Project"
3. Donner un nom: `boutique-production`
4. Sélectionner la région: `US East` (ou votre région)
5. Cliquer sur "Create Project"

#### 1.2 Copier la connection string

1. Dans le dashboard Neon, aller à "Connection strings"
2. Copier la connection string (elle ressemble à):
   ```
   postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```
3. Ouvrir `.env.production` et remplacer:
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

#### 1.3 Exécuter les migrations

```bash
# Remplacer par votre URL Neon
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" npm run db:migrate
```

**Résultat attendu**:
```
✅ Migrations completed
```

#### 1.4 Vérifier les tables

```bash
# Remplacer par votre URL Neon
psql "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" -c "\dt"
```

**Résultat attendu**:
```
public | products
public | orders
public | order_items
public | email_logs
public | pwa_settings
```

---

### ÉTAPE 2: CONFIGURER RESEND (10 min)

#### 2.1 Créer un compte Resend

1. Aller sur https://resend.com
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email

#### 2.2 Obtenir la clé API

1. Dans le dashboard Resend, aller à "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (elle commence par `re_`)
4. Ouvrir `.env.production` et remplacer:
   ```env
   RESEND_API_KEY=re_votre_clé_ici
   ```

#### 2.3 Configurer le domaine email

**Option A: Utiliser le domaine de test (Rapide - Recommandé pour commencer)**
```env
RESEND_EMAIL_FROM=onboarding@resend.dev
```

**Option B: Utiliser votre domaine (Production)**
1. Dans Resend, aller à "Domains"
2. Cliquer sur "Add Domain"
3. Entrer votre domaine
4. Suivre les instructions pour configurer les DNS
5. Vérifier le domaine
6. Utiliser dans `.env.production`:
   ```env
   RESEND_EMAIL_FROM=noreply@votredomaine.com
   ```

---

### ÉTAPE 3: CONFIGURER GEMINI (5 min)

#### 3.1 Créer une clé Gemini

1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Cliquer sur "Create API Key"
4. Copier la clé
5. Ouvrir `.env.production` et remplacer:
   ```env
   GEMINI_API_KEY=AIzaSyDxxx_votre_clé_ici
   ```

---

### ÉTAPE 4: REMPLIR LES VALEURS RESTANTES (5 min)

Ouvrir `.env.production` et remplacer:

```env
# ❌ AVANT
ADMIN_EMAIL=admin@votredomaine.com
RESEND_EMAIL_FROM=noreply@votredomaine.com

# ✅ APRÈS
ADMIN_EMAIL=votre-email@example.com
RESEND_EMAIL_FROM=onboarding@resend.dev  # ou votre domaine
```

---

### ÉTAPE 5: TESTER LOCALEMENT (30 min)

#### 5.1 Installer les dépendances

```bash
npm install
```

#### 5.2 Construire l'application

```bash
npm run build
```

**Résultat attendu**:
```
✅ dist/ folder created
```

#### 5.3 Tester le serveur

```bash
# Terminal 1: Démarrer le serveur
npm run server

# Terminal 2: Tester les endpoints
curl http://localhost:5000/health
# Résultat attendu: { "status": "ok" }

curl http://localhost:5000/api/products
# Résultat attendu: [{ "id": "1", "name": "Product", ... }, ...]
```

#### 5.4 Tester la création de commande

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'

# Résultat attendu:
# { "success": true, "order": { "id": "...", ... } }
```

---

### ÉTAPE 6: POUSSER SUR GITHUB (5 min)

#### 6.1 Ajouter les fichiers

```bash
git add .
```

#### 6.2 Commiter

```bash
git commit -m "Préparation pour déploiement Vercel - Clés générées et .env.production créé"
```

#### 6.3 Pousser

```bash
git push origin main
```

---

### ÉTAPE 7: CRÉER LE PROJET VERCEL (30 min)

#### 7.1 Aller sur Vercel

1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository GitHub
4. Cliquer sur "Import"

#### 7.2 Ajouter les variables d'environnement

1. Dans Vercel, aller à "Settings" → "Environment Variables"
2. Ajouter chaque variable:

```
DATABASE_URL = postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
RESEND_API_KEY = re_votre_clé_ici
ADMIN_EMAIL = votre-email@example.com
RESEND_EMAIL_FROM = onboarding@resend.dev
ADMIN_API_KEY = 5a98b5f6c4e591f4fad284931ccd22c647814243eb31bea101556baca2011f01
INTERNAL_API_KEY = dedda7763228faac013e1dbc0ee4b6caac8db2d115c46e16d927757a99eb8170
ENCRYPTION_KEY = 5bf6f712a4ff1727e4eeb240e7c9b72be694cf58e163f13345dd9d37577f3b64
NODE_ENV = production
```

**Pour chaque variable**:
- Coller la valeur
- Sélectionner "Production, Preview, Development"
- Cliquer sur "Save"

#### 7.3 Vérifier les paramètres de build

1. Vérifier que "Build Command" est : `npm run build`
2. Vérifier que "Output Directory" est : `dist`
3. Vérifier que "Install Command" est : `npm install`

#### 7.4 Déployer

1. Cliquer sur "Deploy"
2. Attendre que le déploiement se termine (2-5 minutes)
3. Vérifier que le déploiement est réussi

---

### ÉTAPE 8: TESTER EN PRODUCTION (30 min)

#### 8.1 Obtenir l'URL

1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Copier l'URL (ex: `https://votre-app.vercel.app`)

#### 8.2 Tester les endpoints

```bash
# Remplacer par votre URL Vercel
VERCEL_URL="https://votre-app.vercel.app"

# Test 1: Health check
curl $VERCEL_URL/health
# Résultat attendu: { "status": "ok" }

# Test 2: Produits
curl $VERCEL_URL/api/products
# Résultat attendu: [{ "id": "1", "name": "Product", ... }, ...]

# Test 3: Headers de sécurité
curl -i $VERCEL_URL/
# Vérifier les headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block

# Test 4: Création de commande
curl -X POST $VERCEL_URL/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'
# Résultat attendu: { "success": true, "order": { "id": "...", ... } }
```

#### 8.3 Vérifier les logs

1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Aller à "Logs"
4. Vérifier qu'il n'y a pas d'erreurs

---

## ✅ CHECKLIST FINALE

- [ ] Neon production créé
- [ ] Migrations exécutées
- [ ] Resend configuré
- [ ] `.env.production` rempli complètement
- [ ] Build local réussi
- [ ] Tests locaux réussis
- [ ] Poussé sur GitHub
- [ ] Projet Vercel créé
- [ ] Variables ajoutées à Vercel
- [ ] Déploiement réussi
- [ ] Tests en production réussis

---

## 🎯 TEMPS ESTIMÉ

```
Neon: 30 min
Resend: 10 min
Remplir valeurs: 5 min
Tester localement: 30 min
Pousser GitHub: 5 min
Créer Vercel: 30 min
Ajouter variables: 30 min
Déployer: 30 min
Tester production: 30 min
─────────────────
TOTAL: 3-4 heures
```

---

## 🚀 COMMENCEZ PAR

1. **Créer une base Neon production** (https://console.neon.tech)
2. **Copier la connection string** et ajouter à `.env.production`
3. **Exécuter les migrations** : `DATABASE_URL="..." npm run db:migrate`
4. **Configurer Resend** (https://resend.com)
5. **Tester localement** : `npm run build && npm run server`
6. **Pousser sur GitHub** : `git push origin main`
7. **Créer projet Vercel** (https://vercel.com/new)
8. **Ajouter variables** dans Vercel
9. **Déployer** et tester

---

*Dernière mise à jour: 23 février 2026*
