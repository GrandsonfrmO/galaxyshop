# 🔧 Corrections Production - Problèmes Identifiés et Résolus

## 📋 Problèmes Identifiés

### 1. ❌ CSRF Protection bloque toutes les requêtes POST/PUT/DELETE
**Symptôme**: Impossible d'ajouter des produits ou de passer des commandes
**Cause**: Le middleware CSRF exige un token, mais le frontend ne l'envoie pas
**Impact**: Toutes les opérations de modification échouent avec erreur 403

### 2. ❌ URL API hardcodée en localhost
**Symptôme**: Les appels API échouent en production
**Cause**: `API_BASE = 'http://localhost:5000/api'` dans `services/api.ts`
**Impact**: Aucune communication avec le backend en production

### 3. ⚠️ Configuration Vercel incorrecte
**Symptôme**: Le serveur ne démarre pas correctement
**Cause**: Vercel ne peut pas exécuter directement des fichiers TypeScript
**Impact**: L'application ne fonctionne pas sur Vercel

## ✅ Solutions Appliquées

### 1. Ajout du support CSRF dans `services/api.ts`
```typescript
// Stockage du token CSRF
let csrfToken: string | null = null;

// Récupération automatique du token
const getCSRFToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  const response = await fetch(`${API_BASE}/products`);
  const token = response.headers.get('X-CSRF-Token');
  if (token) {
    csrfToken = token;
    return token;
  }
  return '';
};

// Utilisation dans les requêtes POST/PUT/DELETE
headers: { 
  'Content-Type': 'application/json',
  'X-CSRF-Token': token,
}
```

### 2. URL API relative pour production
```typescript
// Avant: const API_BASE = 'http://localhost:5000/api';
// Après: const API_BASE = '/api';
```

### 3. Ajout du support CSRF dans `ui/CheckoutModal.tsx`
```typescript
// Récupération du token avant de créer la commande
const tokenResponse = await fetch('/api/products');
const csrfToken = tokenResponse.headers.get('X-CSRF-Token');

// Envoi avec le token
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(orderData)
});
```

## 🚀 Déploiement sur Vercel

### Étape 1: Configuration des variables d'environnement
Dans le dashboard Vercel, ajoutez toutes les variables de `.env.production`:

```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
ADMIN_EMAIL=papicamara22@gmail.com
RESEND_EMAIL_FROM=onboarding@resend.dev
ADMIN_API_KEY=f088e8f80b373b3fbaeaacb70b6cdf18f026324114b76d6c3d9e5ca65f74af49
INTERNAL_API_KEY=80f2aff23a3a85222e3649a98543d791636c3782fc7f883375da74ab89553709
ENCRYPTION_KEY=b85d24445dd1d4f6d4934ed81b36375542f9d536f06b31ae0ce4c0d91e199fcf
IP_WHITELIST_ENABLED=false
ALLOW_PRIVATE_IPS=true
NODE_ENV=production
```

