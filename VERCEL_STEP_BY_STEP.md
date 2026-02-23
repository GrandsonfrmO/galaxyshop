# 🚀 Guide Étape par Étape - Déploiement Vercel

## 📌 Vue d'ensemble
Ce guide vous accompagne à travers chaque étape du déploiement sur Vercel, de la préparation locale à la vérification post-déploiement.

---

## ⏱️ Temps estimé : 30-45 minutes

---

## ÉTAPE 1 : Préparation Locale (5 minutes)

### 1.1 Vérifier les Fichiers Essentiels
```bash
# Aller à la racine du projet
cd votre-projet

# Vérifier que tous les fichiers existent
ls -la | grep -E "package.json|vercel.json|server.ts|index.html"
```

### 1.2 Exécuter la Vérification Pré-Déploiement
```bash
# Exécuter le script de vérification
node scripts/vercel-pre-deploy.mjs
```

**Résultat attendu :**
```
✅ Passed: 25
⚠️  Warnings: 0
❌ Critical: 0
```

Si vous avez des erreurs critiques, les corriger avant de continuer.

---

## ÉTAPE 2 : Générer les Clés de Sécurité (5 minutes)

### 2.1 Générer les Clés
Ouvrir un terminal et exécuter :

```bash
# Générer ADMIN_API_KEY
echo "ADMIN_API_KEY=$(openssl rand -hex 32)"

# Générer INTERNAL_API_KEY
echo "INTERNAL_API_KEY=$(openssl rand -hex 32)"

# Générer ENCRYPTION_KEY
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

### 2.2 Sauvegarder les Clés
Copier les clés générées dans un gestionnaire de mots de passe ou un fichier sécurisé.

**⚠️ IMPORTANT :** Ne jamais commiter ces clés dans Git !

---

## ÉTAPE 3 : Configurer la Base de Données Neon (5 minutes)

### 3.1 Créer un Compte Neon
1. Aller sur https://console.neon.tech
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email

### 3.2 Créer un Projet
1. Cliquer sur "New Project"
2. Donner un nom au projet (ex: "boutique-production")
3. Sélectionner la région (ex: "US East")
4. Cliquer sur "Create Project"

### 3.3 Copier la Connection String
1. Dans le dashboard Neon, aller à "Connection strings"
2. Copier la connection string (elle ressemble à : `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`)
3. Sauvegarder cette URL

### 3.4 Exécuter les Migrations
```bash
# Remplacer par votre URL Neon
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require" npm run db:migrate
```

**Résultat attendu :**
```
✅ Migrations completed
```

### 3.5 Vérifier les Tables
```bash
# Remplacer par votre URL Neon
psql "postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require" -c "\dt"
```

Vérifier que les tables suivantes existent :
- `products`
- `orders`
- `order_items`
- `email_logs`
- `pwa_settings`

---

## ÉTAPE 4 : Configurer Resend (Email) (5 minutes)

### 4.1 Créer un Compte Resend
1. Aller sur https://resend.com
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email

### 4.2 Obtenir la Clé API
1. Dans le dashboard Resend, aller à "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (elle commence par `re_`)
4. Sauvegarder cette clé

### 4.3 Configurer le Domaine Email
**Option A : Utiliser le domaine de test (rapide)**
- Utiliser `onboarding@resend.dev` comme `RESEND_EMAIL_FROM`
- Cela fonctionne immédiatement pour tester

**Option B : Utiliser votre domaine (recommandé pour la production)**
1. Dans Resend, aller à "Domains"
2. Cliquer sur "Add Domain"
3. Entrer votre domaine
4. Suivre les instructions pour configurer les enregistrements DNS
5. Vérifier le domaine

### 4.4 Tester l'Email Localement
```bash
# Ajouter les variables à .env.local
RESEND_API_KEY=re_votre_clé
RESEND_EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=votre-email@example.com

# Tester
npm run test:email
```

---

## ÉTAPE 5 : Configurer Gemini API (3 minutes)

### 5.1 Créer une Clé Gemini
1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Cliquer sur "Create API Key"
4. Copier la clé
5. Sauvegarder cette clé

### 5.2 Vérifier la Clé
```bash
# Ajouter à .env.local
GEMINI_API_KEY=votre_clé_gemini

# Vérifier que la clé est définie
echo $GEMINI_API_KEY
```

---

## ÉTAPE 6 : Préparer le Déploiement (5 minutes)

### 6.1 Créer .env.production
```bash
# Créer le fichier
cat > .env.production << 'EOF'
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# API Keys
GEMINI_API_KEY=votre-clé-gemini
RESEND_API_KEY=re_votre-clé-resend
ADMIN_EMAIL=admin@example.com
RESEND_EMAIL_FROM=onboarding@resend.dev

# Security Keys
ADMIN_API_KEY=votre-clé-admin-générée
INTERNAL_API_KEY=votre-clé-interne-générée
ENCRYPTION_KEY=votre-clé-chiffrement-générée

# Environment
NODE_ENV=production
EOF
```

### 6.2 Tester le Build Localement
```bash
# Construire l'application
npm run build

