# Menu Hamburger Admin - Mobile

## Fonctionnalités

Le panneau admin dispose maintenant d'un menu hamburger pour la version mobile.

### Comportement par Appareil

#### Desktop (> 1024px)
- Sidebar visible en permanence sur la gauche
- Contenu principal sur la droite
- Pas de menu hamburger

#### Tablette (640px - 1024px)
- Sidebar visible en permanence sur la gauche (réduite)
- Contenu principal sur la droite
- Pas de menu hamburger

#### Mobile (< 640px)
- **Sidebar masquée** par défaut
- **Menu hamburger** visible dans le header
- Clic sur le hamburger → Menu déroulant avec les options de navigation
- Clic sur une option → Menu se ferme automatiquement
- Contenu principal prend toute la largeur

### Structure du Menu Hamburger

```
┌─────────────────────────────────┐
│ ☰  Tableau de Bord         ✕    │  ← Header avec hamburger
├─────────────────────────────────┤
│ 📊 Tableau de bord              │  ← Menu déroulant
│ 📦 Produits                     │
│ 🛒 Commandes              [3]   │
│ ─────────────────────────────   │
│ 🚪 Quitter Admin                │
└─────────────────────────────────┘
```

### Éléments du Menu

1. **Tableau de bord** - Accès aux statistiques
2. **Produits** - Gestion des produits
3. **Commandes** - Gestion des commandes (badge "3")
4. **Quitter Admin** - Déconnexion

### Animations

- Menu déroulant : Animation fluide avec `motion.div`
- Hauteur animée : De 0 à auto
- Opacité animée : De 0 à 1
- Durée : Instantanée (très rapide)

### Comportement Interactif

1. **Ouverture du menu**
   - Clic sur l'icône hamburger (☰)
   - `isMobileMenuOpen` passe à `true`
   - Menu déroulant s'affiche

2. **Sélection d'une option**
   - Clic sur une option de navigation
   - Onglet actif change
   - Menu se ferme automatiquement
   - `isMobileMenuOpen` passe à `false`

3. **Fermeture du menu**
   - Clic sur une option (fermeture auto)
   - Clic sur le X (ferme le panneau entier)
   - Clic en dehors (ne ferme pas, car le menu est dans le panneau)

### Code Clé

```typescript
// État du menu mobile
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Bouton hamburger dans le header
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition"
>
  <Menu size={20} />
</button>

// Menu déroulant
{isMobileMenuOpen && (
  <motion.div className="sm:hidden border-b border-white/5 bg-white/5">
    {/* Options de navigation */}
  </motion.div>
)}
```

### Avantages

✅ Économise l'espace sur mobile
✅ Navigation claire et intuitive
✅ Fermeture automatique après sélection
✅ Animations fluides
✅ Responsive et accessible
✅ Cohérent avec les standards mobiles

### Testage Recommandé

1. **iPhone 12/13** (390px) - Menu hamburger visible
2. **iPhone SE** (375px) - Menu hamburger visible
3. **iPad** (768px) - Sidebar visible (pas de hamburger)
4. **Desktop** (1920px+) - Sidebar visible (pas de hamburger)

### Améliorations Futures

- Ajouter des gestes tactiles (swipe pour ouvrir/fermer)
- Ajouter des icônes animées pour le hamburger
- Ajouter des transitions de page
- Ajouter des raccourcis clavier
