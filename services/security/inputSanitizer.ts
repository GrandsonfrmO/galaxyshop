/**
 * Input Sanitization Service
 * Prevents XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize string input - remove dangerous characters
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Escape HTML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize email - basic validation and normalization
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') return '';

  const sanitized = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized;
};

/**
 * Sanitize URL - prevent javascript: and data: protocols
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') return '';

  const trimmed = url.trim();

  // Block dangerous protocols
  if (
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:') ||
    trimmed.toLowerCase().startsWith('vbscript:')
  ) {
    throw new Error('Invalid URL protocol');
  }

  return trimmed;
};

/**
 * Sanitize number - ensure it's a valid number
 */
export const sanitizeNumber = (input: any): number => {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number');
  }
  return num;
};

/**
 * Sanitize object - recursively sanitize all string values
 */
export const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Validate and sanitize request body
 */
export const sanitizeRequestBody = (req: any, res: any, next: any) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
};

/**
 * Prevent NoSQL injection
 */
export const preventNoSQLInjection = (obj: any): any => {
  if (typeof obj === 'string') {
    // Remove $ and . to prevent MongoDB operators
    return obj.replace(/[\$\.]/g, '');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => preventNoSQLInjection(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Skip keys starting with $ (MongoDB operators)
        if (!key.startsWith('$')) {
          cleaned[key] = preventNoSQLInjection(obj[key]);
        }
      }
    }
    return cleaned;
  }

  return obj;
};
