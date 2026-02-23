# 🚀 Guide de Déploiement Vercel - Application E-commerce

## 📋 Pré-requis

- Compte Vercel (gratuit)
- Compte GitHub avec le repository
- Base de données Neon PostgreSQL configurée
- Compte Resend pour les emails

## 🔧 Corrections Appliquées

### ✅ Problème 1: CSRF Protection
**Avant**: Les requêtes POST/PUT/DELETE échouaient avec erreur 403
**Après**: Support complet des tokens CSRF dans le frontend

### ✅ Problème 2: URL API hardcodée
**Avant**: `http://localhost:5000/api` ne fonctionnait pas en production
**Après**: URL relative `/api` qui fonctionne partout

### ✅ Problème 3: Gestion des tokens
**Avant**: Pas de gestion des tokens CSRF
**Après**: Récupération et envoi automatique des tokens

## 🚀 Étapes de Déploiement

### 1. Préparer le Repository

```bash
# Assurez-vous que tous les fichiers sont commités
git add .
git commit -m "Fix: Add CSRF support and production fixes"
git push origin main
```

### 2. Créer le Projet Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Configurez le projet:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez ces variables:

```env
# Base de données
DATABASE_URL=postgresql://neondb_owner:npg_SioVIyh8n9cA@ep-falling-dew-aeu2wjt5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Email (Resend)
RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
ADMIN_EMAIL=papicamara22@gmail.com
RESEND_EMAIL_FROM=onboarding@resend.dev

# Sécurité
ADMIN_API_KEY=f088e8f80b373b3fbaeaacb70b6cdf18f026324114b76d6c3d9e5ca65f74af49
INTERNAL_API_KEY=80f2aff23a3a85222e3649a98543d791636c3782fc7f883375da74ab89553709
ENCRYPTION_KEY=b85d24445dd1d4f6d4934ed81b36375542f9d536f06b31ae0ce4c0d91e199fcf

# Configuration
NODE_ENV=production
IP_WHITELIST_ENABLED=false
ALLOW_PRIVATE_IPS=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CSRF_TOKEN_EXPIRY=86400000
```

### 4. Déployer

Cliquez sur "Deploy" et attendez que le build se termine.

## 🧪 Tests Post-Déploiement

### Test 1: Vérifier le serveur

```bash
# Remplacez YOUR_APP_URL par votre URL Vercel
curl https://YOUR_APP_URL.vercel.app/health
# Doit retourner: {"status":"ok"}
```

### Test 2: Tester les produits

```bash
# Récupérer les produits (doit retourner un token CSRF dans les headers)
curl -i https://YOUR_APP_URL.vercel.app/api/products
```

### Test 3: Tester une commande

Utilisez le script de test fourni:

```bash
bash scripts/test-production-api.sh https://YOUR_APP_URL.vercel.app
```

### Test 4: Interface utilisateur

1. Ouvrez l'application dans le navigateur
2. Essayez d'ajouter un produit au panier
3. Passez une commande de test
4. Vérifiez que vous recevez l'email de confirmation

## 🔍 Diagnostic des Problèmes

### Problème: "CSRF token missing"

**Cause**: Le frontend ne récupère pas le token
**Solution**: 
1. Vérifiez les logs du navigateur (F12 > Console)
2. Vérifiez que le serveur envoie le header `X-CSRF-Token`
3. Vérifiez le code dans `services/api.ts`

### Problème: "Failed to fetch"

**Cause**: Problème de CORS ou d'URL
**Solution**:
1. Vérifiez que l'URL API est relative (`/api`)
2. Vérifiez la configuration CORS dans `server.ts`
3. Vérifiez les logs Vercel

### Problème: "Too many requests"

**Cause**: Rate limiting activé
**Solution**:
1. Attendez 15 minutes
2. Vérifiez les headers `X-RateLimit-*`
3. Ajustez les limites si nécessaire dans `.env`

### Problème: Les emails ne sont pas envoyés

