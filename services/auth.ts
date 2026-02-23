/**
 * Authentication & Authorization Service
 * Handles API key validation and admin authentication
 */

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-key-change-in-production';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'internal-key-change-in-production';

/**
 * Validates admin API key from request headers
 */
export const validateAdminAuth = (request: Request): boolean => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_API_KEY;
};

/**
 * Validates internal API key (for server-to-server communication)
 */
export const validateInternalAuth = (request: Request): boolean => {
  const authHeader = request.headers.get('x-internal-key');
  
  if (!authHeader) {
    return false;
  }
  
  return authHeader === INTERNAL_API_KEY;
};

/**
 * Validates either admin or internal auth
 */
export const validateAuth = (request: Request): boolean => {
  return validateAdminAuth(request) || validateInternalAuth(request);
};

/**
 * Creates an unauthorized response
 */
export const unauthorizedResponse = () => {
  return new Response(
    JSON.stringify({ error: 'Unauthorized - Missing or invalid authentication' }),
    { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
};

/**
 * Creates a forbidden response
 */
export const forbiddenResponse = () => {
  return new Response(
    JSON.stringify({ error: 'Forbidden - Insufficient permissions' }),
    { 
      status: 403, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
};
