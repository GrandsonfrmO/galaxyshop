# Security Features - Usage Examples

## Rate Limiting Examples

### Basic Usage
```typescript
import { apiLimiter, orderLimiter, authLimiter, adminLimiter } from './services/security';

// Apply to specific routes
app.get('/api/products', apiLimiter, handler);
app.post('/api/orders', orderLimiter, handler);
app.post('/api/login', authLimiter, handler);
app.use('/api/admin', adminLimiter, routes);
```

### Custom Rate Limiter
```typescript
import { createRateLimiter } from './services/security';

// Create custom limiter for bulk operations
const bulkLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // Very strict
  keyGenerator: (req) => req.user?.id || req.ip, // Per user
});

app.post('/api/bulk-import', bulkLimiter, handler);
```

### Checking Rate Limit Status
```typescript
app.use((req, res, next) => {
  const remaining = res.get('X-RateLimit-Remaining');
  const limit = res.get('X-RateLimit-Limit');
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn(`⚠️ Rate limit approaching: ${remaining}/${limit} for ${req.ip}`);
  }
  
  next();
});
```

---

## CSRF Protection Examples

### Server-side Setup
```typescript
import { csrfMiddleware, generateCSRFToken } from './services/security';

// Apply to all routes
app.use(csrfMiddleware);

// Token is automatically generated for GET requests
// and available in response headers
```

### Client-side Usage (React)
```typescript
import { useState, useEffect } from 'react';

function OrderForm() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get CSRF token from GET request
    fetch('/api/orders')
      .then(res => {
        const token = res.headers.get('X-CSRF-Token');
        setCsrfToken(token);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [{ productId: 1, quantity: 2 }]
      })
    });

    if (response.ok) {
      console.log('Order created successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Client-side Usage (Vanilla JS)
```javascript
// Get CSRF token
async function getCSRFToken() {
  const response = await fetch('/api/products');
  return response.headers.get('X-CSRF-Token');
}

// Use token in POST request
async function createOrder(orderData) {
  const token = await getCSRFToken();
  
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  return response.json();
}

