# 🚀 START HERE - Email API

## ⚡ Démarrage en 5 Minutes

### Étape 1: Configuration (1 minute)

Ajouter à `.env.local`:
```env
RESEND_API_KEY=your_api_key_here
RESEND_EMAIL_FROM=your-email@example.com
```

### Étape 2: Démarrer le Serveur (1 minute)

```bash
npm run dev
```

### Étape 3: Tester (3 minutes)

#### Option A: VS Code REST Client (Recommandé)
1. Ouvrir `tests/email-api.rest`
2. Cliquer sur "Send Request" pour chaque test

#### Option B: cURL
```bash
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

#### Option C: Vitest
```bash
npm run test -- tests/email-api.test.ts
```

---

## 📧 Les 5 Endpoints

```
1. POST /api/email/welcome
   Body: { email, name }

2. POST /api/email/order-confirmation
   Body: { order, items }

3. POST /api/email/password-reset
   Body: { email, resetLink }

4. POST /api/email/shipping-notification
   Body: { email, orderData }

5. POST /api/email/contact-response
   Body: { email, name, message }
```

---

## 💻 Exemple Simple

```javascript
// Envoyer un email de bienvenue
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

## 📚 Documentation

| Document | Durée | Lien |
|----------|-------|------|
| Quick Start | 5 min | [EMAIL_API_QUICKSTART.md](./EMAIL_API_QUICKSTART.md) |
| API Docs | 15 min | [EMAIL_API.md](./EMAIL_API.md) |
| Integration | 20 min | [EMAIL_API_INTEGRATION.md](./EMAIL_API_INTEGRATION.md) |
| Complete Ref | 30 min | [EMAIL_API_COMPLETE.md](./EMAIL_API_COMPLETE.md) |
| Index | - | [EMAIL_API_INDEX.md](./EMAIL_API_INDEX.md) |

---

## ✅ Checklist

- [ ] `.env.local` configuré
- [ ] Serveur démarré
- [ ] Tests exécutés
- [ ] Documentation lue
- [ ] Prêt à intégrer

---

## 🎉 C'est Tout!

Vous êtes maintenant prêt à utiliser les APIs Email. 🚀

**Besoin d'aide?** → Consulter [EMAIL_API_INDEX.md](./EMAIL_API_INDEX.md)
