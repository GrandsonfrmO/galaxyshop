# Security Quick Start Guide

## 5-Minute Setup

### 1. Update `.env.local`

```env
# Add these security configurations
ADMIN_API_KEY=your-secure-admin-key-here
INTERNAL_API_KEY=your-secure-internal-key-here
ENCRYPTION_KEY=your-secure-encryption-key-here-min-32-chars

# Optional: Enable IP whitelisting
IP_WHITELIST_ENABLED=false
WHITELISTED_IPS=
ALLOW_PRIVATE_IPS=true
```

### 2. Restart Server

```bash
npm run dev
# or
node server.ts
```

### 3. Test Security Features

```bash
# Test rate limiting
curl http://localhost:5000/api/products

# Test CSRF protection
curl -i http://localhost:5000/api/products
# Copy the X-CSRF-Token header value

# Test with CSRF token
curl -X POST http://localhost:5000/api/orders \
  -H "X-CSRF-Token: <paste-token-here>" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","customerEmail":"test@example.com","items":[]}'
```

---

## Using Security Features in Code

### Rate Limiting
```typescript
import { apiLimiter, orderLimiter, authLimiter } from './services/security';

// Apply to specific routes
app.post('/api/orders', orderLimiter, handler);
app.use('/api/admin', authLimiter, authMiddleware, routes);
```

### CSRF Protection
```typescript
// Automatic - middleware handles it
// Client just needs to include X-CSRF-Token header

fetch('/api/orders', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken, // From response header
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Input Sanitization
```typescript
// Automatic - all request bodies are sanitized
// No code needed - it just works!

// Manual sanitization if needed
import { sanitizeString, sanitizeEmail } from './services/security';

const clean = sanitizeString(userInput);
const email = sanitizeEmail(userInput);
```

### IP Whitelisting
```typescript
import { initializeIPWhitelist, addIPToWhitelist } from './services/security';

// Initialize on startup
initializeIPWhitelist({
  enabled: true,
  ips: ['192.168.1.1', '10.0.0.0/8'],
  allowPrivate: true
});

// Add IPs dynamically
addIPToWhitelist('203.0.113.0');
```

### Encryption
```typescript
import { encrypt, decrypt, hashData, verifyHashedData } from './services/security';

const key = process.env.ENCRYPTION_KEY;

// Encrypt sensitive data
const encrypted = encrypt('secret', key);
const decrypted = decrypt(encrypted, key);

// Hash passwords
const hash = hashData('password123');
const isValid = verifyHashedData('password123', hash);
```

---

## Common Tasks

### Enable IP Whitelisting
```env
IP_WHITELIST_ENABLED=true
WHITELISTED_IPS=192.168.1.1,10.0.0.0/8,203.0.113.0
ALLOW_PRIVATE_IPS=true
```

### Increase Rate Limits for Specific Endpoint
```typescript
import { createRateLimiter } from './services/security';

const customLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000, // Higher limit
});

app.post('/api/bulk-import', customLimiter, handler);
```

### Encrypt Sensitive Data Before Storing
```typescript
import { encrypt } from './services/security';

const encryptionKey = process.env.ENCRYPTION_KEY;
const sensitiveData = { creditCard: '1234-5678-9012-3456' };

const encrypted = encrypt(JSON.stringify(sensitiveData), encryptionKey);
// Store encrypted in database
```

### Log Security Events
```typescript
app.use((req, res, next) => {
  const remaining = res.get('X-RateLimit-Remaining');
  if (remaining && parseInt(remaining) < 10) {
    console.warn(`⚠️ Rate limit approaching for ${req.ip}`);
  }
  next();
});
```

---

## Monitoring

### Check Rate Limit Status
```bash
# Response headers show rate limit info
curl -i http://localhost:5000/api/products

# Look for:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 95
# X-RateLimit-Reset: 1708956789
```

### Monitor Security Events
```bash
# Watch server logs for security warnings
npm run dev 2>&1 | grep "⚠️"
```

---

## Troubleshooting

### "CSRF token missing" Error
**Solution**: Include `X-CSRF-Token` header in POST/PUT/DELETE requests
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "X-CSRF-Token: <token>" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### "Too many requests" Error
**Solution**: Wait for rate limit window to reset or increase limits
```env
# Increase limits in .env.local if needed
RATE_LIMIT_MAX_REQUESTS=200
```

### "Access denied" Error
**Solution**: Check if IP whitelisting is enabled and your IP is whitelisted
```bash
# Disable if not needed
IP_WHITELIST_ENABLED=false
```

### Encryption/Decryption Errors
**Solution**: Ensure `ENCRYPTION_KEY` is set and hasn't changed
```env
# Must be at least 32 characters
ENCRYPTION_KEY=your-very-secure-encryption-key-minimum-32-chars
```

---

## Security Checklist

- [ ] Set `ADMIN_API_KEY` in `.env.local`
- [ ] Set `INTERNAL_API_KEY` in `.env.local`
- [ ] Set `ENCRYPTION_KEY` in `.env.local` (min 32 chars)
- [ ] Test rate limiting works
- [ ] Test CSRF protection works
- [ ] Test input sanitization works
- [ ] Configure IP whitelist if needed
- [ ] Review and update rate limit values
- [ ] Set `NODE_ENV=production` for production
- [ ] Use HTTPS in production
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Set up monitoring and logging
- [ ] Document security policies

---

## Production Deployment

### Before Going Live

1. **Update all environment variables**:
   ```env
   NODE_ENV=production
   ADMIN_API_KEY=<strong-random-key>
   INTERNAL_API_KEY=<strong-random-key>
   ENCRYPTION_KEY=<strong-random-key-32-chars>
   ```

2. **Enable HTTPS**:
   - Use SSL/TLS certificates
   - Redirect HTTP to HTTPS

3. **Configure IP whitelist** (if needed):
   ```env
   IP_WHITELIST_ENABLED=true
   WHITELISTED_IPS=<your-office-ips>
   ```

4. **Review rate limits**:
   - Adjust based on expected traffic
   - Monitor for legitimate users hitting limits

5. **Set up monitoring**:
   - Log security events
   - Alert on suspicious activity
   - Monitor rate limit violations

6. **Security audit**:
   - Run `npm audit`
   - Fix all vulnerabilities
   - Consider penetration testing

---

## Support

For detailed documentation, see:
- `SECURITY_ENHANCEMENTS_SUMMARY.md` - Complete feature documentation
- `.kiro/steering/security-implementation.md` - Implementation guide
- Individual files in `services/security/` - Source code documentation

---

## Key Takeaways

✅ **Rate Limiting** - Prevents abuse (100 req/15min default)
✅ **CSRF Protection** - Prevents cross-site attacks (automatic)
✅ **Input Sanitization** - Prevents XSS/injection (automatic)
✅ **IP Whitelisting** - Restricts access (optional)
✅ **Encryption** - Protects sensitive data (AES-256-GCM)

All features are production-ready and require minimal configuration!
