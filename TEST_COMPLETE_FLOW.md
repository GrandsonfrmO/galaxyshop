# Test Complet du Flux E-Commerce

Ce test couvre l'ensemble du flux e-commerce :
1. **Ajouter des produits depuis l'admin**
2. **Tester l'achat d'un produit**
3. **Tester la confirmation avec email**
4. **Mettre à jour le statut de la commande**
5. **Récupérer toutes les commandes**

## Prérequis

- Node.js et npm installés
- Variables d'environnement configurées dans `.env.local` :
  - `DATABASE_URL` : URL de connexion à la base de données Neon
  - `RESEND_API_KEY` : Clé API Resend pour l'envoi d'emails (optionnel)

## Installation

```bash
# Installer les dépendances
npm install

# Vérifier que la base de données est accessible
npm run test:db
```

## Exécution du test

### Option 1 : Avec npm
```bash
npm run test:complete-flow
```

### Option 2 : Avec ts-node directement
```bash
npx ts-node test-complete-flow.ts
```

### Option 3 : Avec le script bash (Linux/Mac)
```bash
chmod +x run-complete-test.sh
./run-complete-test.sh
```

## Résultats attendus

Le test affichera :

```
╔════════════════════════════════════════════════════════════╗
║     TEST COMPLET DU FLUX E-COMMERCE                        ║
║  1. Ajouter des produits depuis l'admin                   ║
║  2. Tester l'achat d'un produit                           ║
║  3. Tester la confirmation avec email                      ║
║  4. Mettre à jour le statut de la commande                 ║
║  5. Récupérer toutes les commandes                         ║
╚════════════════════════════════════════════════════════════╝

=== TEST 1: AJOUTER DES PRODUITS DEPUIS L'ADMIN ===
✓ Produit ajouté avec succès (ID: 1)
✓ Produit ajouté avec succès (ID: 2)
✓ Produit ajouté avec succès (ID: 3)
✓ 3/3 produits ajoutés

=== TEST 2: TESTER L'ACHAT D'UN PRODUIT ===
✓ Utilisateur créé (ID: 1)
✓ Commande créée avec succès (ID: 1)
✓ Article ajouté à la commande

=== TEST 3: TESTER LA CONFIRMATION AVEC EMAIL ===
✓ Email de confirmation envoyé avec succès

=== TEST 4: METTRE À JOUR LE STATUT DE LA COMMANDE ===
✓ Statut mis à jour avec succès

=== TEST 5: RÉCUPÉRER TOUTES LES COMMANDES ===
✓ 1 commande(s) trouvée(s)

╔════════════════════════════════════════════════════════════╗
║                  ✓ TOUS LES TESTS COMPLÉTÉS                ║
╚════════════════════════════════════════════════════════════╝
```

## Structure du test

### Test 1 : Ajouter des produits
- Crée 3 produits de test (Neon Jacket, Holographic Sneakers, Cyber Sunglasses)
- Vérifie que chaque produit est inséré correctement
- Retourne les produits créés pour les tests suivants

### Test 2 : Tester l'achat
- Crée un utilisateur client
- Crée une commande avec le premier produit
- Ajoute un article de commande avec taille et couleur
- Vérifie que la commande est créée correctement

### Test 3 : Tester l'email de confirmation
- Envoie un email de confirmation de commande
- Utilise l'API Resend pour l'envoi
- Affiche le statut de l'envoi

### Test 4 : Mettre à jour le statut
- Change le statut de la commande de "pending" à "confirmed"
- Vérifie que la mise à jour est effectuée

### Test 5 : Récupérer les commandes
- Récupère toutes les commandes de la base de données
- Affiche les détails de chaque commande

## Dépannage

### Erreur : DATABASE_URL n'est pas défini
```bash
# Vérifier que .env.local existe et contient DATABASE_URL
cat .env.local
```

### Erreur : Connexion à la base de données refusée
```bash
# Vérifier que la base de données est accessible
npm run test:db
```

### Erreur : Email non envoyé
- Vérifier que `RESEND_API_KEY` est défini dans `.env.local`
- Vérifier que la clé API est valide
- Vérifier que l'adresse email est correcte

## Fichiers créés

- `test-complete-flow.ts` : Le test principal
- `run-complete-test.sh` : Script bash pour exécuter le test
- `TEST_COMPLETE_FLOW.md` : Ce fichier

## Ajouter au package.json

Pour faciliter l'exécution, vous pouvez ajouter un script dans `package.json` :

```json
{
  "scripts": {
    "test:complete-flow": "ts-node test-complete-flow.ts"
  }
}
```

Puis exécuter avec :
```bash
npm run test:complete-flow
```

## Notes

- Le test crée des données de test dans la base de données
- Les données ne sont pas supprimées après le test (pour inspection)
- Vous pouvez nettoyer les données manuellement si nécessaire
- Le test est idempotent pour l'utilisateur (utilise ON CONFLICT)

## Prochaines étapes

Après avoir exécuté le test avec succès :

1. Vérifier que les produits sont visibles dans l'admin
2. Vérifier que les commandes sont visibles dans le dashboard
3. Vérifier que les emails sont reçus (vérifier le spam)
4. Tester le flux complet depuis l'interface utilisateur
