# 📖 Guide Complet: Déploiement sur Vercel

## 🎯 Objectif
Déployer votre application React + Express sur Vercel avec une base de données Neon PostgreSQL.

## 📋 Prérequis
- [ ] Compte GitHub avec votre repository
- [ ] Compte Vercel (gratuit)
- [ ] Neon PostgreSQL configurée
- [ ] Clés API (Gemini, Resend)

## 🚀 Étape 1: Préparer le Code Local

### 1.1 Vérifier la structure
```bash
# Votre projet doit avoir:
# - package.json avec scripts build et dev
# - vite.config.ts pour le frontend
# - server.ts pour l'API
# - services/ avec la logique métier
```

### 1.2 Tester localement
```bash
npm install
npm run build
npm run dev:full
```

### 1.3 Commiter les changements
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🔐 Étape 2: Configurer les Variables d'Environnement

### 2.1 Sur Vercel Dashboard
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. Aller dans "Settings" → "Environment Variables"
4. Ajouter les variables:

```
GEMINI_API_KEY = your_gemini_key
DATABASE_URL = postgresql://user:password@host.neon.tech/grandson_db
RESEND_API_KEY = your_resend_key
NODE_ENV = production
```

### 2.2 Vérifier les Secrets
- ✅ Chaque variable doit être marquée comme "Production"
- ✅ Les valeurs ne doivent pas être visibles après création
- ✅ Tester avec "Redeploy" après ajout

## 🏗️ Étape 3: Configurer le Déploiement

### 3.1 Importer le Repository
1. Sur vercel.com, cliquer "New Project"
2. Sélectionner "Import Git Repository"
3. Chercher votre repository GitHub
4. Cliquer "Import"

### 3.2 Configurer les Paramètres de Build
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Ajouter les Variables d'Environnement
Avant de déployer, ajouter toutes les variables (voir Étape 2)

## 🚀 Étape 4: Déployer

### 4.1 Premier Déploiement
1. Cliquer "Deploy"
2. Attendre la compilation (3-5 minutes)
3. Vérifier les logs pour les erreurs

### 4.2 Vérifier le Déploiement
```bash
# Votre URL sera: https://your-project.vercel.app

# Tester:
curl https://your-project.vercel.app/health
curl https://your-project.vercel.app/api/products
```

## 🔍 Étape 5: Tester en Production

### 5.1 Frontend
- [ ] Page d'accueil charge
- [ ] Animations 3D fonctionnent
- [ ] Shop modal s'ouvre
- [ ] Panier fonctionne

### 5.2 API
- [ ] GET /api/products retourne les produits
- [ ] POST /api/products crée un produit
- [ ] Admin dashboard fonctionne

### 5.3 Base de Données
- [ ] Connexion à Neon réussie
- [ ] Migrations appliquées
- [ ] Données visibles

### 5.4 Email
- [ ] Emails envoyés via Resend
- [ ] Vérifier les logs Resend

## 🐛 Dépannage

### Erreur: "Cannot find module"
```bash
# Solution: Vérifier les imports
npm run build  # Tester localement
```

### Erreur: "Database connection failed"
```bash
# Solution: Vérifier DATABASE_URL
# Format: postgresql://user:password@host.neon.tech/dbname
```

### Erreur: "API timeout"
```bash
# Solution: Augmenter le timeout dans vercel.json
# Ou optimiser les requêtes
```

### Erreur: "CORS error"
```bash
# Solution: Vérifier les headers CORS dans server.ts
# Ajouter le domaine Vercel à la whitelist
```

## 📊 Monitoring

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs --follow
```

### Métriques
- Aller dans "Analytics" sur Vercel Dashboard
- Vérifier les performances
- Monitorer les erreurs

## 🔄 Mises à Jour

### Déployer une Mise à Jour
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel redéploie automatiquement
```

### Rollback
1. Aller dans "Deployments"
2. Sélectionner une version précédente
3. Cliquer "Promote to Production"

## 📝 Notes Importantes

1. **Migrations DB**: Exécuter avant le déploiement
   ```bash
   npm run migrate
   ```

2. **Variables Sensibles**: Ne jamais les commiter
   - Utiliser `.env.local` localement
   - Ajouter dans Vercel Dashboard

3. **Performance**: 
   - Vérifier les Core Web Vitals
   - Optimiser les images
   - Minifier le CSS/JS

4. **Sécurité**:
   - Activer HTTPS (automatique)
   - Configurer les headers de sécurité
   - Valider les inputs API

## ✅ Checklist Finale

- [ ] Code poussé sur GitHub
- [ ] Variables d'environnement configurées
- [ ] Build réussit localement
- [ ] Déploiement Vercel réussi
- [ ] Frontend accessible
- [ ] API fonctionnelle
- [ ] Base de données connectée
- [ ] Emails fonctionnels
- [ ] Monitoring activé

## 🎉 Succès!
Votre application est maintenant en production sur Vercel!

## 📞 Support
- Vercel Docs: https://vercel.com/docs
- Neon Support: https://neon.tech/docs
- Resend Support: https://resend.com/docs
