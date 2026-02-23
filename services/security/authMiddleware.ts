/**
 * Authentication Middleware for Express
 * Validates API keys and admin authentication
 */

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-key-change-in-production';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'internal-key-change-in-production';

/**
 * Express middleware for admin authentication
 */
export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized - Missing authentication' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (token !== ADMIN_API_KEY && token !== INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid authentication' });
  }

  // Attach user info to request
  req.user = {
    authenticated: true,
    isAdmin: token === ADMIN_API_KEY,
    isInternal: token === INTERNAL_API_KEY,
  };

  next();
};

/**
 * Optional authentication - doesn't fail if missing
 */
export const optionalAuthMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    if (token === ADMIN_API_KEY || token === INTERNAL_API_KEY) {
      req.user = {
        authenticated: true,
        isAdmin: token === ADMIN_API_KEY,
        isInternal: token === INTERNAL_API_KEY,
      };
    }
  }

  next();
};

/**
 * Admin-only middleware
 */
export const adminOnlyMiddleware = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  next();
};
