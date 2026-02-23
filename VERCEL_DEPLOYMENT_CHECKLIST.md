# ✅ Checklist Complète - Déploiement Vercel

## 🎯 Objectif
Déployer l'application sur Vercel avec toutes les configurations de sécurité et les variables d'environnement nécessaires.

---

## 📋 PHASE 1 : Préparation Locale (À faire AVANT de pousser sur GitHub)

### 1.1 Vérifier la Configuration Locale
- [ ] Exécuter `npm run pre-deploy` pour vérifier tous les fichiers
- [ ] Vérifier que `.env.local` contient les bonnes valeurs (pas de PLACEHOLDER)
- [ ] Vérifier que `package.json` a tous les scripts nécessaires
- [ ] Vérifier que `vercel.json` est correctement configuré

### 1.2 Générer les Clés de Sécurité
Générer des clés sécurisées pour la production :

```bash
# Générer ADMIN_API_KEY
openssl rand -hex 32

# Générer INTERNAL_API_KEY
openssl rand -hex 32

# Générer ENCRYPTION_KEY
openssl rand -hex 32
```

Sauvegarder ces clés dans un endroit sûr (gestionnaire de mots de passe).

### 1.3 Préparer les Variables d'Environnement
Créer `.env.production` avec les vraies valeurs :

```env
# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# API Keys
GEMINI_API_KEY=votre-clé-gemini
RESEND_API_KEY=re_votre-clé-resend
ADMIN_EMAIL=admin@votredomaine.com
RESEND_EMAIL_FROM=noreply@votredomaine.com

# Security Keys (générées ci-dessus)
ADMIN_API_KEY=votre-clé-admin-générée
INTERNAL_API_KEY=votre-clé-interne-générée
ENCRYPTION_KEY=votre-clé-chiffrement-générée

# Node Environment
NODE_ENV=production
```

### 1.4 Tester Localement
```bash
# Installer les dépendances
npm install

# Construire l'application
npm run build

# Tester le serveur
npm run server
```

### 1.5 Vérifier la Base de Données
```bash
# Exécuter les migrations localement
DATABASE_URL="votre-url-neon" npm run db:migrate

# Vérifier la connexion
psql $DATABASE_URL -c "SELECT 1"
```

---

## 🔐 PHASE 2 : Configuration Neon (Base de Données)

### 2.1 Créer une Base de Données Neon
1. Aller sur https://console.neon.tech
2. Créer un nouveau projet
3. Copier la connection string
4. Vérifier que `sslmode=require` est présent

### 2.2 Exécuter les Migrations
```bash
# Utiliser la connection string Neon
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require" npm run db:migrate
```

### 2.3 Vérifier les Tables
```bash
psql $DATABASE_URL -c "\dt"
```

Vérifier que les tables suivantes existent :
- [ ] `products`
- [ ] `orders`
- [ ] `order_items`
- [ ] `email_logs`
- [ ] `pwa_settings`

---

## 📧 PHASE 3 : Configuration Email (Resend)

### 3.1 Créer un Compte Resend
1. Aller sur https://resend.com
2. S'inscrire et créer un compte
3. Aller à API Keys et copier la clé

### 3.2 Vérifier le Domaine Email
1. Dans Resend, aller à "Domains"
2. Ajouter votre domaine ou utiliser `onboarding@resend.dev` pour tester
3. Vérifier les enregistrements DNS si c'est un domaine personnalisé

### 3.3 Tester l'Email Localement
```bash
npm run test:email
```

---

## 🤖 PHASE 4 : Configuration Gemini API

### 4.1 Créer une Clé Gemini
1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Créer une nouvelle clé
4. Copier la clé

### 4.2 Tester Localement
```bash
# Vérifier que GEMINI_API_KEY est défini
echo $GEMINI_API_KEY
```

---

## 🚀 PHASE 5 : Déploiement sur Vercel

### 5.1 Connecter le Repository GitHub
1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository GitHub
4. Cliquer sur "Import"

### 5.2 Configurer les Variables d'Environnement
1. Dans Vercel, aller à "Settings" → "Environment Variables"
2. Ajouter toutes les variables de `.env.production` :

**Variables Requises :**
- [ ] `DATABASE_URL` - Connection string Neon
- [ ] `GEMINI_API_KEY` - Clé Gemini
- [ ] `RESEND_API_KEY` - Clé Resend
- [ ] `ADMIN_EMAIL` - Email admin
- [ ] `RESEND_EMAIL_FROM` - Email d'envoi
- [ ] `ADMIN_API_KEY` - Clé admin générée
- [ ] `INTERNAL_API_KEY` - Clé interne générée
- [ ] `ENCRYPTION_KEY` - Clé de chiffrement générée
- [ ] `NODE_ENV` - `production`

