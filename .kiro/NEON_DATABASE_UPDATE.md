# Mise à Jour Base de Données Neon

## Modifications Apportées

### 1. Nouvelles Tables

#### Table: delivery_zones
Stocke les zones de livraison et leurs prix.

```sql
CREATE TABLE delivery_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Colonnes**
- `id` : Identifiant unique (clé primaire)
- `name` : Nom de la zone (Ex: Conakry, Kindia, Mamou)
- `price` : Prix de livraison en GNF
- `created_at` : Date de création
- `updated_at` : Date de dernière modification

**Index**
- `idx_delivery_zones_name` : Index sur le nom pour recherche rapide

**Données Prédéfinies**
```
1. Conakry - 5 000 GNF
2. Kindia - 8 000 GNF
3. Mamou - 10 000 GNF
```

#### Table: admin_sessions
Enregistre les sessions d'administration pour audit et sécurité.

```sql
CREATE TABLE admin_sessions (
  id SERIAL PRIMARY KEY,
  login_time TIMESTAMP NOT NULL,
  logout_time TIMESTAMP,
  session_duration_days INTEGER DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Colonnes**
- `id` : Identifiant unique (clé primaire)
- `login_time` : Heure de connexion
- `logout_time` : Heure de déconnexion (NULL si session active)
- `session_duration_days` : Durée de la session en jours (défaut: 7)
- `created_at` : Date de création de l'enregistrement

**Index**
- `idx_admin_sessions_login_time` : Index sur login_time pour recherche rapide

### 2. Nouvelles Fonctions de Requête

#### Delivery Zones

**getAllDeliveryZones()**
- Récupère toutes les zones de livraison
- Triées par nom
- Retourne : Array<DeliveryZone>

**getDeliveryZoneById(id)**
- Récupère une zone par ID
- Paramètre : id (number)
- Retourne : DeliveryZone | undefined

**createDeliveryZone(name, price)**
- Crée une nouvelle zone
- Paramètres : name (string), price (number)
- Retourne : DeliveryZone créée

**updateDeliveryZone(id, name, price)**
- Met à jour une zone
- Paramètres : id (number), name (string), price (number)
- Retourne : DeliveryZone mise à jour

**deleteDeliveryZone(id)**
- Supprime une zone
- Paramètre : id (number)
- Retourne : DeliveryZone supprimée

#### Admin Sessions

**createAdminSession(sessionDurationDays)**
- Crée une nouvelle session admin
- Paramètre : sessionDurationDays (number, défaut: 7)
- Retourne : AdminSession créée

**endAdminSession(sessionId)**
- Termine une session admin
- Paramètre : sessionId (number)
- Retourne : AdminSession mise à jour

**getActiveSessions()**
- Récupère toutes les sessions actives
- Retourne : Array<AdminSession>

**getSessionHistory(limit)**
- Récupère l'historique des sessions
- Paramètre : limit (number, défaut: 50)
- Retourne : Array<AdminSession>

**getExpiredSessions()**
- Récupère les sessions expirées
- Retourne : Array<AdminSession>

### 3. Intégration Frontend

#### Store (Zustand)
- `adminLoginTime` : Timestamp de connexion
- `toggleAdmin()` : Enregistre le timestamp lors de la connexion
- `logoutAdmin()` : Déconnecte et réinitialise
- `checkAdminSession()` : Vérifie si la session a expiré (7 jours)

#### App.tsx
- Hook `useEffect` qui vérifie la session toutes les minutes
- Déconnexion automatique après 7 jours

#### AdminPanelImproved.tsx
- Affichage du temps restant dans la session
- Format : "Xj Xh Xm" (jours, heures, minutes)
- Mise à jour toutes les minutes

### 4. Flux de Sécurité

#### Connexion Admin
1. Utilisateur clique 20 fois sur le logo en 5 secondes
2. Modal de connexion s'affiche
3. Utilisateur entre le mot de passe
4. `toggleAdmin()` est appelé
5. `adminLoginTime` est défini à `Date.now()`
6. Session commence (7 jours)

#### Vérification de Session
1. App.tsx vérifie toutes les minutes
2. `checkAdminSession()` calcule le temps écoulé
3. Si > 7 jours : déconnexion automatique
4. `isAdmin` passe à false
5. `adminLoginTime` est réinitialisé

#### Déconnexion Manuelle
1. Utilisateur clique sur "Quitter Admin"
2. `logoutAdmin()` est appelé
3. `isAdmin` passe à false
4. `adminLoginTime` est réinitialisé
5. Session enregistrée en base de données

### 5. Données Stockées

#### Zones de Livraison
```typescript
interface DeliveryZone {
  id: number;
  name: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}
```

#### Sessions Admin
```typescript
interface AdminSession {
  id: number;
  login_time: Date;
  logout_time: Date | null;
  session_duration_days: number;
  created_at: Date;
}
```

### 6. Sécurité

#### Authentification
- ✅ Mot de passe : `grandson2024`
- ✅ Accès : 20 clics sur le logo en 5 secondes
- ✅ Session : 7 jours maximum

#### Audit
- ✅ Enregistrement de chaque connexion
- ✅ Enregistrement de chaque déconnexion
- ✅ Historique des sessions
- ✅ Détection des sessions expirées

#### Validation
- ✅ Zones : nom unique, prix > 0
- ✅ Sessions : durée validée
- ✅ Timestamps : vérifiés automatiquement

### 7. Migration

#### Exécution
```bash
# Appliquer la migration
npm run migrate

# Ou manuellement
psql -U user -d grandson_db -f services/migrations.sql
```

#### Vérification
```sql
-- Vérifier les tables
SELECT * FROM delivery_zones;
SELECT * FROM admin_sessions;

-- Vérifier les données
SELECT COUNT(*) FROM delivery_zones;
SELECT COUNT(*) FROM admin_sessions;
```

### 8. Utilisation

#### Ajouter une Zone
```typescript
import { createDeliveryZone } from './services/queries';

const zone = await createDeliveryZone('Labé', 12000);
```

#### Récupérer les Zones
```typescript
import { getAllDeliveryZones } from './services/queries';

const zones = await getAllDeliveryZones();
```

#### Enregistrer une Session
```typescript
import { createAdminSession } from './services/queries';

const session = await createAdminSession(7);
```

#### Terminer une Session
```typescript
import { endAdminSession } from './services/queries';

await endAdminSession(sessionId);
```

### 9. Améliorations Futures

- [ ] Intégration avec le système de commandes
- [ ] Calcul automatique du prix total avec livraison
- [ ] Zones par région/pays
- [ ] Délais de livraison par zone
- [ ] Notifications de session expirée
- [ ] Logs d'audit détaillés
- [ ] Statistiques d'utilisation

### 10. Testage

#### Zones de Livraison
1. Vérifier que les 3 zones prédéfinies sont créées
2. Ajouter une nouvelle zone
3. Modifier une zone
4. Supprimer une zone
5. Vérifier les données en base

#### Sessions Admin
1. Se connecter en admin
2. Vérifier que la session est enregistrée
3. Se déconnecter
4. Vérifier que la déconnexion est enregistrée
5. Vérifier l'historique des sessions

---

**Version** : 1.0
**Date** : 2026-02-21
**Statut** : ✅ Complet
