# 🎯 ACTIONS IMMÉDIATES - DÉPLOIEMENT VERCEL

**Durée Totale**: 2-3 heures  
**Difficulté**: Facile  
**Priorité**: 🔴 HAUTE

---

## ⏱️ TIMELINE

```
Jour 1 (Aujourd'hui):
├─ 30 min: Générer les clés
├─ 30 min: Créer .env.production
├─ 1h: Configurer Neon
├─ 30 min: Tester localement
└─ 30 min: Pousser sur GitHub

Jour 2 (Demain):
├─ 30 min: Créer projet Vercel
├─ 30 min: Ajouter variables
├─ 30 min: Déployer
└─ 1h: Tester en production
```

---

## 🔑 ACTION 1: GÉNÉRER LES CLÉS DE SÉCURITÉ (5 min)

### Étape 1.1: Ouvrir un terminal

```bash
# Aller à la racine du projet
cd votre-projet
```

### Étape 1.2: Générer les clés

```bash
# Générer ADMIN_API_KEY
echo "ADMIN_API_KEY=$(openssl rand -hex 32)"

# Générer INTERNAL_API_KEY
echo "INTERNAL_API_KEY=$(openssl rand -hex 32)"

# Générer ENCRYPTION_KEY
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

### Étape 1.3: Sauvegarder les clés

**Copier les clés générées dans un gestionnaire de mots de passe** (1Password, Bitwarden, etc.)

Exemple de résultat:
```
ADMIN_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
INTERNAL_API_KEY=f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
ENCRYPTION_KEY=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
```

---

## 📝 ACTION 2: CRÉER .env.production (10 min)

### Étape 2.1: Créer le fichier

```bash
# Créer le fichier .env.production
cat > .env.production << 'EOF'
# Database (À remplir avec votre URL Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# API Keys (À remplir avec vos vraies clés)
GEMINI_API_KEY=votre-clé-gemini-ici
RESEND_API_KEY=re_votre-clé-resend-ici
ADMIN_EMAIL=admin@votredomaine.com
RESEND_EMAIL_FROM=noreply@votredomaine.com

# Security Keys (Utiliser les clés générées ci-dessus)
ADMIN_API_KEY=votre-clé-admin-générée
INTERNAL_API_KEY=votre-clé-interne-générée
ENCRYPTION_KEY=votre-clé-chiffrement-générée

# Environment
NODE_ENV=production
EOF
```

### Étape 2.2: Remplir les valeurs

Ouvrir `.env.production` et remplacer:

```env
# ❌ AVANT
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
GEMINI_API_KEY=votre-clé-gemini-ici
RESEND_API_KEY=re_votre-clé-resend-ici

# ✅ APRÈS
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=AIzaSyDxxx...
RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
```

### Étape 2.3: Vérifier le fichier

```bash
# Vérifier que le fichier a été créé
cat .env.production

# Vérifier qu'il n'y a pas de PLACEHOLDER
grep PLACEHOLDER .env.production
# Ne devrait rien retourner
```

---

## 🗄️ ACTION 3: CONFIGURER NEON (30 min)

### Étape 3.1: Créer une base de données Neon

1. Aller sur https://console.neon.tech
2. Cliquer sur "New Project"
3. Donner un nom: `boutique-production`
4. Sélectionner la région: `US East` (ou votre région)
5. Cliquer sur "Create Project"

### Étape 3.2: Copier la connection string

1. Dans le dashboard Neon, aller à "Connection strings"
2. Copier la connection string (elle ressemble à):
   ```
   postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```
3. Remplacer dans `.env.production`:
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

### Étape 3.3: Exécuter les migrations

```bash
# Exécuter les migrations
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" npm run db:migrate

# Résultat attendu:
# ✅ Migrations completed
```

### Étape 3.4: Vérifier les tables

```bash
# Vérifier que les tables existent
psql "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" -c "\dt"

# Résultat attendu:
# public | products
# public | orders
# public | order_items
# public | email_logs
# public | pwa_settings
```

---

## 📧 ACTION 4: CONFIGURER RESEND (10 min)

### Étape 4.1: Créer un compte Resend

1. Aller sur https://resend.com
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email

### Étape 4.2: Obtenir la clé API

1. Dans le dashboard Resend, aller à "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (elle commence par `re_`)
4. Remplacer dans `.env.production`:
   ```env
   RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
   ```

### Étape 4.3: Configurer le domaine email

**Option A: Utiliser le domaine de test (Rapide)**
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

## 🤖 ACTION 5: CONFIGURER GEMINI (5 min)

### Étape 5.1: Créer une clé Gemini

1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Cliquer sur "Create API Key"
4. Copier la clé
5. Remplacer dans `.env.production`:
   ```env
   GEMINI_API_KEY=AIzaSyDxxx...
   ```

---

## 🧪 ACTION 6: TESTER LOCALEMENT (30 min)

### Étape 6.1: Installer les dépendances

```bash
npm install
```

### Étape 6.2: Construire l'application

```bash
npm run build