**Variables Optionnelles (Sécurité) :**
- [ ] `IP_WHITELIST_ENABLED` - `false` (par défaut)
- [ ] `RATE_LIMIT_WINDOW_MS` - `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` - `100`

### 5.3 Configurer les Paramètres de Build
1. Vérifier que "Build Command" est : `npm run build`
2. Vérifier que "Output Directory" est : `dist`
3. Vérifier que "Install Command" est : `npm install`

### 5.4 Déployer
1. Cliquer sur "Deploy"
2. Attendre que le déploiement se termine
3. Vérifier que le déploiement est réussi

---

## ✅ PHASE 6 : Vérification Post-Déploiement

### 6.1 Vérifier le Health Check
```bash
curl https://votre-app.vercel.app/health
# Devrait retourner: { "status": "ok" }
```

### 6.2 Vérifier les Produits
```bash
curl https://votre-app.vercel.app/api/products
# Devrait retourner un array de produits
```

### 6.3 Vérifier les Headers de Sécurité
```bash
curl -i https://votre-app.vercel.app/
# Vérifier les headers :
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - X-XSS-Protection: 1; mode=block
```

### 6.4 Tester la Création de Commande
```bash
curl -X POST https://votre-app.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'
```

### 6.5 Vérifier les Logs
1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Vérifier les logs pour les erreurs

### 6.6 Tester le Panneau Admin
1. Naviguer vers `https://votre-app.vercel.app/admin`
2. Se connecter avec les identifiants admin
3. Vérifier que toutes les fonctionnalités marchent

---

## 🔧 PHASE 7 : Configuration Avancée (Optionnel)

### 7.1 Configurer un Domaine Personnalisé
1. Dans Vercel, aller à "Settings" → "Domains"
2. Ajouter votre domaine
3. Suivre les instructions pour configurer les DNS

### 7.2 Configurer les Redirections
1. Vérifier que `vercel.json` a les bonnes routes
2. Tester les redirections

### 7.3 Configurer le Cache
1. Vérifier que les headers de cache sont corrects dans `vercel.json`
2. Tester le cache avec les outils de développement

### 7.4 Configurer les Alertes
1. Dans Vercel, aller à "Settings" → "Alerts"
2. Configurer les alertes pour les erreurs
3. Configurer les alertes pour les déploiements

---

## 🚨 PHASE 8 : Dépannage

### Problème : Build échoue
**Solution :**
1. Vérifier les logs de build dans Vercel
2. Vérifier que tous les fichiers sont présents
3. Vérifier que `package.json` a tous les scripts
4. Exécuter `npm run build` localement pour tester

### Problème : Erreur de base de données
**Solution :**
1. Vérifier que `DATABASE_URL` est correct
2. Vérifier que la base de données Neon est en ligne
3. Vérifier que les migrations ont été exécutées
4. Vérifier les logs Neon

### Problème : Email ne s'envoie pas
**Solution :**
1. Vérifier que `RESEND_API_KEY` est correct
2. Vérifier que `RESEND_EMAIL_FROM` est autorisé dans Resend
3. Vérifier les logs email : `curl https://votre-app.vercel.app/api/test/email-logs`
4. Vérifier les logs Resend

### Problème : Erreur 500 sur les API
**Solution :**
1. Vérifier les logs Vercel
2. Vérifier que toutes les variables d'environnement sont définies
3. Vérifier que la base de données est accessible
4. Vérifier les erreurs de sécurité (CSRF, rate limiting, etc.)

---

## 📊 PHASE 9 : Monitoring et Maintenance

### 9.1 Configurer le Monitoring
- [ ] Activer Vercel Analytics
- [ ] Configurer les alertes d'erreur
- [ ] Configurer les alertes de performance

### 9.2 Vérifier Régulièrement
- [ ] Vérifier les logs d'erreur
- [ ] Vérifier les performances
- [ ] Vérifier les taux de conversion
- [ ] Vérifier les emails envoyés

### 9.3 Mettre à Jour les Dépendances
```bash
npm audit
npm update
```

### 9.4 Sauvegarder les Données
- [ ] Configurer les sauvegardes Neon
- [ ] Tester les restaurations
- [ ] Documenter la procédure de récupération

---

## 🎉 Déploiement Réussi !

Une fois que toutes les phases sont complètes :

1. ✅ L'application est en ligne sur Vercel
2. ✅ La base de données est configurée et accessible
3. ✅ Les emails s'envoient correctement
4. ✅ L'API Gemini fonctionne
5. ✅ La sécurité est configurée
6. ✅ Le monitoring est actif

**Prochaines étapes :**
- Promouvoir l'application
- Configurer les analytics
- Mettre en place le support client
- Planifier les mises à jour futures

---

## 📞 Support

Pour toute question :
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Resend Docs: https://resend.com/docs
- Gemini Docs: https://ai.google.dev/docs