// Usage
createOrder({
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  items: []
});
```

### Handling CSRF Errors
```typescript
async function makeSecureRequest(url, options = {}) {
  try {
    // Get CSRF token first
    const tokenResponse = await fetch(url, { method: 'GET' });
    const token = tokenResponse.headers.get('X-CSRF-Token');

    if (!token) {
      throw new Error('Failed to get CSRF token');
    }

    // Make actual request with token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': token,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      console.error('CSRF token invalid or expired');
      // Retry with new token
      return makeSecureRequest(url, options);
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

## Input Sanitization Examples

### Automatic Sanitization
```typescript
// All request bodies are automatically sanitized
// No code needed!

app.post('/api/orders', (req, res) => {
  // req.body is already sanitized
  const { customerName, customerEmail } = req.body;
  
  // These are safe to use
  console.log(customerName); // Already sanitized
  console.log(customerEmail); // Already sanitized
});
```

### Manual Sanitization
```typescript
import { 
  sanitizeString, 
  sanitizeEmail, 
  sanitizeUrl,
  sanitizeNumber,
  sanitizeObject 
} from './services/security';

// Sanitize individual values
const cleanName = sanitizeString('<script>alert(1)</script>');
// Result: "&lt;script&gt;alert(1)&lt;/script&gt;"

const cleanEmail = sanitizeEmail('  USER@EXAMPLE.COM  ');
// Result: "user@example.com"

const cleanUrl = sanitizeUrl('https://example.com/path');
// Result: "https://example.com/path"

const cleanNumber = sanitizeNumber('123.45');
// Result: 123.45

// Sanitize entire object
const cleanData = sanitizeObject({
  name: '<img src=x onerror=alert(1)>',
  email: 'test@example.com',
  items: [
    { id: 1, name: '<script>alert(1)</script>' }
  ]
});
```

### Validation with Sanitization
```typescript
import { sanitizeEmail, sanitizeString } from './services/security';

function validateOrderData(data) {
  try {
    const email = sanitizeEmail(data.email);
    const name = sanitizeString(data.name);
    
    if (!name || name.length < 2) {
      throw new Error('Name too short');
    }
    
    return { email, name };
  } catch (error) {
    throw new Error(`Invalid data: ${error.message}`);
  }
}
```

---

## IP Whitelisting Examples

### Configuration
```env
# .env.local
IP_WHITELIST_ENABLED=true
WHITELISTED_IPS=192.168.1.1,10.0.0.0/8,203.0.113.0
ALLOW_PRIVATE_IPS=true
```

### Runtime Management
```typescript
import { 
  initializeIPWhitelist, 
  addIPToWhitelist, 
  removeIPFromWhitelist,
  getWhitelist,
  isIPWhitelisted 
} from './services/security';

// Initialize on startup
initializeIPWhitelist({
  enabled: true,
  ips: ['192.168.1.1', '10.0.0.0/8'],
  allowPrivate: true
});

// Add new IP
addIPToWhitelist('203.0.113.0');

// Remove IP
removeIPFromWhitelist('192.168.1.1');

// Check if IP is whitelisted
const allowed = isIPWhitelisted('192.168.1.1');

// Get current whitelist
const whitelist = getWhitelist();
console.log(whitelist); // ['10.0.0.0/8', '203.0.113.0']
```

### Admin Endpoint with IP Whitelist
```typescript
import { ipWhitelistMiddleware } from './services/security';

// Restrict admin routes to whitelisted IPs
app.use('/api/admin', ipWhitelistMiddleware, authMiddleware, adminRoutes);

// Now only whitelisted IPs can access admin routes
```

### Dynamic Whitelist Management
```typescript
// Admin endpoint to manage whitelist
app.post('/api/admin/whitelist/add', authMiddleware, (req, res) => {
  const { ip } = req.body;
  
  try {
    addIPToWhitelist(ip);
    res.json({ success: true, whitelist: getWhitelist() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/whitelist/remove', authMiddleware, (req, res) => {
  const { ip } = req.body;
  
  try {
    removeIPFromWhitelist(ip);
    res.json({ success: true, whitelist: getWhitelist() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/whitelist', authMiddleware, (req, res) => {
  res.json({ whitelist: getWhitelist() });
});
```

---

## Encryption Examples

### Basic Encryption/Decryption
```typescript
import { encrypt, decrypt } from './services/security';

const encryptionKey = process.env.ENCRYPTION_KEY;

// Encrypt
const sensitiveData = 'credit-card-number-1234-5678-9012-3456';
const encrypted = encrypt(sensitiveData, encryptionKey);
console.log(encrypted); // Base64 encoded encrypted data

// Decrypt
const decrypted = decrypt(encrypted, encryptionKey);
console.log(decrypted); // 'credit-card-number-1234-5678-9012-3456'
```

### Object Encryption
```typescript
import { encryptObject, decryptObject } from './services/security';

const encryptionKey = process.env.ENCRYPTION_KEY;

// Encrypt object
const userData = {
  creditCard: '1234-5678-9012-3456',
  ssn: '123-45-6789',
  bankAccount: '9876543210'
};

const encrypted = encryptObject(userData, encryptionKey);
// Store encrypted in database

// Decrypt object
const decrypted = decryptObject(encrypted, encryptionKey);
console.log(decrypted); // Original object
```

### Password Hashing
```typescript
import { hashData, verifyHashedData } from './services/security';

// Hash password on registration
const password = 'user-password-123';
const passwordHash = hashData(password);
// Store passwordHash in database

// Verify password on login
const isValid = verifyHashedData(password, passwordHash);
if (isValid) {
  console.log('Password correct');
} else {
  console.log('Password incorrect');
}
```

### Secure Token Generation
```typescript
import { generateSecureToken } from './services/security';

// Generate API key
const apiKey = generateSecureToken(32);
console.log(apiKey); // 64-character hex string

// Generate password reset token
const resetToken = generateSecureToken(32);

// Generate session token
const sessionToken = generateSecureToken(32);
```

### Data Masking for Logging
```typescript
import { maskSensitiveData } from './services/security';

// Mask credit card
const creditCard = '1234-5678-9012-3456';
const masked = maskSensitiveData(creditCard, 4);
console.log(masked); // '****-****-****-3456'

// Mask email
const email = 'user@example.com';
const maskedEmail = maskSensitiveData(email, 3);
console.log(maskedEmail); // '***@example.com'

// Safe logging
console.log(`User logged in: ${maskSensitiveData(email, 3)}`);
```

### Storing Encrypted Data
```typescript
import { encrypt } from './services/security';
import { query } from './services/database';

async function storeUserData(userData) {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  // Encrypt sensitive fields
  const encryptedSSN = encrypt(userData.ssn, encryptionKey);
  const encryptedPhone = encrypt(userData.phone, encryptionKey);
  
  // Store in database
  const result = await query(
    `INSERT INTO users (name, email, ssn, phone) 
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [userData.name, userData.email, encryptedSSN, encryptedPhone]
  );
  
  return result.rows[0];
}

