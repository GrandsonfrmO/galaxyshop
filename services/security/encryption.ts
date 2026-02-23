/**
 * Encryption Service
 * Encrypts and decrypts sensitive data
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Derive encryption key from password
 */
export const deriveKey = (password: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
};

/**
 * Encrypt sensitive data
 */
export const encrypt = (data: string, encryptionKey: string): string => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(encryptionKey, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Combine salt + iv + authTag + encrypted data
  const combined = Buffer.concat([salt, iv, authTag, Buffer.from(encrypted, 'hex')]);
  return combined.toString('base64');
};

/**
 * Decrypt sensitive data
 */
export const decrypt = (encryptedData: string, encryptionKey: string): string => {
  const combined = Buffer.from(encryptedData, 'base64');

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = deriveKey(encryptionKey, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
};

/**
 * Hash sensitive data (one-way)
 */
export const hashData = (data: string, salt?: string): string => {
  const hashSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(data, hashSalt, 100000, 64, 'sha256');
  return `${hashSalt}:${hash.toString('hex')}`;
};

/**
 * Verify hashed data
 */
export const verifyHashedData = (data: string, hash: string): boolean => {
  const [salt, hashValue] = hash.split(':');
  const newHash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha256');
  return newHash.toString('hex') === hashValue;
};

/**
 * Generate secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Encrypt object (converts to JSON first)
 */
export const encryptObject = (obj: any, encryptionKey: string): string => {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, encryptionKey);
};

/**
 * Decrypt object (parses JSON)
 */
export const decryptObject = (encryptedData: string, encryptionKey: string): any => {
  const jsonString = decrypt(encryptedData, encryptionKey);
  return JSON.parse(jsonString);
};

/**
 * Mask sensitive data for logging
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }

  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + visible;
};