# Vérifier que le dossier dist a été créé
ls -la dist/
```

### 6.3 Tester le Serveur Localement
```bash
# Démarrer le serveur
npm run server

# Dans un autre terminal, tester
curl http://localhost:5000/health
# Devrait retourner: { "status": "ok" }
```

### 6.4 Pousser sur GitHub
```bash
# Ajouter les fichiers
git add .

# Commiter
git commit -m "Préparation pour déploiement Vercel"

# Pousser
git push origin main
```

---

## ÉTAPE 7 : Déployer sur Vercel (10 minutes)

### 7.1 Connecter le Repository
1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Sélectionner votre repository GitHub
4. Cliquer sur "Import"

### 7.2 Configurer les Variables d'Environnement
1. Dans Vercel, aller à "Settings" → "Environment Variables"
2. Ajouter chaque variable :

```
DATABASE_URL = postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
GEMINI_API_KEY = votre-clé-gemini
RESEND_API_KEY = re_votre-clé-resend
ADMIN_EMAIL = admin@example.com
RESEND_EMAIL_FROM = onboarding@resend.dev
ADMIN_API_KEY = votre-clé-admin-générée
INTERNAL_API_KEY = votre-clé-interne-générée
ENCRYPTION_KEY = votre-clé-chiffrement-générée
NODE_ENV = production
```

**Pour chaque variable :**
- Coller la valeur
- Sélectionner "Production, Preview, Development"
- Cliquer sur "Save"

### 7.3 Vérifier les Paramètres de Build
1. Vérifier que "Build Command" est : `npm run build`
2. Vérifier que "Output Directory" est : `dist`
3. Vérifier que "Install Command" est : `npm install`

### 7.4 Déployer
1. Cliquer sur "Deploy"
2. Attendre que le déploiement se termine (2-5 minutes)
3. Vérifier que le déploiement est réussi

**Résultat attendu :**
```
✅ Deployment successful
```

---

## ÉTAPE 8 : Vérification Post-Déploiement (5 minutes)

### 8.1 Obtenir l'URL de Votre Application
1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Copier l'URL (ex: `https://votre-app.vercel.app`)

### 8.2 Vérifier le Health Check
```bash
# Remplacer par votre URL
curl https://votre-app.vercel.app/health

# Résultat attendu:
# { "status": "ok" }
```

### 8.3 Vérifier les Produits
```bash
curl https://votre-app.vercel.app/api/products

# Résultat attendu:
# [{ "id": "1", "name": "Product", ... }, ...]
```

### 8.4 Vérifier les Headers de Sécurité
```bash
curl -i https://votre-app.vercel.app/

# Vérifier les headers :
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

### 8.5 Tester la Création de Commande
```bash
curl -X POST https://votre-app.vercel.app/api/orders \
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

### 8.6 Vérifier les Logs
1. Dans Vercel, aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Aller à "Logs"
4. Vérifier qu'il n'y a pas d'erreurs

---

## ÉTAPE 9 : Configuration Avancée (Optionnel)

### 9.1 Configurer un Domaine Personnalisé
1. Dans Vercel, aller à "Settings" → "Domains"
2. Cliquer sur "Add Domain"
3. Entrer votre domaine
4. Suivre les instructions pour configurer les DNS

### 9.2 Configurer les Alertes
1. Dans Vercel, aller à "Settings" → "Alerts"
2. Configurer les alertes pour les erreurs
3. Configurer les alertes pour les déploiements

### 9.3 Activer Analytics
1. Dans Vercel, aller à "Analytics"
2. Cliquer sur "Enable"
3. Vérifier les performances

---

## ✅ Déploiement Réussi !

Félicitations ! Votre application est maintenant en ligne sur Vercel.

### Checklist Finale
- [ ] Application accessible sur Vercel
- [ ] Health check fonctionne
- [ ] API produits fonctionne
- [ ] Création de commande fonctionne
- [ ] Emails s'envoient
- [ ] Headers de sécurité présents
- [ ] Logs sans erreurs

### Prochaines Étapes
1. Tester l'application complètement
2. Configurer un domaine personnalisé
3. Mettre en place le monitoring
4. Planifier les mises à jour futures

---

## 🆘 Dépannage Rapide

### Erreur : "Build failed"
```bash
# Tester localement
npm run build

# Vérifier les erreurs
npm run pre-deploy
```

### Erreur : "Database connection failed"
```bash
# Vérifier la connection string
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL -c "SELECT 1"
```

### Erreur : "Email not sending"
```bash
# Vérifier les logs
curl https://votre-app.vercel.app/api/test/email-logs

# Vérifier les variables
echo $RESEND_API_KEY
echo $RESEND_EMAIL_FROM
```

### Erreur : "500 Internal Server Error"
1. Vérifier les logs Vercel
2. Vérifier que toutes les variables d'environnement sont définies
3. Vérifier que la base de données est accessible

---

## 📞 Support

- Vercel: https://vercel.com/support
- Neon: https://neon.tech/docs
- Resend: https://resend.com/docs
- Gemini: https://ai.google.dev/docs

