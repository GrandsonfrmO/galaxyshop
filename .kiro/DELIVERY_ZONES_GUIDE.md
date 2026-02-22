# Guide Complet - Gestion des Zones de Livraison

## Vue d'Ensemble

La section "Zones de Livraison" permet de gérer les zones de livraison et leurs prix associés.

## Accès à la Section

### Sur Desktop/Tablette
1. Cliquer sur le bouton violet (⚙️) en bas à droite
2. Cliquer sur "Zones de livraison" dans la sidebar

### Sur Mobile
1. Cliquer sur le bouton violet (⚙️) en bas à droite
2. Cliquer sur le hamburger (☰) en haut à gauche
3. Cliquer sur "Zones de livraison"

## Interface

```
┌─────────────────────────────────────────┐
│ 🚚 Zones de Livraison    [Ajouter Zone] │
├─────────────────────────────────────────┤
│ Total de zones : 3                      │
├─────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐     │
│ │ Conakry      │  │ Kindia       │     │
│ │ Prix de liv. │  │ Prix de liv. │     │
│ │ 5 000 GNF    │  │ 8 000 GNF    │     │
│ │ [Modifier]   │  │ [Modifier]   │     │
│ │ [Supprimer]  │  │ [Supprimer]  │     │
│ └──────────────┘  └──────────────┘     │
│ ┌──────────────┐                       │
│ │ Mamou        │                       │
│ │ Prix de liv. │                       │
│ │ 10 000 GNF   │                       │
│ │ [Modifier]   │                       │
│ │ [Supprimer]  │                       │
│ └──────────────┘                       │
└─────────────────────────────────────────┘
```

## Opérations

### 1. AJOUTER UNE ZONE

**Étapes**
1. Cliquer sur "Ajouter Zone"
2. Remplir le formulaire :
   - Nom : Ex: Conakry, Kindia, Mamou
   - Prix : Ex: 5000, 8000, 10000
3. Vérifier l'aperçu
4. Cliquer sur "Sauvegarder"

**Résultat**
- Zone ajoutée à la liste
- Compteur augmente
- Zone visible immédiatement

### 2. MODIFIER UNE ZONE

**Étapes**
1. Cliquer sur "Modifier" sur une zone
2. Modifier le nom et/ou le prix
3. Vérifier l'aperçu
4. Cliquer sur "Sauvegarder"

**Résultat**
- Zone mise à jour
- Changements visibles immédiatement
- Compteur inchangé

### 3. SUPPRIMER UNE ZONE

**Étapes**
1. Cliquer sur "Supprimer" sur une zone
2. Lire la confirmation
3. Cliquer sur "Supprimer" pour confirmer
4. OU cliquer sur "Annuler" pour annuler

**Résultat**
- Zone supprimée de la liste
- Compteur diminue
- Zone disparaît immédiatement

## Modals

### Modal d'Édition

```
┌─────────────────────────────────┐
│ Zone de Livraison           [X] │
├─────────────────────────────────┤
│ Nom de la Zone                  │
│ [Conakry________________]        │
│ Entrez le nom de la zone        │
│                                 │
│ Prix de Livraison (GNF)         │
│ [5000__________________]         │
│ Entrez le prix de livraison     │
│                                 │
│ Aperçu                          │
│ ┌─────────────────────────────┐ │
│ │ Conakry      5 000 GNF      │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Sauvegarder]  [Annuler]        │
└─────────────────────────────────┘
```

### Modal de Confirmation

```
┌─────────────────────────────────┐
│ Confirmation                [X] │
├─────────────────────────────────┤
│ Êtes-vous sûr de vouloir        │
│ supprimer cette zone de         │
│ livraison ? Cette action est    │
│ irréversible.                   │
│                                 │
│ [Supprimer]  [Annuler]          │
└─────────────────────────────────┘
```

## Validation

### Champs Obligatoires
- ✅ Nom : Non vide
- ✅ Prix : Nombre positif (> 0)

### Messages d'Erreur
- "Veuillez remplir tous les champs correctement."

### Aperçu
- Affichage en temps réel
- Montre le résultat final
- Aide à vérifier avant sauvegarde

## Données

### Zones Prédéfinies
```
ID: 1, Nom: Conakry, Prix: 5 000 GNF
ID: 2, Nom: Kindia, Prix: 8 000 GNF
ID: 3, Nom: Mamou, Prix: 10 000 GNF
```

### Format de Stockage
```typescript
interface DeliveryZone {
  id: string;        // UUID unique
  name: string;      // Nom de la zone
  price: number;     // Prix en GNF
}
```

## Responsive

### Mobile (< 640px)
- Grille : 1 colonne
- Padding réduit
- Boutons empilés verticalement
- Texte redimensionné

### Tablette (640px - 1024px)
- Grille : 2 colonnes
- Padding normal
- Boutons côte à côte
- Texte normal

### Desktop (> 1024px)
- Grille : 2 colonnes
- Padding normal
- Boutons côte à côte
- Texte normal

## Conseils d'Utilisation

### Bonnes Pratiques
1. ✅ Utiliser des noms clairs et concis
2. ✅ Vérifier l'aperçu avant de sauvegarder
3. ✅ Lire la confirmation avant de supprimer
4. ✅ Tester sur mobile et desktop

### À Éviter
1. ❌ Noms vides ou trop longs
2. ❌ Prix négatifs ou zéro
3. ❌ Suppression sans confirmation
4. ❌ Doublons de zones

## Améliorations Futures

- [ ] Persistance en localStorage
- [ ] Intégration base de données
- [ ] Zones par région/pays
- [ ] Délais de livraison
- [ ] Calcul automatique du prix total
- [ ] Export/Import des zones
- [ ] Historique des modifications
- [ ] Recherche et filtrage

## Support

Pour toute question ou problème :
1. Vérifier la validation des champs
2. Vérifier la confirmation avant suppression
3. Rafraîchir la page si nécessaire
4. Contacter l'administrateur
