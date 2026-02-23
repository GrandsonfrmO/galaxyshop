# 🌟 Boutique Immersive 3D

Boutique e-commerce immersive en 3D construite avec React, Three.js et Neon Database.

## ✨ Fonctionnalités

- 🎮 Expérience 3D immersive avec Three.js
- 🛒 Système de panier et commandes
- 👨‍💼 Panel d'administration
- 🗄️ Base de données PostgreSQL (Neon)
- 📧 Emails transactionnels (Resend)

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd <nom-du-projet>

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local avec tes vraies clés

# Initialiser la base de données
npm run db:init
npm run db:migrate
npm run db:seed
```

### Développement

```bash
# Démarrer le serveur de développement
npm run dev:full

# Ou séparément
npm run server  # Backend (port 3001)
npm run dev     # Frontend (port 5173)
```

### Production

```bash
# Vérifier que tout est prêt
npm run deploy:check

# Build
npm run build

# Preview
npm run preview

# Déployer sur Vercel
vercel --prod
```

## 📚 Structure

Le projet est organisé en modules clairs pour faciliter le développement.

## 🛠️ Stack Technique

### Frontend
- **React 19** - Framework UI
- **Three.js** - Rendu 3D
- **@react-three/fiber** - React pour Three.js
- **@react-three/drei** - Helpers Three.js
- **Framer Motion** - Animations
- **GSAP** - Animations avancées
- **Zustand** - State management
- **Vite** - Build tool

### Backend
- **Express** - Serveur API
- **PostgreSQL** - Base de données (Neon)
- **Resend** - Emails transactionnels
- **Gemini AI** - Intelligence artificielle

### DevOps
- **Vercel** - Hébergement
- **GitHub** - Version control
- **TypeScript** - Type safety

## 📁 Structure du Projet

```
.
├── api/                    # Routes API
├── canvas/                 # Composants 3D
├── config/                 # Configuration
├── game/                   # Mini-jeu
├── public/                 # Assets statiques
│   ├── products/          # Images produits
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── scripts/               # Scripts utilitaires
├── services/              # Services backend
│   └── migrations/        # Migrations SQL
├── ui/                    # Composants UI
├── App.tsx                # Composant principal
├── types.ts               # Types TypeScript
└── vercel.json            # Config Vercel
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Frontend uniquement
npm run server           # Backend uniquement
npm run dev:full         # Frontend + Backend

# Build
npm run build            # Build production
npm run preview          # Preview du build

# Base de données
npm run db:init          # Initialiser
npm run db:migrate       # Migrations
npm run seed             # Données de test

# Images
npm run setup:images     # Gérer les images
```

## 🌍 Variables d'Environnement

```env
# Neon Database
DATABASE_URL=postgresql://user:pass@host/db

# Resend Email (optionnel)
RESEND_API_KEY=ta_clé_resend

# Gemini AI (optionnel)
GEMINI_API_KEY=ta_clé_gemini
```

Voir `.env.local.example` pour plus de détails.

## 📦 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## 🎨 Fonctionnalités Principales

- Navigation 3D immersive dans l'espace
- Catalogue de produits avec panier
- Gestion des commandes et livraisons
- Panel d'administration complet
- Mini-jeu arcade intégré

## 🚀 Performance

- Images optimisées
- Code splitting et lazy loading
- Animations fluides avec GSAP

## 🎯 Roadmap

- [ ] Images produits multiples
- [ ] Paiement en ligne
- [ ] Système de reviews
- [ ] Multi-langue

---

**Fait avec ❤️ et Three.js**
