# 📖 Guide d'Utilisation des Tests

## 🎯 Objectif

Ce guide explique comment utiliser les tests créés pour valider le flux e-commerce complet.

## 🚀 Démarrage Rapide

### 1. Vérifier que tout est en place
```bash
npm run verify:tests
```

Vous devriez voir :
```
✓ test-complete-flow.ts
✓ TEST_COMPLETE_FLOW.md
✓ QUICK_TEST.md
✓ .kiro/TEST_GUIDE.md
✓ .kiro/TEST_SUMMARY.md
✓ .kiro/TEST_CI_CD_INTEGRATION.md
✓ .kiro/TESTS_INDEX.md
✓ DATABASE_URL défini
✓ RESEND_API_KEY défini
✓ Script test:complete-flow
✓ Script test:db
✓ TOUS LES TESTS SONT PRÊTS !
```

### 2. Exécuter le test complet
```bash
npm run test:complete-flow
```

### 3. Vérifier les résultats
```
✓ 3/3 produits ajoutés
✓ Commande créée avec succès
✓ Email de confirmation envoyé
✓ Statut mis à jour
✓ Commandes récupérées
```

## 📋 Cas d'Usage

### Avant le déploiement
```bash
# Vérifier que tout est en place
npm run verify:tests

# Exécuter le test complet
npm run test:complete-flow

# Vérifier la base de données
npm run test:db
```

### Pendant le développement
```bash
# Tester rapidement la base de données
npm run test:db

# Tester le flux complet
npm run test:complete-flow
```

### Après le déploiement
```bash
# Vérifier que tout fonctionne en production
npm run test:complete-flow
```

### En CI/CD
```bash
# Vérifier les fichiers
npm run verify:tests

# Exécuter les tests
npm run test:complete-flow
npm run test:db
```

## 🔍 Détails des Tests

### Test 1 : Ajouter des produits
**Fichier :** `test-complete-flow.ts` (fonction `testAddProducts`)

**Teste :**
- Création de 3 produits
- Insertion en base de données
- Récupération des IDs

**Produits créés :**
1. Neon Jacket - 199.99 $
2. Holographic Sneakers - 149.99 $
3. Cyber Sunglasses - 299.99 $

### Test 2 : Tester l'achat
**Fichier :** `test-complete-flow.ts` (fonction `testPurchaseProduct`)

**Teste :**
- Création d'un utilisateur
- Création d'une commande
- Ajout d'articles à la commande

**Données :**
- Email : test@example.com
- Nom : Test Customer
- Quantité : 2
- Montant : Calculé automatiquement

### Test 3 : Tester l'email
**Fichier :** `test-complete-flow.ts` (fonction `testOrderConfirmationEmail`)

**Teste :**
- Envoi d'un email de confirmation
- Utilisation de l'API Resend
- Vérification du statut

### Test 4 : Mettre à jour le statut
**Fichier :** `test-complete-flow.ts` (fonction `testUpdateOrderStatus`)

**Teste :**
- Changement du statut de "pending" à "confirmed"
- Vérification de la mise à jour

### Test 5 : Récupérer les commandes
**Fichier :** `test-complete-flow.ts` (fonction `testGetAllOrders`)

**Teste :**
- Récupération de toutes les commandes
- Affichage des détails

## 🛠️ Personnalisation

### Modifier les données de test

Éditer `test-complete-flow.ts` et modifier le tableau `testProducts` :

```typescript
const testProducts: Product[] = [
  {
    id: '',
    name: 'Votre produit',
    description: 'Description',
    price: 99.99,
    category: 'category',
    imageUrl: 'https://...',
    sizes: ['S', 'M', 'L'],
    colors: ['black', 'white'],
    position: [0, 0, 0],
  },
];
```

### Ajouter un nouveau test

1. Créer une nouvelle fonction :
```typescript
async function testMyFeature() {
  log('\n=== MON TEST ===', 'blue');
  try {
    // Votre code de test
    log(`✓ Test réussi`, 'green');
  } catch (error) {
    log(`✗ Erreur: ${error}`, 'red');
  }
}
```

2. L'appeler dans `runAllTests()` :
```typescript
async function runAllTests() {
  // ... autres tests ...
  await testMyFeature();
  // ...
}
```

### Modifier les couleurs des logs

Les couleurs disponibles sont :
- `green` : Succès
- `red` : Erreur
- `blue` : Section
- `cyan` : Détails
- `yellow` : Titre
- `reset` : Défaut

## 📊 Interprétation des Résultats

### ✓ Succès
```
✓ Produit ajouté avec succès (ID: 1)
```
Le test a réussi.

### ✗ Erreur
```
✗ Erreur lors de l'ajout du produit
```
Le test a échoué. Vérifier les logs pour plus de détails.

### ⚠️ Avertissement
```
⚠️ Avertissement: RESEND_API_KEY n'est pas défini
```
Le test peut continuer mais certaines fonctionnalités peuvent ne pas fonctionner.

## 🔧 Dépannage

### Erreur : DATABASE_URL n'est pas défini
```bash
# Vérifier le fichier .env.local
cat .env.local

# Ajouter la variable
echo "DATABASE_URL=postgresql://..." >> .env.local
```

### Erreur : Connexion refusée
```bash
# Vérifier que la base de données est accessible
npm run test:db

# Vérifier l'URL
echo $DATABASE_URL
```

### Erreur : Email non envoyé
```bash
# Vérifier la clé API
echo $RESEND_API_KEY

# Vérifier que la clé est valide
# Aller sur https://resend.com/api-keys
```

### Erreur : Table non trouvée
```bash
# Exécuter les migrations
npm run migrate

# Vérifier les migrations
npm run migrate:check
```

## 📈 Monitoring

### Vérifier les logs
```bash
# Voir les logs de la base de données
npm run test:db

# Voir les logs du test complet
npm run test:complete-flow
```

### Vérifier les données
```bash
# Vérifier les produits
psql $DATABASE_URL -c "SELECT * FROM products;"

# Vérifier les commandes
psql $DATABASE_URL -c "SELECT * FROM orders;"

# Vérifier les utilisateurs
psql $DATABASE_URL -c "SELECT * FROM users;"
```

## 🎯 Prochaines Étapes

1. **Exécuter le test** :
   ```bash
   npm run test:complete-flow
   ```

2. **Vérifier les résultats** :
   - Produits visibles dans l'admin
   - Commandes visibles dans le dashboard
   - Emails reçus

3. **Tester depuis l'interface** :
   - Ajouter un produit manuellement
   - Faire un achat
   - Vérifier la confirmation

4. **Déployer** :
   - Vérifier que tout fonctionne en production
   - Monitorer les logs

## 📚 Ressources

- [Documentation Complète](../TEST_COMPLETE_FLOW.md)
- [Guide Rapide](../QUICK_TEST.md)
- [Index des Tests](./TESTS_INDEX.md)
- [Intégration CI/CD](./TEST_CI_CD_INTEGRATION.md)

## ✅ Checklist

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] npm installé
- [ ] Test de vérification exécuté
- [ ] Test complet exécuté
- [ ] Résultats vérifiés
- [ ] Produits visibles dans l'admin
- [ ] Commandes visibles dans le dashboard
- [ ] Emails reçus

---

**Dernière mise à jour :** 2026-02-22
