# 📚 Index des Tests

## 🎯 Tests Disponibles

### 1. Test Complet du Flux E-Commerce ⭐ **NOUVEAU**
**Fichier :** `test-complete-flow.ts`

Teste l'ensemble du flux e-commerce :
- ✅ Ajouter des produits depuis l'admin
- ✅ Tester l'achat d'un produit
- ✅ Tester la confirmation avec email
- ✅ Mettre à jour le statut de la commande
- ✅ Récupérer toutes les commandes

**Exécution :**
```bash
npm run test:complete-flow
```

**Documentation :** `TEST_COMPLETE_FLOW.md`

---

### 2. Test de Base de Données
**Fichier :** `test-database.ts`

Teste la connexion et les opérations de base de données.

**Exécution :**
```bash
npm run test:db
```

---

### 3. Test d'Email
**Fichier :** `test-email.ts`

Teste l'envoi d'emails via Resend.

**Exécution :**
```bash
npx ts-node test-email.ts
```

---

### 4. Test de Déploiement Vercel
**Fichier :** `test-vercel-deployment.ts`

Teste la configuration de déploiement Vercel.

**Exécution :**
```bash
npx ts-node test-vercel-deployment.ts
```

---

### 5. Test de Démo Base de Données
**Fichier :** `test-database-demo.ts`

Démo des opérations de base de données.

**Exécution :**
```bash
npx ts-node test-database-demo.ts
```

---

## 📖 Documentation

### Guides Rapides
- **`QUICK_TEST.md`** - Exécution en 3 étapes
- **`.kiro/TEST_GUIDE.md`** - Guide détaillé

### Documentation Complète
- **`TEST_COMPLETE_FLOW.md`** - Documentation du test complet
- **`.kiro/TEST_SUMMARY.md`** - Résumé des tests créés
- **`.kiro/TEST_CI_CD_INTEGRATION.md`** - Intégration CI/CD

### Index
- **`.kiro/TESTS_INDEX.md`** - Ce fichier

---

## 🚀 Démarrage Rapide

### Étape 1 : Vérifier l'environnement
```bash
cat .env.local
```

### Étape 2 : Exécuter le test complet
```bash
npm run test:complete-flow
```

### Étape 3 : Vérifier les résultats
```
✓ 3/3 produits ajoutés
✓ Commande créée avec succès
✓ Email de confirmation envoyé
✓ Statut mis à jour
✓ Commandes récupérées
```

---

## 📊 Résumé des Tests

| Test | Fichier | Commande | Durée |
|------|---------|----------|-------|
| Complet | `test-complete-flow.ts` | `npm run test:complete-flow` | ~5s |
| Base de données | `test-database.ts` | `npm run test:db` | ~2s |
| Email | `test-email.ts` | `npx ts-node test-email.ts` | ~3s |
| Déploiement | `test-vercel-deployment.ts` | `npx ts-node test-vercel-deployment.ts` | ~2s |
| Démo | `test-database-demo.ts` | `npx ts-node test-database-demo.ts` | ~3s |

---

## 🔧 Configuration

### Variables d'environnement requises
```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
```

### Dépendances
- Node.js 18+
- npm ou yarn
- TypeScript
- tsx ou ts-node

---

## 📝 Scripts npm

```json
{
  "scripts": {
    "test:complete-flow": "tsx test-complete-flow.ts",
    "test:db": "tsx test-database.ts"
  }
}
```

---

## 🎯 Cas d'usage

### Avant le déploiement
```bash
npm run test:complete-flow
npm run test:db
```

### Pendant le développement
```bash
npm run test:db
```

### Après le déploiement
```bash
npm run test:complete-flow
```

### En CI/CD
```bash
npm run test:complete-flow
npm run test:db
```

---

## 🐛 Dépannage

### Erreur : DATABASE_URL n'est pas défini
```bash
echo "DATABASE_URL=postgresql://..." >> .env.local
```

### Erreur : Connexion refusée
```bash
npm run test:db
```

### Erreur : Email non envoyé
- Vérifier `RESEND_API_KEY` dans `.env.local`
- Vérifier que la clé est valide

---

## 📚 Ressources

- [Documentation Complète](TEST_COMPLETE_FLOW.md)
- [Guide Rapide](QUICK_TEST.md)
- [Guide Détaillé](.kiro/TEST_GUIDE.md)
- [Intégration CI/CD](.kiro/TEST_CI_CD_INTEGRATION.md)

---

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] npm installé
- [ ] Test complet exécuté
- [ ] Résultats vérifiés
- [ ] Produits visibles dans l'admin
- [ ] Commandes visibles dans le dashboard
- [ ] Emails reçus

---

## 🎓 Prochaines étapes

1. Exécuter le test complet
2. Vérifier les résultats
3. Tester depuis l'interface utilisateur
4. Déployer en production
5. Monitorer les logs

---

**Dernière mise à jour :** 2026-02-22
**Version :** 1.0.0