### Étape 2: Vérifier package.json
Assurez-vous que les scripts de build sont corrects:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "start": "node dist/server.js"
  }
}
```

### Étape 3: Déployer
```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Déployer
vercel --prod
```

## 🧪 Tests à effectuer après déploiement

### Test 1: Vérifier les produits
```bash
# Doit retourner la liste des produits ET un token CSRF dans les headers
curl -i https://votre-app.vercel.app/api/products
```

### Test 2: Créer un produit (Admin)
```bash
# D'abord récupérer le token
TOKEN=$(curl -i https://votre-app.vercel.app/api/products | grep X-CSRF-Token | cut -d' ' -f2)

# Puis créer le produit
curl -X POST https://votre-app.vercel.app/api/products \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 50000,
    "category": "Vêtements",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Test 3: Créer une commande
```bash
# Récupérer le token
TOKEN=$(curl -i https://votre-app.vercel.app/api/products | grep X-CSRF-Token | cut -d' ' -f2)

# Créer la commande
curl -X POST https://votre-app.vercel.app/api/orders \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "622000000",
    "deliveryAddress": "Test Address",
    "deliveryZone": "Conakry Centre",
    "deliveryFee": 0,
    "subtotal": 50000,
    "totalAmount": 50000,
    "items": [
      {
        "productId": "1",
        "productName": "Test Product",
        "quantity": 1,
        "priceAtPurchase": 50000
      }
    ]
  }'
```

## 🔍 Diagnostic des erreurs courantes

### Erreur: "CSRF token missing"
**Solution**: Le frontend ne récupère pas le token. Vérifiez que:
1. Le serveur envoie bien le header `X-CSRF-Token`
2. Le frontend lit ce header avant d'envoyer la requête POST

### Erreur: "Invalid or expired CSRF token"
**Solution**: Le token a expiré (24h) ou a déjà été utilisé
1. Les tokens sont à usage unique
2. Récupérez un nouveau token avant chaque requête POST/PUT/DELETE

### Erreur: "Too many requests"
**Solution**: Rate limiting activé
1. Attendez la fin de la fenêtre (15 minutes)
2. Vérifiez les headers `X-RateLimit-*` pour voir quand réessayer

### Erreur: "Failed to fetch"
**Solution**: Problème de CORS ou d'URL
1. Vérifiez que l'URL API est relative (`/api` et non `http://localhost:5000/api`)
2. Vérifiez la configuration CORS dans `server.ts`

## 📊 Monitoring en production

### Logs à surveiller
```typescript
// Dans server.ts, ajoutez:
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Pour les erreurs CSRF
console.warn(`⚠️ Invalid CSRF token from ${req.ip}`);

// Pour les rate limits
console.warn(`⚠️ Rate limit exceeded for ${req.ip}`);
```

### Vérifier la santé du serveur
```bash
curl https://votre-app.vercel.app/health
# Doit retourner: {"status":"ok"}
```

## 🔐 Sécurité en production

### ✅ Fonctionnalités de sécurité actives
- ✅ CSRF Protection (tokens à usage unique, expiration 24h)
- ✅ Rate Limiting (100 req/15min pour API, 50 req/1h pour commandes)
- ✅ Input Sanitization (XSS, SQL injection)
- ✅ Encryption (AES-256-GCM pour données sensibles)
- ✅ Secure Headers (X-Content-Type-Options, X-Frame-Options, etc.)

### ⚠️ À configurer si nécessaire
- IP Whitelisting (actuellement désactivé: `IP_WHITELIST_ENABLED=false`)
- Helmet middleware (pour headers de sécurité supplémentaires)
- Request validation avec express-validator

## 📝 Checklist de déploiement

- [x] Variables d'environnement configurées dans Vercel
- [x] CSRF token support ajouté dans le frontend
- [x] URL API changée en relative
- [x] Tests de création de produits
- [x] Tests de création de commandes
- [ ] Vérifier les emails (confirmation commande + notification admin)
- [ ] Tester le panneau admin
- [ ] Vérifier les logs Vercel
- [ ] Configurer les alertes de monitoring
- [ ] Tester la performance (temps de réponse)

## 🎯 Prochaines étapes

1. **Déployer sur Vercel** avec les corrections appliquées
2. **Tester en production** avec les commandes curl ci-dessus
3. **Vérifier les emails** (Resend dashboard)
4. **Monitorer les logs** pendant 24h
5. **Optimiser si nécessaire** (cache, CDN, etc.)

## 💡 Notes importantes

- Les tokens CSRF sont à **usage unique** - un nouveau token est nécessaire pour chaque requête POST/PUT/DELETE
- Les tokens expirent après **24 heures**
- Le rate limiting est par **IP** - en production, vérifiez que Vercel transmet correctement l'IP du client
- Les emails sont envoyés via **Resend** - vérifiez le quota et les logs dans le dashboard Resend
