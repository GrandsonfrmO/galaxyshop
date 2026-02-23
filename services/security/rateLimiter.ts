/**
 * Rate Limiting Service
 * Prevents abuse by limiting requests per IP/user
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const createRateLimiter = (config: RateLimitConfig) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    keyGenerator = (req) => req.ip || req.connection.remoteAddress,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or update store
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
    } else {
      store[key].count++;
    }

    const remaining = Math.max(0, maxRequests - store[key].count);
    const resetTime = store[key].resetTime;

    // Set rate limit headers
    res.set('X-RateLimit-Limit', maxRequests.toString());
    res.set('X-RateLimit-Remaining', remaining.toString());
    res.set('X-RateLimit-Reset', resetTime.toString());

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Specific rate limiters for different endpoints
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5, // Stricter for auth
});

export const orderLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
});

export const adminLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 200, // Higher for admin
});
