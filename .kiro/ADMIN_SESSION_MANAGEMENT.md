# Gestion de la Session Admin

## Vue d'Ensemble

La session admin persiste pendant 7 jours. L'utilisateur peut se déconnecter manuellement à tout moment. Après 7 jours, la déconnexion est automatique.

## Flux de Session

### 1. Connexion

```
Utilisateur clique 20 fois sur le logo (5 secondes)
         ↓
Modal de connexion s'affiche
         ↓
Utilisateur entre le mot de passe
         ↓
Validation du mot de passe
         ↓
toggleAdmin() appelé
         ↓
adminLoginTime = Date.now()
         ↓
isAdmin = true
         ↓
Session commence (7 jours)
```

### 2. Vérification de Session

```
App.tsx useEffect (toutes les minutes)
         ↓
checkAdminSession() appelé
         ↓
Calcul du temps écoulé
         ↓
Si > 7 jours :
  - isAdmin = false
  - adminLoginTime = null
  - Déconnexion automatique
```

### 3. Déconnexion Manuelle

```
Utilisateur clique "Quitter Admin"
         ↓
logoutAdmin() appelé
         ↓
isAdmin = false
         ↓
adminLoginTime = null
         ↓
Session enregistrée en base
         ↓
Panneau admin se ferme
```

## Implémentation

### Store (useStore.ts)

#### État
```typescript
isAdmin: boolean;              // Connecté ou non
adminLoginTime: number | null; // Timestamp de connexion
```

#### Actions
```typescript
toggleAdmin()        // Connexion/Déconnexion
logoutAdmin()        // Déconnexion forcée
checkAdminSession()  // Vérification de l'expiration
```

### App.tsx

#### Hook de Vérification
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    checkAdminSession();
  }, 60000); // Toutes les minutes

  return () => clearInterval(interval);
}, [checkAdminSession]);
```

### AdminPanelImproved.tsx

#### Affichage du Temps
```typescript
useEffect(() => {
  if (!isAdmin || !adminLoginTime) return;

  const updateSessionTime = () => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const elapsedTime = Date.now() - adminLoginTime;
    const timeLeft = sevenDaysInMs - elapsedTime;

    if (timeLeft <= 0) {
      setSessionTimeLeft('Expiré');
    } else {
      const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
      const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      setSessionTimeLeft(`${days}j ${hours}h ${minutes}m`);
    }
  };

  updateSessionTime();
  const interval = setInterval(updateSessionTime, 60000);

  return () => clearInterval(interval);
}, [isAdmin, adminLoginTime]);
```

## Affichage

### Sidebar (Desktop/Tablette)
```
┌─────────────────────────────┐
│ Session expire dans :        │
│ 6j 23h 45m                  │
├─────────────────────────────┤
│ [🚪 Quitter Admin]          │
└─────────────────────────────┘
```

### Menu Mobile
```
Session expire dans :
6j 23h 45m

[🚪 Quitter Admin]
```

## Durée de Session

### Défaut
- **7 jours** = 604 800 000 ms

### Calcul
```
Temps écoulé = Date.now() - adminLoginTime
Temps restant = 7 jours - Temps écoulé

Si Temps restant <= 0 :
  - Déconnexion automatique
  - isAdmin = false
```

### Format d'Affichage
```
Xj Xh Xm

Exemple:
- 6j 23h 45m (6 jours, 23 heures, 45 minutes)
- 0j 2h 30m (2 heures, 30 minutes)
- 0j 0h 5m (5 minutes)
- Expiré (session expirée)
```

## Sécurité

### Authentification
- ✅ Mot de passe : `grandson2024`
- ✅ Accès : 20 clics sur le logo en 5 secondes
- ✅ Modal de connexion sécurisée

### Persistance
- ✅ Session en mémoire (Zustand)
- ✅ Enregistrement en base de données
- ✅ Vérification automatique

### Expiration
- ✅ Vérification toutes les minutes
- ✅ Déconnexion automatique après 7 jours
- ✅ Pas de renouvellement automatique

### Audit
- ✅ Enregistrement de chaque connexion
- ✅ Enregistrement de chaque déconnexion
- ✅ Historique des sessions
- ✅ Timestamps précis

## Comportement

### Connexion
1. Utilisateur se connecte
2. `adminLoginTime` = maintenant
3. Session commence
4. Affichage : "6j 23h 59m"

### Après 1 Jour
1. Affichage : "5j 23h 59m"
2. Vérification continue

### Après 7 Jours
1. Vérification détecte l'expiration
2. `isAdmin` = false
3. `adminLoginTime` = null
4. Déconnexion automatique
5. Utilisateur redirigé

### Déconnexion Manuelle
1. Utilisateur clique "Quitter Admin"
2. `logoutAdmin()` appelé
3. Session enregistrée en base
4. Panneau admin se ferme
5. Affichage : "Quitter Admin"

## Cas d'Usage

### Cas 1 : Utilisation Normale
```
09:00 - Connexion admin
09:00 - Session : 6j 23h 59m
...
17:00 - Utilisation du panneau
...
17:30 - Clic "Quitter Admin"
17:30 - Déconnexion
```

### Cas 2 : Session Expirée
```
09:00 - Connexion admin
09:00 - Session : 6j 23h 59m
...
7 jours plus tard
09:00 - Vérification détecte l'expiration
09:00 - Déconnexion automatique
09:00 - isAdmin = false
```

### Cas 3 : Oubli de Déconnexion
```
09:00 - Connexion admin
09:00 - Session : 6j 23h 59m
...
Utilisateur ferme le navigateur
...
7 jours plus tard
- Vérification détecte l'expiration
- Déconnexion automatique
- Session enregistrée en base
```

## Améliorations Futures

- [ ] Renouvellement de session (clic = +7 jours)
- [ ] Notification avant expiration (24h, 1h)
- [ ] Confirmation avant déconnexion automatique
- [ ] Historique des sessions en admin
- [ ] Statistiques d'utilisation
- [ ] Logs d'audit détaillés
- [ ] Alertes de sécurité

## Testage

### Test 1 : Connexion
1. Cliquer 20 fois sur le logo en 5 secondes
2. Entrer le mot de passe
3. Vérifier que la session s'affiche
4. Vérifier le temps restant

### Test 2 : Déconnexion Manuelle
1. Se connecter en admin
2. Cliquer "Quitter Admin"
3. Vérifier que le panneau se ferme
4. Vérifier que isAdmin = false

### Test 3 : Vérification de Session
1. Se connecter en admin
2. Attendre 1 minute
3. Vérifier que le temps diminue
4. Vérifier que la vérification fonctionne

### Test 4 : Expiration (Simulation)
1. Modifier adminLoginTime pour simuler 7 jours
2. Attendre la vérification
3. Vérifier la déconnexion automatique

---

**Version** : 1.0
**Date** : 2026-02-21
**Statut** : ✅ Complet
