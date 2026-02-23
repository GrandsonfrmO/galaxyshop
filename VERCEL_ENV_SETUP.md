# 🔐 Configuration des Variables d'Environnement Vercel

## 📋 Vue d'ensemble
Ce guide explique comment configurer toutes les variables d'environnement nécessaires dans Vercel.

---

## 🔑 Variables Requises

### 1. DATABASE_URL (Critique)
**Description :** Connection string pour la base de données Neon PostgreSQL

**Où l'obtenir :**
1. Aller sur https://console.neon.tech
2. Sélectionner votre projet
3. Aller à "Connection strings"
4. Copier la connection string

**Format :**
```
postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
```

**Vérification :**
```bash
psql $DATABASE_URL -c "SELECT 1"
# Devrait retourner: 1
```

---

### 2. GEMINI_API_KEY (Critique)
**Description :** Clé API pour Google Gemini

**Où l'obtenir :**
1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Cliquer sur "Create API Key"
4. Copier la clé

**Format :**
```
AIzaSyD...
```

**Vérification :**
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'
```

---

### 3. RESEND_API_KEY (Critique)
**Description :** Clé API pour le service email Resend

**Où l'obtenir :**
1. Aller sur https://resend.com
2. S'inscrire ou se connecter
3. Aller à "API Keys"
4. Cliquer sur "Create API Key"
5. Copier la clé

**Format :**
```
re_xxxxxxxxxxxxxxxxxxxxx
```

**Vérification :**
```bash
curl -X GET "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

---

### 4. ADMIN_EMAIL (Critique)
**Description :** Email pour recevoir les notifications de commandes

**Format :**
```
admin@example.com
```

**Vérification :**
- Doit être une adresse email valide
- Doit être accessible pour recevoir les emails

---

### 5. RESEND_EMAIL_FROM (Critique)
**Description :** Adresse email d'envoi (doit être autorisée dans Resend)

**Options :**
- **Pour tester :** `onboarding@resend.dev` (fonctionne immédiatement)
- **Pour la production :** Votre domaine personnalisé (ex: `noreply@example.com`)

**Format :**
```
noreply@example.com
```

**Vérification :**
- Doit être autorisée dans le dashboard Resend
- Doit être un domaine vérifié

---

### 6. ADMIN_API_KEY (Critique - Sécurité)
**Description :** Clé API pour les endpoints admin

**Comment générer :**
```bash
openssl rand -hex 32
```

**Format :**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Utilisation :**
- Inclure dans les headers des requêtes admin
- Exemple : `Authorization: Bearer $ADMIN_API_KEY`

---

### 7. INTERNAL_API_KEY (Critique - Sécurité)
**Description :** Clé API pour les communications internes

**Comment générer :**
```bash
openssl rand -hex 32
```

**Format :**
```
z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4
```

**Utilisation :**
- Utilisée pour les appels API internes
- Doit être gardée secrète

---

### 8. ENCRYPTION_KEY (Critique - Sécurité)
**Description :** Clé pour chiffrer les données sensibles

**Comment générer :**
```bash
openssl rand -hex 32
```

