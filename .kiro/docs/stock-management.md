# Gestion du Stock - Mise à jour

## Changements effectués

### 1. Ajout du champ Stock dans la base de données
- **Migration créée**: `services/migrations/007_add_product_stock.sql`
- Ajoute une colonne `stock` (INTEGER) à la table `products`
- Valeur par défaut: 0 (rupture de stock mais toujours commandable)
- Les produits existants sont initialisés avec un stock de 999

### 2. Mise à jour du modèle Product
- **Fichier**: `types.ts`
- Ajout du champ optionnel `stock?: number`
- Commentaire: "Quantité en stock (0 = rupture mais toujours commandable)"

### 3. Mise à jour des services
- **Fichier**: `services/productService.ts`
- Toutes les fonctions retournent maintenant le champ `stock`
  - `getAllProducts()`
  - `searchProducts()`
  - `getDisplayProducts()`
  - `addProduct()` - inclut le stock lors de l'insertion
  - `updateProduct()` - inclut le stock lors de la mise à jour

### 4. Interface Admin améliorée
- **Fichier**: `ui/AdminPanelImproved.tsx`
- Ajout d'un champ "Stock Disponible" dans le formulaire d'édition
- Affichage du stock dans la liste des produits (avec code couleur)
  - 🟢 Vert si stock > 0
  - 🔴 Rouge si stock = 0
- Message dynamique dans le formulaire:
  - "⚠️ Rupture de stock (toujours commandable)" si stock = 0
  - "✅ X unités disponibles" si stock > 0

## Comportement

### Commandes
- ✅ Les commandes ne disparaissent JAMAIS (elles sont stockées dans la table `orders`)
- ✅ Les produits peuvent être commandés même si le stock est à 0
- ✅ Le stock est affiché mais n'empêche pas les commandes

### Gestion du stock
- L'admin peut définir le stock pour chaque produit
- Le stock peut être mis à 0 pour indiquer une rupture
- Les clients peuvent toujours commander même en rupture de stock
- C'est à l'admin de gérer manuellement le stock après chaque commande

## Pour exécuter la migration

```bash
npm run migrate
```

Ou redémarrer le serveur qui exécutera automatiquement les migrations au démarrage.

## Notes importantes

1. **Les commandes ne sont jamais supprimées** - elles restent dans la base de données avec tous leurs détails
2. **Le stock n'est pas automatiquement décrémenté** - c'est une gestion manuelle par l'admin
3. **Les produits en rupture restent commandables** - c'est un choix de design pour ne pas bloquer les ventes
4. **Les produits existants** ont été initialisés avec un stock de 999 unités

## Prochaines améliorations possibles

- Décrémenter automatiquement le stock lors d'une commande
- Ajouter des alertes de stock faible
- Historique des mouvements de stock
- Import/export de stock en masse
