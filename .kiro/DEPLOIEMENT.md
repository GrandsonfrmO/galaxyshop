# 🚀 Guide de Déploiement

## 📋 Pré-requis

- [ ] Code testé localement
- [ ] `.env.local` configuré
- [ ] Build production généré (`npm run build`)
- [ ] Dossier `dist/` créé sans erreurs

---

## 🏗️ Build Production

### Générer le Build

```bash
npm run build
```

**Résultat:**
- Dossier `dist/` créé
- Fichiers minifiés et optimisés
- Prêt pour déploiement

### Vérifier le Build

```bash
npm run preview
```

Accès: `http://localhost:4173`

---

## 🌐 Options de Déploiement

### 1️⃣ Vercel (Recommandé)

**Avantages:**
- Déploiement automatique depuis Git
- CDN global
- Serverless functions
- Gratuit pour les projets publics

**Étapes:**

1. **Créer un compte Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - S'inscrire avec GitHub

2. **Connecter le repository**
   - Importer le projet
   - Sélectionner la branche `main`

3. **Configurer les variables d'environnement**
   ```
   GEMINI_API_KEY = votre_clé_api
   ```

4. **Déployer**
   ```bash
   vercel deploy
   ```

**Résultat:**
- URL: `https://grandson-clothes.vercel.app`
- Déploiement automatique à chaque push

---

### 2️⃣ Netlify

**Avantages:**
- Interface intuitive
- Déploiement facile
- Gratuit

**Étapes:**

1. **Créer un compte Netlify**
   - Aller sur [netlify.com](https://netlify.com)
   - S'inscrire avec GitHub

2. **Connecter le repository**
   - Cliquer "New site from Git"
   - Sélectionner le repository

3. **Configurer le build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Ajouter les variables d'environnement**
   ```
   GEMINI_API_KEY = votre_clé_api
   ```

5. **Déployer**
   - Netlify déploie automatiquement

**Résultat:**
- URL: `https://grandson-clothes.netlify.app`

---

### 3️⃣ GitHub Pages

**Avantages:**
- Gratuit
- Intégré à GitHub
- Pas de configuration serveur

**Étapes:**

1. **Modifier vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/grandson-clothes/',  // Remplacer par votre repo
     // ... reste de la config
   });
   ```

2. **Créer un workflow GitHub Actions**
   
   Fichier: `.github/workflows/deploy.yml`
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Configurer GitHub Pages**
   - Settings → Pages
   - Source: GitHub Actions
   - Sauvegarder

**Résultat:**
- URL: `https://username.github.io/grandson-clothes`

---

### 4️⃣ Serveur Personnel (VPS)

**Avantages:**
- Contrôle total
- Pas de limitations
- Coût prévisible

**Étapes:**

1. **Préparer le serveur**
   ```bash
   # SSH sur le serveur
   ssh user@your-server.com
   
   # Installer Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Installer Nginx
   sudo apt-get install -y nginx
   ```

2. **Cloner le repository**
   ```bash
   cd /var/www
   git clone https://github.com/username/grandson-clothes.git
   cd grandson-clothes
   npm install
   ```

3. **Créer le build**
   ```bash
   npm run build
   ```

4. **Configurer Nginx**
   
   Fichier: `/etc/nginx/sites-available/grandson-clothes`
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           root /var/www/grandson-clothes/dist;
           try_files $uri $uri/ /index.html;
       }
   
       location /api {
           proxy_pass http://localhost:3000;
       }
   }
   ```

5. **Activer le site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/grandson-clothes \
              /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL avec Let's Encrypt**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Résultat:**
- URL: `https://your-domain.com`

---

## 🔐 Variables d'Environnement en Production

### Vercel
```
Settings → Environment Variables
GEMINI_API_KEY = votre_clé_api
```

### Netlify
```
Site settings → Build & deploy → Environment
GEMINI_API_KEY = votre_clé_api
```

### VPS
```bash
# Créer .env.production
GEMINI_API_KEY=votre_clé_api

# Ou via variables système
export GEMINI_API_KEY=votre_clé_api
```

---

## 📊 Monitoring & Analytics

### Google Analytics

1. **Créer un compte Google Analytics**
2. **Ajouter le script dans `index.html`**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_ID');
   </script>
   ```

### Sentry (Error Tracking)

1. **Créer un compte Sentry**
2. **Installer le SDK**
   ```bash
   npm install @sentry/react
   ```
3. **Initialiser dans `index.tsx`**
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "votre_dsn",
     environment: "production"
   });
   ```

---

## 🔄 Déploiement Continu (CI/CD)

### GitHub Actions

Fichier: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🧪 Tests Avant Déploiement

### Checklist de Déploiement

- [ ] Tous les tests passent
- [ ] Pas d'erreurs console
- [ ] Performance acceptable (Lighthouse)
- [ ] Responsive sur mobile
- [ ] Liens fonctionnels
- [ ] Images chargent correctement
- [ ] Jeu jouable
- [ ] Panier fonctionne
- [ ] API Gemini répond

### Lighthouse Check

```bash
# Installer Lighthouse
npm install -g lighthouse

# Tester
lighthouse https://your-domain.com --view
```

---

## 🐛 Dépannage Déploiement

### Erreur: "GEMINI_API_KEY not found"

**Solution:**
- Vérifier que la variable est définie dans le provider
- Vérifier le nom exact de la variable
- Redéployer après modification

### Erreur: "Build failed"

**Solution:**
```bash
# Nettoyer et reconstruire
rm -rf node_modules dist
npm install
npm run build
```

### Site blanc après déploiement

**Solution:**
- Vérifier les erreurs console (F12)
- Vérifier les logs du serveur
- Vérifier que `index.html` est servi correctement

### Performance lente

**Solution:**
- Optimiser les images
- Réduire la taille du bundle
- Activer la compression Gzip
- Utiliser un CDN

---

## 📈 Optimisations Post-Déploiement

### Compression Gzip

**Vercel:** Automatique

**Netlify:** Automatique

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### Cache Busting

Vite gère automatiquement avec les hash de fichiers.

### Image Optimization

```typescript
// Utiliser des formats modernes
<img src="image.webp" alt="description" />
```

---

## 🔗 Ressources Utiles

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## ✅ Checklist Déploiement

- [ ] Build production généré
- [ ] Variables d'environnement configurées
- [ ] Tests passent
- [ ] Performance acceptable
- [ ] Domaine configuré
- [ ] SSL activé
- [ ] Monitoring en place
- [ ] Backups configurés
- [ ] Documentation mise à jour