# Résultat attendu:
# ✅ dist/ folder created
```

### Étape 6.3: Tester le serveur

```bash
# Terminal 1: Démarrer le serveur
npm run server

# Terminal 2: Tester les endpoints
curl http://localhost:5000/health
# Résultat attendu: { "status": "ok" }

curl http://localhost:5000/api/products
# Résultat attendu: [{ "id": "1", "name": "Product", ... }, ...]
```

### Étape 6.4: Tester la création de commande

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

## 📤 ACTION 7: POUSSER SUR GITHUB (5 min)

### Étape 7.1: Ajouter les fichiers

```bash
git add .
```

### Étape 7.2: Commiter

```bash
git commit -m "Préparation pour déploiement Vercel"
```

### Étape 7.3: Pousser

```bash
git push origin main
```

---

## 🚀 ACTION 8: CRÉER LE PROJET VERCEL (30 min)

### Étape 8.1: Aller sur Vercel

1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository GitHub
4. Cliquer sur "Import"

### Étape 8.2: Ajouter les variables d'environnement

1. Dans Vercel, aller à "Settings" → "Environment Variables"
2. Ajouter chaque variable:

```
DATABASE_URL = postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
GEMINI_API_KEY = AIzaSyDxxx...
RESEND_API_KEY = re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
ADMIN_EMAIL = admin@votredomaine.com
RESEND_EMAIL_FROM = noreply@votredomaine.com
ADMIN_API_KEY = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
INTERNAL_API_KEY = f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
ENCRYPTION_KEY = z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
NODE_ENV = production
```

**Pour chaque variable**:
- Coller la valeur
- Sélectionner "Production, Preview, Development"
- Cliquer sur "Save"

### Étape 8.3: Vérifier les paramètres de build

1. Vérifier que "Build Command" est : `npm run build`
2. Vérifier que "Output Directory" est : `dist`
3. Vérifier que "Install Command" est : `npm install`

### Étape 8.4: Déployer

1. Cliquer sur "Deploy"
2. Attendre que le déploiement se termine (2-5 minutes)
3. Vérifier que le déploiement est réussi

---

## ✅ ACTION 9: VÉRIFIER LE DÉPLOIEMENT (30 min)

### Étape 9.1: Obtenir l'URL

1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Copier l'URL (ex: `https://votre-app.vercel.app`)

### Étape 9.2: Tester les endpoints

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

### Étape 9.3: Vérifier les logs

1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Aller à "Logs"
4. Vérifier qu'il n'y a pas d'erreurs

---

## 🎯 CHECKLIST FINALE

### Avant le Déploiement
- [ ] Clés de sécurité générées
- [ ] `.env.production` créé avec les vraies valeurs
- [ ] Base Neon créée et migrations exécutées
- [ ] Resend configuré
- [ ] Gemini configuré
- [ ] Build local réussi
- [ ] Tests locaux réussis
- [ ] Poussé sur GitHub

### Après le Déploiement
- [ ] Projet Vercel créé
- [ ] Variables d'environnement ajoutées
- [ ] Déploiement réussi
- [ ] Health check fonctionne
- [ ] API produits fonctionne
- [ ] Création de commande fonctionne
- [ ] Headers de sécurité présents
- [ ] Logs sans erreurs

---

## 🆘 DÉPANNAGE RAPIDE

### Erreur: "Build failed"
```bash
# Tester localement
npm run build

# Vérifier les erreurs
npm run pre-deploy
```

### Erreur: "Database connection failed"
```bash
# Vérifier la connection string
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL -c "SELECT 1"
```

### Erreur: "Email not sending"
```bash
# Vérifier les logs
curl https://votre-app.vercel.app/api/test/email-logs

# Vérifier les variables
echo $RESEND_API_KEY
echo $RESEND_EMAIL_FROM
```

### Erreur: "500 Internal Server Error"
1. Vérifier les logs Vercel
2. Vérifier que toutes les variables d'environnement sont définies
3. Vérifier que la base de données est accessible

---

## 📞 SUPPORT

- Vercel: https://vercel.com/support
- Neon: https://neon.tech/docs
- Resend: https://resend.com/docs
- Gemini: https://ai.google.dev/docs

---

## 🎉 RÉSUMÉ

Vous avez maintenant un plan d'action clair pour déployer votre application sur Vercel en **2-3 heures**.

**Commencez par l'Action 1** (générer les clés) et suivez les étapes dans l'ordre.

**Bonne chance !** 🚀

---

*Dernière mise à jour: 23 février 2026*
