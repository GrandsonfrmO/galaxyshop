# Guide de Test Complet du Flux E-Commerce

## 🎯 Objectif

Tester l'ensemble du flux e-commerce :
1. ✅ Ajouter des produits depuis l'admin
2. ✅ Tester l'achat d'un produit
3. ✅ Tester la confirmation avec email
4. ✅ Mettre à jour le statut de la commande
5. ✅ Récupérer toutes les commandes

## 🚀 Démarrage rapide

### Étape 1 : Vérifier les variables d'environnement

```bash
# Vérifier que .env.local contient :
cat .env.local
```

Vous devez avoir :
```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
```

### Étape 2 : Exécuter le test

```bash
# Option 1 : Avec npm (recommandé)
npm run test:complete-flow

# Option 2 : Avec tsx directement
npx tsx test-complete-flow.ts

# Option 3 : Avec ts-node
npx ts-node test-complete-flow.ts
```

## 📊 Résultats du test

Le test affichera un rapport détaillé avec :

```
✓ Produits ajoutés avec succès
✓ Utilisateur créé
✓ Commande créée
✓ Email envoyé
✓ Statut mis à jour
✓ Commandes récupérées
```

## 🔍 Détails de chaque test

### Test 1 : Ajouter des produits
- Crée 3 produits de test
- Vérifie l'insertion en base de données
- Retourne les IDs des produits créés

**Produits créés :**
- Neon Jacket (199.99 $)
- Holographic Sneakers (149.99 $)
- Cyber Sunglasses (299.99 $)

### Test 2 : Tester l'achat
- Crée un utilisateur client
- Crée une commande
- Ajoute des articles à la commande
- Vérifie les détails de la commande

**Données de test :**
- Email : test@example.com
- Nom : Test Customer
- Quantité : 2
- Montant : Calculé automatiquement

### Test 3 : Tester l'email
- Envoie un email de confirmation
- Utilise l'API Resend
- Affiche le statut de l'envoi

**Email envoyé à :** test@example.com

### Test 4 : Mettre à jour le statut
- Change le statut de "pending" à "confirmed"
- Vérifie la mise à jour

### Test 5 : Récupérer les commandes
- Récupère toutes les commandes
- Affiche les détails complets

## 🐛 Dépannage

### Erreur : DATABASE_URL n'est pas défini

```bash
# Vérifier le fichier .env.local
cat .env.local

# Si vide, ajouter :
echo "DATABASE_URL=postgresql://..." >> .env.local
```

### Erreur : Connexion refusée

```bash
# Vérifier que la base de données est accessible
npm run test:db

# Vérifier l'URL de connexion
echo $DATABASE_URL
```

### Erreur : Email non envoyé

- Vérifier que `RESEND_API_KEY` est défini
- Vérifier que la clé API est valide
- Vérifier les logs de Resend

### Erreur : Table non trouvée

```bash
# Exécuter les migrations
npm run migrate

# Vérifier les migrations
npm run migrate:check
```

## 📝 Fichiers créés

| Fichier | Description |
|---------|-------------|
| `test-complete-flow.ts` | Test principal |
| `run-complete-test.sh` | Script bash |
| `TEST_COMPLETE_FLOW.md` | Documentation |
| `.kiro/TEST_GUIDE.md` | Ce guide |

## 🔧 Configuration avancée

### Modifier les données de test

Éditer `test-complete-flow.ts` et modifier le tableau `testProducts` :

```typescript
const testProducts: Product[] = [
  {
    name: 'Votre produit',
    description: 'Description',
    price: 99.99,
    // ...
  },
];
```

### Ajouter plus de tests

Ajouter une nouvelle fonction de test :

```typescript
async function testMyFeature() {
  log('\n=== MON TEST ===', 'blue');
  // Votre code de test
}
```

Puis l'appeler dans `runAllTests()`.

## ✅ Checklist avant le déploiement

- [ ] Test complet exécuté avec succès
- [ ] Produits visibles dans l'admin
- [ ] Commandes visibles dans le dashboard
- [ ] Emails reçus correctement
- [ ] Statuts mis à jour correctement
- [ ] Pas d'erreurs dans les logs

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs : `npm run test:db`
2. Vérifier les variables d'environnement
3. Vérifier la connexion à la base de données
4. Vérifier la clé API Resend

## 🎓 Prochaines étapes

Après le test :

1. Tester depuis l'interface utilisateur
2. Vérifier le flux complet d'achat
3. Vérifier les emails reçus
4. Vérifier le dashboard admin
5. Déployer en production

---

**Dernière mise à jour :** 2026-02-22
