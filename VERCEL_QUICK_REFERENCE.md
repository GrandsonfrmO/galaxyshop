# ⚡ Référence Rapide - Déploiement Vercel

## 🎯 Commandes Essentielles

### Vérification Pré-Déploiement
```bash
# Vérifier tous les fichiers et configurations
node scripts/vercel-pre-deploy.mjs

# Construire l'application
npm run build

# Tester le serveur localement
npm run server
```

### Génération des Clés de Sécurité
```bash
# Générer ADMIN_API_KEY
openssl rand -hex 32

# Générer INTERNAL_API_KEY
openssl rand -hex 32

# Générer ENCRYPTION_KEY
openssl rand -hex 32
```

### Configuration de la Base de Données
```bash
# Exécuter les migrations
DATABASE_URL="votre-url-neon" npm run db:migrate

# Vérifier la connexion
psql $DATABASE_URL -c "SELECT 1"

# Lister les tables
psql $DATABASE_URL -c "\dt"
```

### Test des API
```bash
# Health check
curl https://votre-app.vercel.app/health

# Lister les produits
curl https://votre-app.vercel.app/api/products

# Créer une commande
curl -X POST https://votre-app.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'

# Vérifier les logs email
curl https://votre-app.vercel.app/api/test/email-logs
```

### Vérification des Headers de Sécurité
```bash
# Vérifier les headers
curl -i https://votre-app.vercel.app/

# Vérifier les headers spécifiques
curl -i https://votre-app.vercel.app/ | grep -E "X-Content-Type-Options|X-Frame-Options|X-XSS-Protection"
```

---

## 📋 Checklist Rapide

### Avant le Déploiement
- [ ] `npm run pre-deploy` réussi
- [ ] `npm run build` réussi
- [ ] `.env.production` créé avec les vraies valeurs
- [ ] Clés de sécurité générées
- [ ] Base de données Neon créée
- [ ] Migrations exécutées
- [ ] Resend configuré
- [ ] Gemini API configuré
- [ ] Fichiers poussés sur GitHub

### Pendant le Déploiement
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Paramètres de build vérifiés
- [ ] Déploiement lancé
- [ ] Déploiement réussi

### Après le Déploiement
- [ ] Health check fonctionne
- [ ] API produits fonctionne
- [ ] Création de commande fonctionne
- [ ] Emails s'envoient
- [ ] Headers de sécurité présents
- [ ] Logs sans erreurs

---

## 🔐 Variables d'Environnement Essentielles

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# API Keys
GEMINI_API_KEY=AIzaSyD...
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@example.com
RESEND_EMAIL_FROM=noreply@example.com

# Security
ADMIN_API_KEY=<32 hex chars>
INTERNAL_API_KEY=<32 hex chars>
ENCRYPTION_KEY=<32 hex chars>

# Environment
NODE_ENV=production
```

---

## 🚀 Déploiement en 5 Étapes

### 1. Préparer Localement
```bash
node scripts/vercel-pre-deploy.mjs
npm run build
npm run server
```

### 2. Configurer la Base de Données
```bash
# Créer sur Neon
# Copier la connection string
# Exécuter les migrations
DATABASE_URL="..." npm run db:migrate
```

### 3. Configurer les Services
- Resend : Obtenir la clé API
- Gemini : Obtenir la clé API
- Générer les clés de sécurité

### 4. Déployer sur Vercel
- Connecter le repository GitHub
- Ajouter les variables d'environnement
- Cliquer sur "Deploy"

### 5. Vérifier
```bash
curl https://votre-app.vercel.app/health
curl https://votre-app.vercel.app/api/products
```

---

## 🆘 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Build échoue | `npm run build` localement, vérifier les erreurs |
| DB connection failed | Vérifier `DATABASE_URL`, tester avec `psql` |
| Email not sending | Vérifier `RESEND_API_KEY`, vérifier les logs |
| 500 error | Vérifier les logs Vercel, vérifier les variables |
| Headers manquants | Vérifier `vercel.json`, redéployer |

---

## 📚 Documentation Complète

- **Checklist Complète** : `VERCEL_DEPLOYMENT_CHECKLIST.md`
- **Guide Étape par Étape** : `VERCEL_STEP_BY_STEP.md`
- **Configuration Env** : `VERCEL_ENV_SETUP.md`
- **Guide Original** : `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 🔗 Liens Utiles

- Vercel: https://vercel.com
- Neon: https://console.neon.tech
- Resend: https://resend.com
- Gemini: https://ai.google.dev/

---

## ⏱️ Temps Estimé

- Préparation locale : 5 min
- Configuration services : 10 min
- Déploiement Vercel : 5 min
- Vérification : 5 min
- **Total : 25 minutes**

---

## 💡 Tips

1. **Générer les clés une seule fois** - Les sauvegarder dans un gestionnaire de mots de passe
2. **Tester localement d'abord** - Évite les surprises en production
3. **Vérifier les logs** - Toujours vérifier les logs après le déploiement
4. **Monitorer** - Configurer les alertes dans Vercel
5. **Documenter** - Garder une trace des configurations

---

## ✅ Déploiement Réussi !

Une fois que tout fonctionne :
1. Partager l'URL avec les utilisateurs
2. Configurer un domaine personnalisé
3. Mettre en place le monitoring
4. Planifier les mises à jour futures