async function retrieveUserData(userId) {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  
  const user = result.rows[0];
  
  // Decrypt sensitive fields
  return {
    ...user,
    ssn: decrypt(user.ssn, encryptionKey),
    phone: decrypt(user.phone, encryptionKey)
  };
}
```

---

## Authentication Examples

### Admin Route Protection
```typescript
import { authMiddleware, adminOnlyMiddleware } from './services/security';

// Require authentication
app.use('/api/admin', authMiddleware, adminRoutes);

// Require admin role
app.post('/api/admin/users', authMiddleware, adminOnlyMiddleware, (req, res) => {
  // Only admins can access this
});
```

### Optional Authentication
```typescript
import { optionalAuthMiddleware } from './services/security';

// Authentication is optional
app.use('/api/public', optionalAuthMiddleware, (req, res) => {
  if (req.user?.authenticated) {
    // User is authenticated
    console.log('Authenticated user:', req.user);
  } else {
    // User is not authenticated
    console.log('Anonymous user');
  }
});
```

### Bearer Token Usage
```typescript
// Client-side: Include Bearer token
fetch('/api/admin/products', {
  headers: {
    'Authorization': 'Bearer your-admin-api-key-here'
  }
});

// Server-side: Middleware validates token
app.use('/api/admin', authMiddleware, (req, res) => {
  // req.user contains authentication info
  console.log(req.user.isAdmin); // true
});
```

---

## Complete Example: Secure Order Creation

```typescript
import express from 'express';
import {
  orderLimiter,
  csrfMiddleware,
  sanitizeRequestBody,
  encrypt,
  generateSecureToken
} from './services/security';

const app = express();

// Apply security middleware
app.use(express.json());
app.use(sanitizeRequestBody);
app.use(csrfMiddleware);

// Create order with all security features
app.post('/api/orders', orderLimiter, async (req, res) => {
  try {
    // Input is already sanitized by middleware
    const { customerName, customerEmail, items } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !items?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate order ID
    const orderId = generateSecureToken(8);

    // Encrypt sensitive data before storing
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptedEmail = encrypt(customerEmail, encryptionKey);

    // Store order in database
    const order = {
      id: orderId,
      customerName,
      customerEmail: encryptedEmail,
      items,
      createdAt: new Date(),
      status: 'pending'
    };

    // Save to database
    // await saveOrder(order);

    // Return success response
    res.status(201).json({
      success: true,
      orderId,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.listen(5000, () => {
  console.log('Server running with security features enabled');
});
```

---

## Testing Examples

### Test Rate Limiting
```bash
# First request succeeds
curl http://localhost:5000/api/products

# Check rate limit headers
curl -i http://localhost:5000/api/products | grep X-RateLimit

# After limit exceeded
curl http://localhost:5000/api/products
# Response: { "error": "Too many requests", "retryAfter": 900 }
```

### Test CSRF Protection
```bash
# Get CSRF token
TOKEN=$(curl -s -i http://localhost:5000/api/products | grep X-CSRF-Token | cut -d' ' -f2)

# Use token in POST
curl -X POST http://localhost:5000/api/orders \
  -H "X-CSRF-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","customerEmail":"test@example.com","items":[]}'
```

### Test Input Sanitization
```bash
# XSS attempt
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"<script>alert(1)</script>","customerEmail":"test@example.com","items":[]}'

# Response shows sanitized name
```

### Test Encryption
```typescript
import { encrypt, decrypt } from './services/security';

const key = process.env.ENCRYPTION_KEY;
const original = 'sensitive data';
const encrypted = encrypt(original, key);
const decrypted = decrypt(encrypted, key);

console.assert(decrypted === original, 'Encryption/decryption failed');
```

---

## Summary

All security features are designed to be:
- **Easy to use** - Minimal configuration required
- **Automatic** - Middleware handles most cases
- **Flexible** - Can be customized for specific needs
- **Production-ready** - Battle-tested implementations
- **Well-documented** - Clear examples and guides

Start with the quick start guide and refer to these examples as needed!
