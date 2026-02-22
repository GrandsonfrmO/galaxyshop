# Intégration du Test dans CI/CD

## 🔄 GitHub Actions

Créer un fichier `.github/workflows/test-complete-flow.yml` :

```yaml
name: Test Complete Flow

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * *'  # Tous les jours à 2h du matin

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: npm run migrate
      
      - name: Run complete flow test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
        run: npm run test:complete-flow
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## 🚀 Vercel Deployment

Ajouter dans `vercel.json` :

```json
{
  "buildCommand": "npm run build && npm run test:complete-flow",
  "env": {
    "DATABASE_URL": "@database_url",
    "RESEND_API_KEY": "@resend_api_key"
  }
}
```

## 🐳 Docker

Créer un `Dockerfile.test` :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=test

CMD ["npm", "run", "test:complete-flow"]
```

Exécuter :
```bash
docker build -f Dockerfile.test -t test-complete-flow .
docker run --env-file .env.local test-complete-flow
```

## 📊 Rapports de test

### Générer un rapport JSON

Modifier `test-complete-flow.ts` :

```typescript
interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

async function runAllTests() {
  const startTime = Date.now();
  
  try {
    // ... tests ...
    results.push({
      name: 'Add Products',
      status: 'passed',
      duration: Date.now() - startTime,
    });
  } catch (error) {
    results.push({
      name: 'Add Products',
      status: 'failed',
      duration: Date.now() - startTime,
      error: String(error),
    });
  }
  
  // Sauvegarder le rapport
  fs.writeFileSync(
    'test-results/complete-flow.json',
    JSON.stringify(results, null, 2)
  );
}
```

## 🔔 Notifications

### Slack

```typescript
async function notifySlack(results: TestResult[]) {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  
  const message = {
    text: `Test Complete Flow: ${passed} passed, ${failed} failed`,
    attachments: [{
      color: failed > 0 ? 'danger' : 'good',
      fields: results.map(r => ({
        title: r.name,
        value: `${r.status} (${r.duration}ms)`,
        short: true,
      })),
    }],
  };
  
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(message),
  });
}
```

### Email

```typescript
async function notifyEmail(results: TestResult[]) {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  
  await sendOrderConfirmation('admin@example.com', {
    orderId: Date.now(),
    customerName: 'Test Report',
    items: results.map(r => ({
      name: r.name,
      quantity: 1,
      price: r.status === 'passed' ? 1 : 0,
    })),
    total: passed,
    estimatedDelivery: new Date().toLocaleDateString(),
  });
}
```

## 📈 Monitoring

### Prometheus Metrics

```typescript
import { register, Counter, Histogram } from 'prom-client';

const testCounter = new Counter({
  name: 'test_complete_flow_total',
  help: 'Total number of test runs',
  labelNames: ['status'],
});

const testDuration = new Histogram({
  name: 'test_complete_flow_duration_seconds',
  help: 'Duration of test runs',
});

async function runAllTests() {
  const timer = testDuration.startTimer();
  
  try {
    // ... tests ...
    testCounter.inc({ status: 'passed' });
  } catch (error) {
    testCounter.inc({ status: 'failed' });
  } finally {
    timer();
  }
}
```

## 🔐 Secrets Management

### GitHub Secrets

1. Aller à Settings → Secrets and variables → Actions
2. Ajouter :
   - `DATABASE_URL` : URL de la base de données
   - `RESEND_API_KEY` : Clé API Resend

### Vercel Secrets

```bash
vercel env add DATABASE_URL
vercel env add RESEND_API_KEY
```

### Local Secrets

```bash
# .env.local (ne pas commiter)
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
```

## 🧪 Test Scheduling

### Cron Jobs

```yaml
schedule:
  - cron: '0 2 * * *'      # Tous les jours à 2h
  - cron: '0 */6 * * *'    # Toutes les 6 heures
  - cron: '0 0 * * 0'      # Chaque dimanche
```

### Manual Trigger

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        default: 'staging'
```

## 📊 Dashboard

### Créer un dashboard avec les résultats

```typescript
// dashboard.ts
import express from 'express';
import fs from 'fs';

const app = express();

app.get('/api/test-results', (req, res) => {
  const results = JSON.parse(
    fs.readFileSync('test-results/complete-flow.json', 'utf-8')
  );
  res.json(results);
});

app.listen(3000, () => {
  console.log('Dashboard running on http://localhost:3000');
});
```

## 🎯 Best Practices

1. **Exécuter les tests régulièrement** : Planifier avec cron
2. **Notifier les erreurs** : Slack, Email, etc.
3. **Générer des rapports** : JSON, HTML, etc.
4. **Monitorer les performances** : Prometheus, Grafana
5. **Archiver les résultats** : Pour l'historique
6. **Tester en isolation** : Base de données de test
7. **Nettoyer après les tests** : Supprimer les données de test

## 🔗 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Prometheus Metrics](https://prometheus.io)

---

**Dernière mise à jour :** 2026-02-22
