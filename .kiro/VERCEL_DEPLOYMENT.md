# 🚀 Préparation Déploiement Vercel

## ✅ Checklist Pré-Déploiement

### 1. Configuration Vercel
- [ ] Créer un compte Vercel (vercel.com)
- [ ] Connecter votre repository GitHub
- [ ] Configurer les variables d'environnement

### 2. Variables d'Environnement Requises
```
GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
RESEND_API_KEY=your_key_here
```

### 3. Fichiers de Configuration
- [ ] `vercel.json` - Configuration Vercel
- [ ] `.env.production` - Variables de production
- [ ] `package.json` - Scripts de build corrects

### 4. Base de Données
- [ ] Neon PostgreSQL configurée
- [ ] Migrations appliquées en production
- [ ] Backups configurés

### 5. API & Services
- [ ] API Express convertie en Edge Functions (optionnel)
- [ ] Ou déployer comme serveur Node.js
- [ ] CORS configuré correctement

### 6. Frontend
- [ ] Build Vite optimisé
- [ ] Variables d'environnement injectées
- [ ] Assets statiques configurés

## 📋 Étapes de Déploiement

### Étape 1: Préparer le Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Étape 2: Configurer Vercel
1. Aller sur vercel.com
2. Cliquer "New Project"
3. Importer votre repository GitHub
4. Configurer les variables d'environnement
5. Déployer

### Étape 3: Vérifier le Déploiement
- [ ] Frontend accessible
- [ ] API fonctionnelle
- [ ] Base de données connectée
- [ ] Emails fonctionnels (Resend)

## 🔧 Configuration Recommandée

### Option 1: Serverless (Recommandé)
- Frontend: Vercel Static
- API: Vercel Edge Functions
- DB: Neon PostgreSQL
- Email: Resend

### Option 2: Full Node.js
- Frontend + API: Vercel Node.js Runtime
- DB: Neon PostgreSQL
- Email: Resend

## ⚠️ Points Importants

1. **Timeouts**: Vercel a des limites de timeout
2. **Cold Starts**: Les Edge Functions peuvent avoir des délais
3. **Migrations**: Exécuter les migrations avant le déploiement
4. **Secrets**: Ne jamais commiter les clés API
5. **CORS**: Configurer correctement pour le domaine Vercel

## 🔗 Ressources
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)
