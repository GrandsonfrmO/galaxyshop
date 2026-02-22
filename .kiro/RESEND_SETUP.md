# 📧 Configuration Resend Email Service

## 🚀 Démarrage Rapide

### 1. Créer un Compte Resend

1. Aller sur [resend.com](https://resend.com)
2. Cliquer sur "Sign Up"
3. S'inscrire avec GitHub ou Email
4. Vérifier votre email

### 2. Obtenir la Clé API

1. Dans le dashboard Resend, aller à "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (format: `re_xxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Configurer `.env.local`

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Tester l'Envoi d'Email

```bash
npx ts-node test-email.ts
```

---

## 📧 Fonctionnalités Disponibles

### 1. Welcome Email
Envoyé quand un nouvel utilisateur s'inscrit

```typescript
import { sendWelcomeEmail } from '@/services/email';

await sendWelcomeEmail('user@example.com', 'John Doe');
```

### 2. Order Confirmation Email
Envoyé après une commande

```typescript
import { sendOrderConfirmation } from '@/services/email';

await sendOrderConfirmation('user@example.com', {
  orderId: 12345,
  customerName: 'John Doe',
  items: [
    { name: 'Grandson Hoodie', quantity: 1, price: 350000 }
  ],
  total: 350000,
  estimatedDelivery: '2024-03-01'
});
```

### 3. Password Reset Email
Envoyé pour réinitialiser le mot de passe

```typescript
import { sendPasswordResetEmail } from '@/services/email';

await sendPasswordResetEmail(
  'user@example.com',
  'https://grandson-clothes.com/reset?token=abc123'
);
```

### 4. Shipping Notification Email
Envoyé quand la commande est expédiée

```typescript
import { sendShippingNotification } from '@/services/email';

await sendShippingNotification('user@example.com', {
  orderId: 12345,
  customerName: 'John Doe',
  trackingNumber: 'TRACK123456789',
  estimatedDelivery: '2024-03-01'
});
```

### 5. Contact Form Response Email
Envoyé après soumission du formulaire de contact

```typescript
import { sendContactFormResponse } from '@/services/email';

await sendContactFormResponse(
  'user@example.com',
  'John Doe',
  'This is my message'
);
```

---

## 🔧 Configuration Avancée

### Domaine Personnalisé

Pour utiliser votre propre domaine au lieu de `noreply@grandson-clothes.com`:

1. Aller à "Domains" dans Resend
2. Ajouter votre domaine
3. Suivre les instructions DNS
4. Modifier `EMAIL_FROM` dans `services/email.ts`

### Templates Personnalisés

Modifier les templates HTML dans `services/email.ts`:

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <!-- Votre HTML personnalisé -->
  </html>
`;
```

### Envoi en Masse

Pour envoyer des emails en masse:

```typescript
const emails = ['user1@example.com', 'user2@example.com'];

for (const email of emails) {
  await sendWelcomeEmail(email, 'User');
}
```

---

## 📊 Avantages de Resend

✅ **Facile à utiliser** - API simple et intuitive  
✅ **Fiable** - 99.9% uptime  
✅ **Rapide** - Livraison en quelques secondes  
✅ **Gratuit pour démarrer** - 100 emails/jour gratuits  
✅ **Templates** - Éditeur de templates visuel  
✅ **Analytics** - Suivi des ouvertures et clics  
✅ **Support** - Excellent support client  

---

## 🧪 Tests

### Test 1: Welcome Email
```bash
npx ts-node test-email.ts
```

Résultat attendu:
```
✅ Welcome email sent successfully
   ID: email_xxxxxxxxxxxxx
```

### Test 2: Order Confirmation
```bash
npx ts-node test-email.ts
```

Résultat attendu:
```
✅ Order confirmation email sent successfully
   ID: email_xxxxxxxxxxxxx
```

---

## 🔐 Sécurité

✅ Clé API dans `.env.local`  
✅ Ne pas commiter `.env.local` à Git  
✅ Utiliser des variables d'environnement en production  
✅ Régénérer la clé si compromise  

---

## 📚 Ressources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Templates](https://resend.com/docs/templates)
- [Resend Dashboard](https://app.resend.com)

---

## ❓ Dépannage

### Erreur: "RESEND_API_KEY not configured"

**Cause:** La clé API n'est pas définie

**Solution:**
1. Créer un compte Resend
2. Obtenir la clé API
3. Ajouter à `.env.local`

### Erreur: "Invalid API key"

**Cause:** La clé API est incorrecte

**Solution:**
1. Vérifier la clé dans le dashboard Resend
2. Copier la clé exacte
3. Redémarrer l'application

### Erreur: "Email not sent"

**Cause:** Problème d'envoi

**Solution:**
1. Vérifier l'adresse email
2. Vérifier la connexion Internet
3. Vérifier les logs Resend

---

## 🚀 Prochaines Étapes

1. ✅ Créer un compte Resend
2. ✅ Obtenir la clé API
3. ✅ Configurer `.env.local`
4. ✅ Tester l'envoi d'email
5. ✅ Intégrer dans l'application

