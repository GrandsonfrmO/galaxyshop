/**
 * CSRF Protection Service
 * Prevents Cross-Site Request Forgery attacks
 */

import crypto from 'crypto';

interface CSRFStore {
  [token: string]: { createdAt: number; used: boolean };
}

const store: CSRFStore = {};
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a CSRF token
 */
export const generateCSRFToken = (): string => {
  const token = crypto.randomBytes(32).toString('hex');
  store[token] = {
    createdAt: Date.now(),
    used: false,
  };
  return token;
};

/**
 * Verify a CSRF token
 */
export const verifyCSRFToken = (token: string): boolean => {
  if (!token || !store[token]) {
    return false;
  }

  const tokenData = store[token];
  const now = Date.now();

  // Check expiry
  if (now - tokenData.createdAt > TOKEN_EXPIRY) {
    delete store[token];
    return false;
  }

  // Mark as used (one-time use)
  tokenData.used = true;

  return true;
};

/**
 * CSRF middleware for Express
 */
export const csrfMiddleware = (req: any, res: any, next: any) => {
  // Generate token for GET requests
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    res.locals.csrfToken = token;
    res.set('X-CSRF-Token', token);
  }

  // Verify token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;

    if (!token) {
      return res.status(403).json({ error: 'CSRF token missing' });
    }

    if (!verifyCSRFToken(token as string)) {
      return res.status(403).json({ error: 'Invalid or expired CSRF token' });
    }
  }

  next();
};

/**
 * Clean up expired tokens periodically
 */
export const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const token in store) {
    if (now - store[token].createdAt > TOKEN_EXPIRY) {
      delete store[token];
    }
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
