# 🚀 QUICK START - DÉPLOIEMENT VERCEL

**Durée totale**: 3-4 heures  
**Difficulté**: Facile  
**Status**: ✅ Clés générées, prêt à continuer

---

## 📊 RÉSUMÉ

✅ **Étape 1 COMPLÉTÉE**: Clés générées et `.env.production` créé

⏳ **Étapes 2-11 À FAIRE**: Configurer les services et déployer

---

## 🎯 ÉTAPE 2: CONFIGURER NEON (30 min)

### 2.1 Créer une base de données

```
1. Aller sur https://console.neon.tech
2. Cliquer sur "New Project"
3. Nom: boutique-production
4. Région: US East
5. Cliquer sur "Create Project"
```

### 2.2 Copier la connection string

```
1. Dashboard Neon → "Connection strings"
2. Copier la connection string
3. Ouvrir .env.production
4. Remplacer DATABASE_URL
```

### 2.3 Exécuter les migrations

```bash
# Remplacer par votre URL Neon
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" npm run db:migrate
```

### 2.4 Vérifier les tables

```bash
psql "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" -c "\dt"
```

---

## 🎯 ÉTAPE 3: CONFIGURER RESEND (10 min)

### 3.1 Créer un compte

```
1. Aller sur https://resend.com
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email
```

### 3.2 Obtenir la clé API

```
1. Dashboard Resend → "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (commence par re_)
4. Ouvrir .env.production
5. Remplacer RESEND_API_KEY
```

### 3.3 Configurer le domaine email

**Option A: Rapide (Recommandé)**
```env
RESEND_EMAIL_FROM=onboarding@resend.dev
```

**Option B: Production**
```
1. Resend → "Domains"
2. "Add Domain"
3. Entrer votre domaine
4. Configurer les DNS
5. Vérifier le domaine
6. Utiliser dans .env.production
```

---

## 🎯 ÉTAPE 4: REMPLIR .env.production (5 min)

Ouvrir `.env.production` et remplacer:

```env
# De Neon
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require

# De Resend
RESEND_API_KEY=re_votre_clé_ici

# Vos valeurs
ADMIN_EMAIL=votre-email@example.com
RESEND_EMAIL_FROM=onboarding@resend.dev
```

---

## 🎯 ÉTAPE 6: TESTER LOCALEMENT (30 min)

### 6.1 Installer et construire

```bash
npm install
npm run build
```

### 6.2 Tester le serveur

```bash
# Terminal 1
npm run server

# Terminal 2
curl http://localhost:5000/health
# Résultat: { "status": "ok" }

curl http://localhost:5000/api/products
# Résultat: [{ "id": "1", ... }, ...]
```

### 6.3 Tester la création de commande

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'
```

---

## 🎯 ÉTAPE 7: POUSSER SUR GITHUB (5 min)

```bash
git add .
git commit -m "Préparation déploiement Vercel"
git push origin main
```

---

## 🎯 ÉTAPE 8: CRÉER PROJET VERCEL (30 min)

### 8.1 Importer le repository

```
1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository
4. Cliquer sur "Import"
```

### 8.2 Vérifier les paramètres

```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## 🎯 ÉTAPE 9: AJOUTER VARIABLES À VERCEL (30 min)

### 9.1 Aller à Settings → Environment Variables

Ajouter ces 8 variables:

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

---

## 🎯 ÉTAPE 10: DÉPLOYER (30 min)

### 10.1 Cliquer sur "Deploy"

```
1. Cliquer sur "Deploy"
2. Attendre 2-5 minutes
3. Vérifier que c'est réussi
```

---

## 🎯 ÉTAPE 11: TESTER EN PRODUCTION (30 min)

### 11.1 Obtenir l'URL

```
1. Vercel → "Deployments"
2. Cliquer sur le dernier déploiement
3. Copier l'URL (ex: https://votre-app.vercel.app)
```

### 11.2 Tester les endpoints

```bash
VERCEL_URL="https://votre-app.vercel.app"

# Test 1: Health
curl $VERCEL_URL/health
# Résultat: { "status": "ok" }

# Test 2: Produits
curl $VERCEL_URL/api/products
# Résultat: [{ "id": "1", ... }, ...]

# Test 3: Sécurité
curl -i $VERCEL_URL/
# Vérifier les headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block

# Test 4: Commande
curl -X POST $VERCEL_URL/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'
```

### 11.3 Vérifier les logs

```
1. Vercel → "Deployments"
2. Cliquer sur le dernier déploiement
3. Aller à "Logs"
4. Vérifier qu'il n'y a pas d'erreurs
```

---

## ✅ CHECKLIST RAPIDE

- [ ] Neon production créé
- [ ] Migrations exécutées
- [ ] Resend configuré
- [ ] .env.production rempli
- [ ] Build local réussi
- [ ] Tests locaux réussis
- [ ] Poussé sur GitHub
- [ ] Projet Vercel créé
- [ ] Variables ajoutées
- [ ] Déploiement réussi
- [ ] Tests production réussis

---

## 🔑 CLÉS À UTILISER

```
ADMIN_API_KEY=5a98b5f6c4e591f4fad284931ccd22c647814243eb31bea101556baca2011f01
INTERNAL_API_KEY=dedda7763228faac013e1dbc0ee4b6caac8db2d115c46e16d927757a99eb8170
ENCRYPTION_KEY=5bf6f712a4ff1727e4eeb240e7c9b72be694cf58e163f13345dd9d37577f3b64
```

---

## 🚀 COMMENCEZ MAINTENANT

1. Lire cette page
2. Créer une base Neon
3. Configurer Resend
4. Configurer Gemini
5. Remplir .env.production
6. Tester localement
7. Pousser sur GitHub
8. Créer projet Vercel
9. Ajouter variables
10. Déployer
11. Tester en production

**Durée totale: 3-4 heures**

---

*Dernière mise à jour: 23 février 2026*