**Format :**
```
f1e2d3c4b5a6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Utilisation :**
- Chiffrement des données sensibles
- Ne jamais changer après le déploiement (les données ne pourront pas être déchiffrées)

---

### 9. NODE_ENV (Critique)
**Description :** Environnement Node.js

**Valeur :**
```
production
```

**Vérification :**
```bash
echo $NODE_ENV
# Devrait retourner: production
```

---

## 🔒 Variables Optionnelles (Sécurité)

### 10. IP_WHITELIST_ENABLED
**Description :** Activer la liste blanche d'IP

**Valeur :**
```
false  # ou true pour activer
```

---

### 11. WHITELISTED_IPS
**Description :** Liste des IPs autorisées (séparées par des virgules)

**Format :**
```
192.168.1.1,10.0.0.0/8,203.0.113.0
```

---

### 12. ALLOW_PRIVATE_IPS
**Description :** Autoriser les IPs privées

**Valeur :**
```
true  # ou false
```

---

### 13. RATE_LIMIT_WINDOW_MS
**Description :** Fenêtre de temps pour le rate limiting (en millisecondes)

**Valeur :**
```
900000  # 15 minutes
```

---

### 14. RATE_LIMIT_MAX_REQUESTS
**Description :** Nombre maximum de requêtes par fenêtre

**Valeur :**
```
100
```

---

## 📝 Procédure de Configuration dans Vercel

### Étape 1 : Accéder aux Paramètres
1. Aller sur https://vercel.com
2. Sélectionner votre projet
3. Aller à "Settings"
4. Cliquer sur "Environment Variables"

### Étape 2 : Ajouter les Variables
Pour chaque variable :

1. Cliquer sur "Add New"
2. Entrer le nom de la variable (ex: `DATABASE_URL`)
3. Entrer la valeur
4. Sélectionner les environnements :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Cliquer sur "Save"

### Étape 3 : Vérifier les Variables
1. Aller à "Deployments"
2. Cliquer sur le dernier déploiement
3. Aller à "Logs"
4. Vérifier que les variables sont chargées

---

## 🔄 Mise à Jour des Variables

### Pour Mettre à Jour une Variable
1. Aller à "Settings" → "Environment Variables"
2. Cliquer sur la variable à modifier
3. Modifier la valeur
4. Cliquer sur "Save"
5. Le prochain déploiement utilisera la nouvelle valeur

### Pour Supprimer une Variable
1. Aller à "Settings" → "Environment Variables"
2. Cliquer sur le bouton "X" à côté de la variable
3. Confirmer la suppression

---

## 🧪 Tester les Variables

### Vérifier que les Variables sont Chargées
```bash
# Dans les logs Vercel, vous devriez voir :
# ✅ DATABASE_URL loaded
# ✅ GEMINI_API_KEY loaded
# etc.
```

### Tester la Connexion à la Base de Données
```bash
curl https://votre-app.vercel.app/health
# Devrait retourner: { "status": "ok" }
```

### Tester l'API
```bash
curl https://votre-app.vercel.app/api/products
# Devrait retourner un array de produits
```

---

## ⚠️ Bonnes Pratiques de Sécurité

### 1. Ne Jamais Commiter les Clés
```bash
# ❌ MAUVAIS
git add .env.production
git commit -m "Add env vars"

# ✅ BON
# Ajouter à .gitignore
echo ".env.production" >> .gitignore
```

### 2. Utiliser des Clés Fortes
```bash
# ✅ BON - 32 caractères hexadécimaux
openssl rand -hex 32

# ❌ MAUVAIS - Trop simple
ADMIN_API_KEY=password123
```

### 3. Rotation des Clés
- Changer les clés tous les 3-6 mois
- Générer une nouvelle clé avant de supprimer l'ancienne
- Mettre à jour les deux clés dans Vercel

### 4. Monitoring
- Vérifier régulièrement les logs
- Configurer les alertes pour les erreurs
- Surveiller l'utilisation des API

---

## 🆘 Dépannage

### Erreur : "Variable not found"
**Solution :**
1. Vérifier que la variable est définie dans Vercel
2. Vérifier l'orthographe exacte
3. Vérifier que l'environnement est sélectionné
4. Redéployer après avoir ajouté la variable

### Erreur : "Invalid API key"
**Solution :**
1. Vérifier que la clé est correcte
2. Vérifier que la clé n'a pas expiré
3. Vérifier que la clé est active dans le service
4. Générer une nouvelle clé si nécessaire

### Erreur : "Database connection failed"
**Solution :**
1. Vérifier que `DATABASE_URL` est correct
2. Vérifier que la base de données Neon est en ligne
3. Vérifier que `sslmode=require` est dans l'URL
4. Tester la connexion localement

### Erreur : "Email not sending"
**Solution :**
1. Vérifier que `RESEND_API_KEY` est correct
2. Vérifier que `RESEND_EMAIL_FROM` est autorisé
3. Vérifier que `ADMIN_EMAIL` est valide
4. Vérifier les logs Resend

---

## 📊 Checklist de Configuration

- [ ] DATABASE_URL configurée et testée
- [ ] GEMINI_API_KEY configurée et testée
- [ ] RESEND_API_KEY configurée et testée
- [ ] ADMIN_EMAIL configuré
- [ ] RESEND_EMAIL_FROM configuré
- [ ] ADMIN_API_KEY générée et configurée
- [ ] INTERNAL_API_KEY générée et configurée
- [ ] ENCRYPTION_KEY générée et configurée
- [ ] NODE_ENV défini à "production"
- [ ] Toutes les variables sélectionnées pour Production
- [ ] Déploiement réussi
- [ ] Health check fonctionne
- [ ] API fonctionne
- [ ] Emails s'envoient

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs/environment-variables
- Neon Docs: https://neon.tech/docs
- Resend Docs: https://resend.com/docs
- Gemini Docs: https://ai.google.dev/docs

