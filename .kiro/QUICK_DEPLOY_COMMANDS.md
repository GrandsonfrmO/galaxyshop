# ⚡ Commandes Rapides Déploiement

## 🚀 Déployer en 5 Étapes

### 1. Vérifier Localement
```bash
npx tsx verify-deployment.ts
```

### 2. Compiler
```bash
npm run build
```

### 3. Pousser sur GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4. Créer un Compte Vercel
```
https://vercel.com
→ Sign up with GitHub
→ Authorize Vercel
```

### 5. Importer et Déployer
```
https://vercel.com/new
→ Select your repository
→ Add Environment Variables:
   - GEMINI_API_KEY
   - DATABASE_URL
   - RESEND_API_KEY
→ Click Deploy
```

## 📋 Commandes Utiles

### Vérification
```bash
# Vérifier le build
npm run build

# Vérifier les erreurs TypeScript
npm run build

# Vérifier Git
git status

# Vérifier les variables
cat .env.local
```

### Développement
```bash
# Démarrer le serveur complet
npm run dev:full

# Juste le frontend
npm run dev

# Juste l'API
npm run server

# Tester l'API
curl http://localhost:5000/health
curl http://localhost:5000/api/products
```

### Base de Données
```bash
# Exécuter les migrations
npm run migrate

# Vérifier les migrations
npm run migrate:check
```

### Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Voir les logs
vercel logs --follow

# Voir les logs d'une fonction
vercel logs --follow --function=server

# Déployer depuis CLI
vercel

# Déployer en production
vercel --prod
```

## 🔑 Obtenir les Clés API

### GEMINI_API_KEY
```bash
# 1. Aller sur https://aistudio.google.com/app/apikeys
# 2. Cliquer "Create API Key"
# 3. Copier la clé
# 4. Ajouter dans Vercel Dashboard
```

### DATABASE_URL
```bash
# 1. Aller sur https://console.neon.tech
# 2. Créer une base de données
# 3. Copier la connection string
# 4. Format: postgresql://user:password@host.neon.tech/dbname
# 5. Ajouter dans Vercel Dashboard
```

### RESEND_API_KEY
```bash
# 1. Aller sur https://resend.com/api-keys
# 2. Cliquer "Create API Key"
# 3. Copier la clé
# 4. Ajouter dans Vercel Dashboard
```

## 🧪 Tester Après Déploiement

### Frontend
```bash
# Ouvrir dans le navigateur
https://your-project.vercel.app

# Vérifier:
# - Page charge
# - Animations 3D fonctionnent
# - Shop modal s'ouvre
# - Panier fonctionne
```

### API
```bash
# Health check
curl https://your-project.vercel.app/health

# Récupérer les produits
curl https://your-project.vercel.app/api/products

# Créer un produit
curl -X POST https://your-project.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99}'
```

### Base de Données
```bash
# Vérifier la connexion
npm run migrate:check

# Vérifier les données
psql $DATABASE_URL -c "SELECT * FROM products LIMIT 5;"
```

## 🐛 Dépannage Rapide

### Build échoue
```bash
# Vérifier localement
npm run build

# Voir les erreurs
npm run build 2>&1 | tail -20

# Vérifier les imports
grep -r "import.*from" src/ | head -10
```

### API ne répond pas
```bash
# Vérifier les logs
vercel logs --follow

# Vérifier la fonction
vercel logs --follow --function=server

# Vérifier les variables
# Settings → Environment Variables
```

### Base de données ne se connecte pas
```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL -c "SELECT 1;"

# Vérifier dans Vercel
# Settings → Environment Variables → DATABASE_URL
```

### Emails ne s'envoient pas
```bash
# Vérifier RESEND_API_KEY
echo $RESEND_API_KEY

# Vérifier le domaine
# https://resend.com/domains

# Vérifier les logs
vercel logs --follow
```

## 📊 Monitoring

### Logs Vercel
```bash
# Tous les logs
vercel logs

# Logs en temps réel
vercel logs --follow

# Logs d'une fonction
vercel logs --follow --function=server

# Logs d'une date spécifique
vercel logs --since 2024-01-01
```

### Analytics
```
https://vercel.com/dashboard
→ Select project
→ Analytics tab
→ View Core Web Vitals
```

## 🔄 Mise à Jour

### Déployer une Mise à Jour
```bash
# Faire les changements
# ...

# Commiter
git add .
git commit -m "Update feature"
git push origin main

# Vercel redéploie automatiquement
# Vérifier: https://vercel.com/dashboard → Deployments
```

### Rollback
```bash
# Via Vercel Dashboard:
# Deployments → Select previous version → Promote to Production

# Via CLI:
vercel rollback
```

## 📝 Checklist Rapide

- [ ] `npx tsx verify-deployment.ts` ✅
- [ ] `npm run build` ✅
- [ ] `git push origin main` ✅
- [ ] Compte Vercel créé ✅
- [ ] Repository importé ✅
- [ ] Variables d'environnement ajoutées ✅
- [ ] Déploiement réussi ✅
- [ ] Frontend accessible ✅
- [ ] API répond ✅
- [ ] Base de données connectée ✅

## 🎯 Prochaines Étapes

1. Lire `DEPLOYMENT_SUMMARY.md` pour une vue d'ensemble
2. Lire `VERCEL_SETUP_GUIDE.md` pour les détails
3. Lire `ENVIRONMENT_VARIABLES_GUIDE.md` pour les clés API
4. Exécuter `npx tsx verify-deployment.ts`
5. Déployer sur Vercel

## 🆘 Besoin d'Aide?

- **Erreurs de build**: Voir `PRE_DEPLOYMENT_CHECKLIST.md`
- **Variables d'environnement**: Voir `ENVIRONMENT_VARIABLES_GUIDE.md`
- **Configuration avancée**: Voir `VERCEL_ADVANCED_CONFIG.md`
- **Dépannage**: Voir `VERCEL_SETUP_GUIDE.md` → Dépannage

---

**Bonne chance! 🚀**
