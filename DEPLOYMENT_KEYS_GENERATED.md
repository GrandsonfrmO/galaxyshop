# 🔑 CLÉS DE SÉCURITÉ GÉNÉRÉES

**Date**: 23 février 2026  
**Status**: ✅ Clés générées et `.env.production` créé

---

## 🔐 CLÉS GÉNÉRÉES

Vos clés de sécurité ont été générées avec succès :

```
ADMIN_API_KEY=5a98b5f6c4e591f4fad284931ccd22c647814243eb31bea101556baca2011f01
INTERNAL_API_KEY=dedda7763228faac013e1dbc0ee4b6caac8db2d115c46e16d927757a99eb8170
ENCRYPTION_KEY=5bf6f712a4ff1727e4eeb240e7c9b72be694cf58e163f13345dd9d37577f3b64
```

**⚠️ IMPORTANT**: Sauvegarder ces clés dans un gestionnaire de mots de passe !

---

## 📝 FICHIER `.env.production` CRÉÉ

Le fichier `.env.production` a été créé avec les clés générées.

**À FAIRE MAINTENANT** :

1. Remplacer les valeurs TODO :
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   GEMINI_API_KEY=AIzaSyDxxx_REPLACE_WITH_YOUR_GEMINI_KEY
   RESEND_API_KEY=re_REPLACE_WITH_YOUR_RESEND_KEY
   ADMIN_EMAIL=admin@votredomaine.com
   RESEND_EMAIL_FROM=noreply@votredomaine.com
   ```

2. Ajouter `.env.production` à `.gitignore` :
   ```bash
   echo ".env.production" >> .gitignore
   ```

---

## 🗄️ ÉTAPE SUIVANTE : CONFIGURER NEON

### 1. Créer une base de données Neon

1. Aller sur https://console.neon.tech
2. Cliquer sur "New Project"
3. Donner un nom : `boutique-production`
4. Sélectionner la région : `US East`
5. Cliquer sur "Create Project"

### 2. Copier la connection string

1. Dans le dashboard Neon, aller à "Connection strings"
2. Copier la connection string
3. Remplacer dans `.env.production` :
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

### 3. Exécuter les migrations

```bash
# Remplacer par votre URL Neon
DATABASE_URL="postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" npm run db:migrate
```

### 4. Vérifier les tables

```bash
psql "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require" -c "\dt"
```

---

## 📧 ÉTAPE SUIVANTE : CONFIGURER RESEND

### 1. Créer un compte Resend

1. Aller sur https://resend.com
2. Cliquer sur "Sign Up"
3. S'inscrire avec votre email

### 2. Obtenir la clé API

1. Dans le dashboard Resend, aller à "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (elle commence par `re_`)
4. Remplacer dans `.env.production` :
   ```env
   RESEND_API_KEY=re_votre_clé_ici
   ```

### 3. Configurer le domaine email

**Option A: Utiliser le domaine de test (Rapide)**
```env
RESEND_EMAIL_FROM=onboarding@resend.dev
```

**Option B: Utiliser votre domaine (Production)**
1. Dans Resend, aller à "Domains"
2. Cliquer sur "Add Domain"
3. Entrer votre domaine
4. Suivre les instructions pour configurer les DNS
5. Vérifier le domaine
6. Utiliser dans `.env.production` :
   ```env
   RESEND_EMAIL_FROM=noreply@votredomaine.com
   ```

---

## 🤖 ÉTAPE SUIVANTE : CONFIGURER GEMINI

### 1. Créer une clé Gemini

1. Aller sur https://ai.google.dev/
2. Cliquer sur "Get API Key"
3. Cliquer sur "Create API Key"
4. Copier la clé
5. Remplacer dans `.env.production` :
   ```env
   GEMINI_API_KEY=AIzaSyDxxx_votre_clé_ici
   ```

---

## ✅ CHECKLIST

- [x] Clés de sécurité générées
- [x] `.env.production` créé
- [ ] Ajouter `.env.production` à `.gitignore`
- [ ] Créer base Neon production
- [ ] Copier connection string Neon
- [ ] Exécuter migrations
- [ ] Configurer Resend
- [ ] Configurer Gemini
- [ ] Remplir les valeurs TODO dans `.env.production`
- [ ] Tester localement
- [ ] Pousser sur GitHub
- [ ] Créer projet Vercel
- [ ] Ajouter variables à Vercel
- [ ] Déployer

---

## 🚀 PROCHAINES ÉTAPES

1. **Maintenant** : Ajouter `.env.production` à `.gitignore`
2. **Ensuite** : Configurer Neon production
3. **Puis** : Configurer Resend et Gemini
4. **Enfin** : Tester localement et déployer

---

*Clés générées le 23 février 2026*
