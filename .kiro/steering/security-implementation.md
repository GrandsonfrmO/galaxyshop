# Security Implementation Guide

## Overview
This document outlines the security features implemented in the application to protect against common web vulnerabilities.

## Security Features Implemented

### 1. Rate Limiting
**Purpose**: Prevent abuse and DoS attacks by limiting requests per IP/user

**Configuration**:
```typescript
// Different rate limits for different endpoints
- API endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes (stricter)
- Order endpoints: 50 requests per 1 hour
- Admin endpoints: 200 requests per 15 minutes
```

**Usage**:
```typescript
import { apiLimiter, authLimiter, orderLimiter, adminLimiter } from './services/security';

app.post('/api/orders', orderLimiter, handler);
app.use('/api/admin', authLimiter, authMiddleware, adminLimiter, routes);
```

**Response Headers**:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

### 2. CSRF Protection
**Purpose**: Prevent Cross-Site Request Forgery attacks

**How it works**:
1. Generate unique token for each session
2. Include token in response headers (`X-CSRF-Token`)
3. Require token in request headers for state-changing operations (POST, PUT, DELETE, PATCH)
4. Tokens expire after 24 hours
5. One-time use tokens

**Usage**:
```typescript
import { csrfMiddleware, generateCSRFToken } from './services/security';

app.use(csrfMiddleware);

// Client-side: Include token in request headers
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### 3. Input Sanitization
**Purpose**: Prevent XSS, SQL injection, and other input-based attacks

**Features**:
- HTML entity encoding
- Null byte removal
- Control character removal
- Email validation and normalization
- URL protocol validation (blocks javascript:, data:, vbscript:)
- NoSQL injection prevention
- Recursive object sanitization

**Usage**:
```typescript
import { 
  sanitizeString, 
  sanitizeEmail, 
  sanitizeUrl,
  sanitizeObject,
  sanitizeRequestBody 
} from './services/security';

// Automatic sanitization of all request bodies
app.use(sanitizeRequestBody);

// Manual sanitization
const cleanEmail = sanitizeEmail(userInput);
const cleanString = sanitizeString(userInput);
```

### 4. IP Whitelisting
**Purpose**: Restrict access to specific IP addresses

**Configuration** (in `.env.local`):
```env
IP_WHITELIST_ENABLED=true
WHITELISTED_IPS=192.168.1.1,10.0.0.0/8,203.0.113.0
ALLOW_PRIVATE_IPS=true
```

**Features**:
- Exact IP matching
- CIDR range support (e.g., 10.0.0.0/8)
- Private IP detection and allowance
- Proxy header support (X-Forwarded-For)

**Usage**:
```typescript
import { 
  initializeIPWhitelist, 
  ipWhitelistMiddleware,
  addIPToWhitelist,
  removeIPFromWhitelist,
  getWhitelist 
} from './services/security';

// Initialize on startup
initializeIPWhitelist({
  enabled: true,
  ips: ['192.168.1.1', '10.0.0.0/8'],
  allowPrivate: true
});

// Apply middleware
app.use(ipWhitelistMiddleware);

// Manage whitelist dynamically
addIPToWhitelist('203.0.113.0');
removeIPFromWhitelist('192.168.1.1');
```

### 5. Encryption
**Purpose**: Protect sensitive data at rest

**Features**:
- AES-256-GCM encryption
- PBKDF2 key derivation
- Secure random token generation
- One-way hashing for passwords
- Data masking for logging

**Usage**:
```typescript
import { 
  encrypt, 
  decrypt,
  encryptObject,
  decryptObject,
  hashData,
  verifyHashedData,
  generateSecureToken,
  maskSensitiveData 
} from './services/security';

// Encrypt sensitive data
const encryptionKey = process.env.ENCRYPTION_KEY;
const encrypted = encrypt('sensitive data', encryptionKey);
const decrypted = decrypt(encrypted, encryptionKey);

// Hash passwords
const passwordHash = hashData(password);
const isValid = verifyHashedData(password, passwordHash);

