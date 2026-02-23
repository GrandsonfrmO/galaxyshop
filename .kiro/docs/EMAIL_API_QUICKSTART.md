# Email API - Quick Start

## ⚡ Démarrage Rapide

### 1. Configuration (2 minutes)

Ajouter à `.env.local`:
```env
RESEND_API_KEY=your_api_key_here
RESEND_EMAIL_FROM=your-email@example.com
```

### 2. Tester les Endpoints (5 minutes)

#### Option A: VS Code REST Client
1. Ouvrir `tests/email-api.rest`
2. Cliquer sur "Send Request" pour chaque endpoint

#### Option B: cURL
```bash
# Test simple
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```

#### Option C: Vitest
```bash
npm run test -- tests/email-api.test.ts
```

### 3. Utiliser dans votre Code (5 minutes)

```javascript
// Envoyer un email
const response = await fetch('/api/email/welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
});

const data = await response.json();
console.log(data); // { success: true, result: {...} }
```

---

## 📋 Les 5 Endpoints

| Endpoint | Méthode | Paramètres |
|----------|---------|-----------|
| `/api/email/welcome` | POST | `email`, `name` |
| `/api/email/order-confirmation` | POST | `order`, `items` |
| `/api/email/password-reset` | POST | `email`, `resetLink` |
| `/api/email/shipping-notification` | POST | `email`, `orderData` |
| `/api/email/contact-response` | POST | `email`, `name`, `message` |

---

## 🎯 Cas d'Usage Courants

### Envoyer un Email de Bienvenue
```javascript
await fetch('/api/email/welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
});
```

### Envoyer une Confirmation de Commande
```javascript
await fetch('/api/email/order-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order: {
      id: 1,
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      subtotal: 50000,
      delivery_fee: 5000,
      total_amount: 55000,
      delivery_zone: 'Conakry',
      shipping_address: '123 Main St'
    },
    items: [
      {
        productName: 'T-Shirt',
        quantity: 2,
        priceAtPurchase: 25000
      }
    ]
  })
});
```

### Envoyer un Lien de Réinitialisation
```javascript
await fetch('/api/email/password-reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    resetLink: 'https://grandson-clothes.com/reset?token=abc123'
  })
});
```

### Envoyer une Notification d'Expédition
```javascript
await fetch('/api/email/shipping-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    orderData: {
      orderId: 1,
      customerName: 'John Doe',
      trackingNumber: 'TRACK123456789',
      estimatedDelivery: '2024-02-25'
    }
  })
});
```

### Envoyer une Réponse de Contact
```javascript
await fetch('/api/email/contact-response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    message: 'Thank you for contacting us'
  })
});
```

---

## ✅ Codes de Réponse

| Code | Signification |
|------|---------------|
| 200 | ✅ Email envoyé |
| 400 | ❌ Champs manquants |
| 500 | ❌ Erreur serveur |

---

## 🐛 Dépannage

### Erreur: "Email and name are required"
→ Vérifier que `email` et `name` sont présents dans le body

### Erreur: "Failed to send email"
→ Vérifier que `RESEND_API_KEY` est configuré dans `.env.local`

### Erreur: "Unknown email endpoint"
→ Vérifier l'URL de l'endpoint (typo?)

---

## 📚 Documentation Complète

- **Détails complets**: `.kiro/docs/EMAIL_API.md`
- **Intégration**: `.kiro/docs/EMAIL_API_INTEGRATION.md`
- **Référence complète**: `.kiro/docs/EMAIL_API_COMPLETE.md`

---

## 🚀 Prêt à Commencer?

1. ✅ Configurer `.env.local`
2. ✅ Tester avec `tests/email-api.rest`
3. ✅ Intégrer dans votre code
4. ✅ Consulter la documentation si besoin

C'est tout! 🎉
