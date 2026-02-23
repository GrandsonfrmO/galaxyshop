/**
 * IP Whitelisting Service
 * Restricts access to specific IP addresses
 */

interface IPWhitelistConfig {
  enabled: boolean;
  ips: string[];
  allowPrivate?: boolean; // Allow private IPs (127.0.0.1, 192.168.*, etc.)
}

const defaultConfig: IPWhitelistConfig = {
  enabled: false,
  ips: [],
  allowPrivate: true,
};

let config = { ...defaultConfig };

/**
 * Initialize IP whitelist configuration
 */
export const initializeIPWhitelist = (newConfig: Partial<IPWhitelistConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Get client IP from request
 */
export const getClientIP = (req: any): string => {
  // Check for IP from proxy headers
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (forwarded as string).split(',')[0].trim();
  }

  return req.ip || req.connection.remoteAddress || '';
};

/**
 * Check if IP is private
 */
export const isPrivateIP = (ip: string): boolean => {
  const privateRanges = [
    /^127\./, // 127.0.0.0/8
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^::1$/, // IPv6 loopback
    /^fc00:/i, // IPv6 private
    /^fe80:/i, // IPv6 link-local
  ];

  return privateRanges.some((range) => range.test(ip));
};

/**
 * Check if IP is whitelisted
 */
export const isIPWhitelisted = (ip: string): boolean => {
  if (!config.enabled) {
    return true;
  }

  // Allow private IPs if configured
  if (config.allowPrivate && isPrivateIP(ip)) {
    return true;
  }

  // Check exact match
  if (config.ips.includes(ip)) {
    return true;
  }

  // Check CIDR ranges
  for (const whitelistedIP of config.ips) {
    if (whitelistedIP.includes('/')) {
      if (isIPInCIDR(ip, whitelistedIP)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Check if IP is in CIDR range
 */
export const isIPInCIDR = (ip: string, cidr: string): boolean => {
  const [range, bits] = cidr.split('/');
  const mask = ~(Math.pow(2, 32 - parseInt(bits)) - 1);

  const ipParts = ip.split('.').map(Number);
  const rangeParts = range.split('.').map(Number);

  const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
  const rangeNum = (rangeParts[0] << 24) + (rangeParts[1] << 16) + (rangeParts[2] << 8) + rangeParts[3];

  return (ipNum & mask) === (rangeNum & mask);
};

/**
 * IP whitelist middleware
 */
export const ipWhitelistMiddleware = (req: any, res: any, next: any) => {
  const clientIP = getClientIP(req);

  if (!isIPWhitelisted(clientIP)) {
    console.warn(`⚠️ Access denied for IP: ${clientIP}`);
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};

/**
 * Add IP to whitelist
 */
export const addIPToWhitelist = (ip: string) => {
  if (!config.ips.includes(ip)) {
    config.ips.push(ip);
  }
};

/**
 * Remove IP from whitelist
 */
export const removeIPFromWhitelist = (ip: string) => {
  config.ips = config.ips.filter((whitelistedIP) => whitelistedIP !== ip);
};

/**
 * Get current whitelist
 */
export const getWhitelist = (): string[] => {
  return [...config.ips];
};
