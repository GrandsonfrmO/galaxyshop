# 🔧 Configuration Avancée Vercel

## 📋 Architecture Recommandée

### Option 1: Frontend + API Séparés (Recommandé)
```
Frontend: Vercel Static (dist/)
API: Vercel Serverless Functions (server.ts)
DB: Neon PostgreSQL
```

### Option 2: Monorepo Full Stack
```
Frontend + API: Vercel Node.js Runtime
DB: Neon PostgreSQL
```

## 🛠️ Configuration vercel.json Détaillée

### Explication des Paramètres

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "DATABASE_URL": "@database_url",
    "RESEND_API_KEY": "@resend_api_key"
  },
  "functions": {
    "server.ts": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/server.ts"
    }
  ]
}
```

### Paramètres Clés

| Paramètre | Valeur | Explication |
|-----------|--------|-------------|
| `version` | 2 | Version de la config Vercel |
| `buildCommand` | `npm run build` | Commande pour compiler |
| `outputDirectory` | `dist` | Dossier de sortie Vite |
| `runtime` | `nodejs20.x` | Version Node.js |
| `memory` | 1024 | RAM en MB (max 3008) |
| `maxDuration` | 60 | Timeout en secondes (max 900) |

## 🔄 Rewrites & Redirects

### Rediriger /api vers server.ts
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "/server.ts"
  }
]
```

### Redirects (optionnel)
```json
"redirects": [
  {
    "source": "/old-path",
    "destination": "/new-path",
    "permanent": true
  }
]
```

## 🔐 Variables d'Environnement

### Ajouter dans Vercel Dashboard

1. **Settings** → **Environment Variables**
2. Ajouter chaque variable:

```
Name: GEMINI_API_KEY
Value: [votre clé]
Environments: Production, Preview, Development
```

### Référencer dans vercel.json
```json
"env": {
  "GEMINI_API_KEY": "@gemini_api_key"
}
```

## 📊 Optimisations de Performance

### 1. Compression
```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Content-Encoding",
        "value": "gzip"
      }
    ]
  }
]
```

### 2. Cache Headers
```json
"headers": [
  {
    "source": "/dist/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

### 3. Image Optimization
```json
"images": {
  "sizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  "domains": ["example.com"]
}
```

## 🔒 Sécurité

### Headers de Sécurité
```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-XSS-Protection",
        "value": "1; mode=block"
      }
    ]
  }
]
```

### CORS Configuration
```typescript
// Dans server.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.vercel.app'
    : 'http://localhost:3000',
  credentials: true
}));
```

## 🚀 Déploiement Automatique

### GitHub Integration
1. Connecter GitHub à Vercel
2. Chaque push déclenche un déploiement
3. Pull requests créent des preview deployments

### Webhooks
```json
"webhooks": [
  {
    "url": "https://example.com/webhook",
    "events": ["deployment.created", "deployment.error"]
  }
]
```

## 📈 Monitoring & Analytics

### Activer Analytics
1. Dashboard Vercel
2. **Analytics** tab
3. Voir les Core Web Vitals

### Logs
```bash
# Installer Vercel CLI
npm i -g vercel

# Voir les logs en temps réel
vercel logs --follow

# Voir les logs d'une fonction
vercel logs --follow --function=server
```

## 🐛 Dépannage Courant

### Erreur: "Build failed"
```bash
# Vérifier localement
npm run build

# Vérifier les logs Vercel
vercel logs
```

### Erreur: "Function timeout"
```json
// Augmenter le timeout dans vercel.json
"functions": {
  "server.ts": {
    "maxDuration": 300  // 5 minutes max
  }
}
```

### Erreur: "Out of memory"
```json
// Augmenter la mémoire
"functions": {
  "server.ts": {
    "memory": 3008  // Maximum
  }
}
```

## 🔄 Migrations Base de Données

### Exécuter les Migrations
```bash
# Avant le déploiement
npm run migrate

# Vérifier
npm run migrate:check
```

### Migrations en Production
Option 1: Exécuter localement avant déploiement
```bash
npm run migrate
git push
```

Option 2: Exécuter via Edge Function
```typescript
// api/migrate.ts
import { runMigrations } from '../services/runMigrations';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Vérifier l'authentification
  if (req.headers['x-api-key'] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    await runMigrations();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 📦 Optimisation du Build

### Réduire la Taille du Bundle
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
});
```

## 🎯 Checklist Configuration Finale

- [ ] vercel.json créé et validé
- [ ] .env.production existe (sans vraies valeurs)
- [ ] package.json a les bons scripts
- [ ] vite.config.ts optimisé
- [ ] server.ts prêt pour Vercel
- [ ] CORS configuré
- [ ] Variables d'environnement préparées
- [ ] Migrations testées localement
- [ ] Build réussit: `npm run build`
- [ ] Pas d'erreurs TypeScript

## 📞 Ressources

- [Vercel Config Docs](https://vercel.com/docs/projects/project-configuration)
- [Vercel Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel CLI](https://vercel.com/docs/cli)
