# ✅ Checklist Pré-Déploiement Vercel

## 🔍 Vérifications Locales

### Code & Build
```bash
# 1. Vérifier que tout compile
npm run build

# 2. Vérifier les erreurs TypeScript
npm run build  # Doit réussir sans erreurs

# 3. Tester le serveur localement
npm run dev:full

# 4. Vérifier les migrations
npm run migrate:check
```

### Git
```bash
# 5. Vérifier que tout est commité
git status  # Doit être clean

# 6. Vérifier les fichiers sensibles
git ls-files | grep -E "\.env|secrets|keys"  # Ne doit rien retourner

# 7. Pousser les changements
git push origin main
```

## 🔐 Sécurité

### Fichiers Sensibles
- [ ] `.env.local` n'est pas commité
- [ ] `.env.production` n'a pas de vraies valeurs
- [ ] Pas de clés API dans le code
- [ ] `.gitignore` contient `.env*`

### Vérifier .gitignore
```bash
cat .gitignore | grep -E "\.env|node_modules|dist"
```

## 📦 Dépendances

### Vérifier package.json
- [ ] Toutes les dépendances sont listées
- [ ] Pas de dépendances inutiles
- [ ] Versions compatibles

```bash
npm list  # Vérifier les dépendances
npm audit  # Vérifier les vulnérabilités
```

## 🗄️ Base de Données

### Neon PostgreSQL
- [ ] Base de données créée
- [ ] Migrations appliquées
- [ ] Données de test présentes
- [ ] Backups configurés

```bash
# Tester la connexion
npm run migrate:check
```

### Variables d'Environnement
- [ ] DATABASE_URL correct
- [ ] Format: `postgresql://user:password@host.neon.tech/dbname`
- [ ] Pas d'espaces ou caractères spéciaux mal échappés

## 🔑 Clés API

### Gemini API
- [ ] Clé API valide
- [ ] Quota disponible
- [ ] Pas d'erreurs dans les logs

### Resend API
- [ ] Clé API valide
- [ ] Domaine vérifié
- [ ] Emails de test fonctionnent

```bash
# Tester l'email
npm run test-email  # Si le script existe
```

## 🎨 Frontend

### Build Vite
- [ ] `npm run build` réussit
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'avertissements critiques
- [ ] Fichiers générés dans `dist/`

```bash
npm run build
ls -la dist/  # Vérifier les fichiers
```

### Assets
- [ ] Images optimisées
- [ ] Fonts chargées correctement
- [ ] CSS/JS minifiés
- [ ] Source maps générées (optionnel)

## 🔗 API

### Endpoints
- [ ] GET /health fonctionne
- [ ] GET /api/products retourne les données
- [ ] POST /api/products crée un produit
- [ ] PUT /api/products/:id met à jour
- [ ] DELETE /api/products/:id supprime

```bash
# Tester localement
curl http://localhost:5000/health
curl http://localhost:5000/api/products
```

### CORS
- [ ] CORS configuré dans server.ts
- [ ] Domaine Vercel sera accepté
- [ ] Headers corrects

## 📋 Configuration Vercel

### vercel.json
- [ ] Fichier existe
- [ ] buildCommand correct
- [ ] outputDirectory = "dist"
- [ ] Fonctions configurées

### Environment Variables
Préparer les variables à ajouter dans Vercel:
```
GEMINI_API_KEY = [votre clé]
DATABASE_URL = [votre URL Neon]
RESEND_API_KEY = [votre clé]
NODE_ENV = production
```

## 🚀 Avant de Cliquer "Deploy"

### Checklist Finale
- [ ] `git status` est clean
- [ ] `npm run build` réussit
- [ ] Pas d'erreurs TypeScript
- [ ] `.env.local` n'est pas commité
- [ ] DATABASE_URL testé localement
- [ ] Toutes les clés API valides
- [ ] vercel.json existe et est correct
- [ ] Repository poussé sur GitHub

### Commandes Finales
```bash
# 1. Vérifier le build
npm run build

# 2. Vérifier les fichiers sensibles
git status

# 3. Pousser
git push origin main

# 4. Aller sur Vercel et déployer
```

## 🎯 Après le Déploiement

### Vérifications
- [ ] URL Vercel accessible
- [ ] Frontend charge
- [ ] API répond
- [ ] Base de données connectée
- [ ] Pas d'erreurs dans les logs

### Monitoring
- [ ] Vérifier les logs Vercel
- [ ] Vérifier les erreurs frontend
- [ ] Vérifier les erreurs API
- [ ] Vérifier les erreurs base de données

## 📞 En Cas de Problème

### Logs Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Voir les logs
vercel logs --follow
```

### Rollback
1. Aller dans "Deployments" sur Vercel
2. Sélectionner une version précédente
3. Cliquer "Promote to Production"

## ✨ Succès!
Si tout est ✅, votre application est prête pour Vercel!