**Cause**: Configuration Resend incorrecte
**Solution**:
1. Vérifiez `RESEND_API_KEY` dans les variables d'environnement
2. Vérifiez le quota Resend (dashboard)
3. Vérifiez les logs dans Vercel
4. Vérifiez que `ADMIN_EMAIL` est correct

## 📊 Monitoring

### Logs Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur "Logs" dans le menu
3. Surveillez les erreurs et warnings

### Logs importants à surveiller

```
✅ Order created with ID: XXX
✅ Customer email sent successfully
✅ Admin email sent successfully
❌ Error creating order
❌ Error sending customer email
⚠️ Rate limit exceeded for IP
⚠️ Invalid CSRF token from IP
```

### Dashboard Resend

1. Allez sur [resend.com/emails](https://resend.com/emails)
2. Vérifiez que les emails sont envoyés
3. Vérifiez le statut de livraison

## 🔐 Sécurité en Production

### Fonctionnalités Actives

- ✅ **CSRF Protection**: Tokens à usage unique, expiration 24h
- ✅ **Rate Limiting**: 
  - API: 100 req/15min
  - Commandes: 50 req/1h
  - Admin: 200 req/15min
- ✅ **Input Sanitization**: Protection XSS et SQL injection
- ✅ **Encryption**: AES-256-GCM pour données sensibles
- ✅ **Secure Headers**: X-Content-Type-Options, X-Frame-Options, etc.

### Recommandations

1. **Activez HTTPS** (automatique sur Vercel)
2. **Surveillez les logs** régulièrement
3. **Mettez à jour les dépendances** mensuellement
4. **Sauvegardez la base de données** régulièrement
5. **Testez les emails** après chaque déploiement

## 📝 Checklist de Déploiement

- [x] Code corrigé et commité
- [x] Variables d'environnement configurées
- [ ] Projet déployé sur Vercel
- [ ] Health check OK
- [ ] Test de récupération des produits OK
- [ ] Test de création de commande OK
- [ ] Emails de confirmation reçus
- [ ] Emails admin reçus
- [ ] Panneau admin accessible
- [ ] Performance vérifiée
- [ ] Logs surveillés pendant 24h

## 🎯 Prochaines Étapes

### Immédiat
1. Déployer sur Vercel
2. Tester avec le script fourni
3. Vérifier les emails

### Court terme (1 semaine)
1. Monitorer les logs
2. Optimiser les performances si nécessaire
3. Ajouter des produits réels
4. Tester avec des commandes réelles

### Moyen terme (1 mois)
1. Configurer les alertes de monitoring
2. Mettre en place des sauvegardes automatiques
3. Optimiser le SEO
4. Ajouter Google Analytics

## 💡 Conseils

### Performance
- Les images doivent être optimisées (WebP, compression)
- Utilisez le CDN de Vercel pour les assets statiques
- Activez le cache pour les produits

### Sécurité
- Ne partagez JAMAIS les clés API
- Changez les clés régulièrement
- Surveillez les tentatives d'accès non autorisées

### Maintenance
- Vérifiez les logs quotidiennement
- Testez les fonctionnalités critiques hebdomadairement
- Mettez à jour les dépendances mensuellement

## 📞 Support

### Problèmes de déploiement
- Documentation Vercel: https://vercel.com/docs
- Support Vercel: https://vercel.com/support

### Problèmes d'emails
- Documentation Resend: https://resend.com/docs
- Support Resend: https://resend.com/support

### Problèmes de base de données
- Documentation Neon: https://neon.tech/docs
- Support Neon: https://neon.tech/docs/introduction/support

## 🎉 Félicitations!

Si tous les tests passent, votre application est maintenant en production et prête à recevoir des commandes réelles!

N'oubliez pas de:
- Surveiller les logs régulièrement
- Tester les fonctionnalités critiques
- Sauvegarder la base de données
- Mettre à jour les dépendances

Bon commerce! 🛍️
