# 💻 Commandes Essentielles

## 🚀 Démarrage

### Installation des dépendances
```bash
npm install
```
Installe toutes les dépendances du projet.

### Serveur de développement
```bash
npm run dev
```
Lance le serveur sur `http://localhost:3000`

**Options:**
- Accès réseau: `http://<votre-ip>:3000`
- Changer le port: Modifier `vite.config.ts`

---

## 🏗️ Build & Production

### Build production
```bash
npm run build
```
Crée un dossier `dist/` optimisé pour la production.

### Prévisualiser le build
```bash
npm run preview
```
Lance le build sur `http://localhost:4173`

---

## 🧹 Nettoyage

### Supprimer les dépendances
```bash
rm -rf node_modules
```

### Réinstaller complètement
```bash
rm -rf node_modules package-lock.json
npm install
```

### Nettoyer le cache Vite
```bash
rm -rf .vite
```

---

## 🔍 Debugging

### Voir les logs
```bash
npm run dev
# Les logs s'affichent dans le terminal
```

### Ouvrir les DevTools
```
F12 ou Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

### Inspecter le store
```javascript
// Dans la console du navigateur
const store = useStore.getState();
console.log(store);
```

---

## 📦 Gestion des Dépendances

### Ajouter une dépendance
```bash
npm install nom-du-package
```

### Ajouter une dépendance de développement
```bash
npm install --save-dev nom-du-package
```

### Mettre à jour les dépendances
```bash
npm update
```

### Vérifier les dépendances obsolètes
```bash
npm outdated
```

---

## 🚀 Déploiement

### Vercel
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# Configurer vite.config.ts avec base: '/repo-name/'
npm run build
git add dist
git commit -m "Deploy"
git push
```

---

## 🔐 Variables d'Environnement

### Créer .env.local
```bash
echo "GEMINI_API_KEY=votre_clé_api" > .env.local
```

### Voir les variables
```bash
cat .env.local
```

### Modifier les variables
```bash
# Éditer le fichier directement
nano .env.local  # Linux/Mac
notepad .env.local  # Windows
```

---

## 🧪 Tests

### Lancer les tests (si configurés)
```bash
npm test
```

### Tests en mode watch
```bash
npm test -- --watch
```

### Tests avec couverture
```bash
npm test -- --coverage
```

---

## 📊 Analyse

### Vérifier la taille du bundle
```bash
npm run build
# Voir la taille dans le terminal
```

### Analyser les performances
```bash
# Utiliser Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

---

## 🔄 Git

### Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Voir le statut
```bash
git status
```

### Voir les changements
```bash
git diff
```

### Créer une branche
```bash
git checkout -b feature/ma-feature
```

### Fusionner une branche
```bash
git checkout main
git merge feature/ma-feature
```

---

## 🐳 Docker (Optionnel)

### Créer une image Docker
```bash
docker build -t grandson-clothes .
```

### Lancer un conteneur
```bash
docker run -p 3000:3000 grandson-clothes
```

### Dockerfile exemple
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🔧 Troubleshooting

### Erreur: "npm: command not found"
```bash
# Installer Node.js depuis nodejs.org
# Vérifier l'installation
node --version
npm --version
```

### Erreur: "Port 3000 already in use"
```bash
# Trouver le processus
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Ou utiliser un autre port
# Modifier vite.config.ts: port: 3001
```

### Erreur: "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "GEMINI_API_KEY not found"
```bash
# Vérifier que .env.local existe
ls -la .env.local  # Mac/Linux
dir .env.local  # Windows

# Vérifier le contenu
cat .env.local  # Mac/Linux
type .env.local  # Windows
```

---

## 📈 Performance

### Optimiser les images
```bash
npm install -g imagemin-cli
imagemin src/images/* --out-dir=public/images
```

### Analyser le bundle
```bash
npm install --save-dev webpack-bundle-analyzer
# Configurer dans vite.config.ts
```

### Minifier le code
```bash
# Vite le fait automatiquement en production
npm run build
```

---

## 🔐 Sécurité

### Vérifier les vulnérabilités
```bash
npm audit
```

### Corriger les vulnérabilités
```bash
npm audit fix
```

### Vérifier les dépendances
```bash
npm ls
```

---

## 📚 Aide

### Voir l'aide npm
```bash
npm help
```

### Voir l'aide d'une commande
```bash
npm help install
npm help run
```

### Voir la version
```bash
npm --version
node --version
```

---

## 🎯 Workflow Typique

### Développement
```bash
# 1. Installer
npm install

# 2. Configurer .env.local
echo "GEMINI_API_KEY=..." > .env.local

# 3. Lancer le serveur
npm run dev

# 4. Développer et tester
# Modifier les fichiers, le serveur se met à jour automatiquement

# 5. Vérifier les erreurs
# Ouvrir DevTools (F12)
```

### Avant de déployer
```bash
# 1. Vérifier les erreurs
npm run build

# 2. Tester le build
npm run preview

# 3. Vérifier les vulnérabilités
npm audit

# 4. Commit et push
git add .
git commit -m "Prêt pour production"
git push
```

### Déploiement
```bash
# Vercel
vercel deploy --prod

# Ou Netlify
netlify deploy --prod --dir=dist
```

---

## ✅ Checklist Commandes

- [ ] `npm install` exécuté
- [ ] `.env.local` créé
- [ ] `npm run dev` fonctionne
- [ ] App accessible sur `http://localhost:3000`
- [ ] `npm run build` sans erreurs
- [ ] `npm run preview` fonctionne
- [ ] Prêt pour déploiement