// Generate tokens
const token = generateSecureToken(32);

// Mask for logging
const masked = maskSensitiveData('1234567890', 4); // ****567890
```

## Environment Variables

Add these to `.env.local`:

```env
# Rate Limiting (optional - uses defaults if not set)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CSRF Protection (automatic)
CSRF_TOKEN_EXPIRY=86400000

# IP Whitelisting
IP_WHITELIST_ENABLED=false
WHITELISTED_IPS=
ALLOW_PRIVATE_IPS=true

# Encryption
ENCRYPTION_KEY=your-secure-encryption-key-here
```

## Security Best Practices

### 1. Always Use HTTPS in Production
```env
NODE_ENV=production
```

### 2. Rotate Encryption Keys Regularly
- Store encryption keys in secure environment variables
- Never commit keys to version control
- Use a key management service in production

### 3. Monitor Rate Limit Violations
```typescript
// Log rate limit hits
app.use((req, res, next) => {
  const remaining = res.get('X-RateLimit-Remaining');
  if (remaining && parseInt(remaining) < 10) {
    console.warn(`⚠️ Rate limit approaching for ${req.ip}`);
  }
  next();
});
```

### 4. Validate All Inputs
- Use sanitization middleware on all routes
- Validate data types and formats
- Use parameterized queries (already done with pg)

### 5. Implement Logging and Monitoring
```typescript
// Log security events
console.warn(`⚠️ Access denied for IP: ${clientIP}`);
console.warn(`⚠️ Invalid CSRF token from ${req.ip}`);
console.warn(`⚠️ Rate limit exceeded for ${req.ip}`);
```

### 6. Use Secure Headers
```typescript
import helmet from 'helmet';

app.use(helmet());
```

### 7. Keep Dependencies Updated
```bash
npm audit
npm update
```

## Testing Security Features

### Test Rate Limiting
```bash
# Should succeed
curl http://localhost:5000/api/products

# After 100 requests in 15 minutes, should get 429
curl http://localhost:5000/api/products
# Response: { "error": "Too many requests", "retryAfter": 900 }
```

### Test CSRF Protection
```bash
# GET request returns CSRF token
curl -i http://localhost:5000/api/products

# POST without token should fail
curl -X POST http://localhost:5000/api/orders

# POST with token should succeed
curl -X POST http://localhost:5000/api/orders \
  -H "X-CSRF-Token: <token>" \
  -H "Content-Type: application/json" \
  -d '{"data": "..."}'
```

### Test Input Sanitization
```bash
# XSS attempt should be sanitized
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>"}'
# Response: name is sanitized to "&lt;script&gt;alert(1)&lt;/script&gt;"
```

### Test IP Whitelisting
```bash
# If enabled and IP not whitelisted
curl http://localhost:5000/api/products
# Response: { "error": "Access denied" }
```

## Troubleshooting

### CSRF Token Errors
- Ensure token is included in request headers
- Check token hasn't expired (24 hours)
- Verify token format is correct

### Rate Limit Issues
- Check X-RateLimit-* headers in response
- Verify rate limit configuration
- Consider increasing limits for legitimate high-traffic scenarios

### Encryption Errors
- Ensure ENCRYPTION_KEY is set in environment
- Verify key hasn't changed (old data won't decrypt)
- Check data format matches encryption method

### IP Whitelist Not Working
- Verify IP_WHITELIST_ENABLED=true
- Check WHITELISTED_IPS format (comma-separated)
- Test with private IPs if ALLOW_PRIVATE_IPS=true
- Check X-Forwarded-For header if behind proxy

## Next Steps

1. Install additional security packages:
```bash
npm install helmet express-validator
```

2. Add helmet middleware for additional headers:
```typescript
import helmet from 'helmet';
app.use(helmet());
```

3. Implement request validation:
```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/orders', [
  body('customerEmail').isEmail(),
  body('customerName').trim().notEmpty(),
], handler);
```

4. Set up security monitoring and alerting
5. Conduct security audit and penetration testing
6. Implement API key authentication for sensitive endpoints
