/**
 * Email Verification Service
 * Handles email confirmation tokens and verification
 */

import crypto from 'crypto';
import { query } from './database';

const TOKEN_EXPIRY_HOURS = 24;

/**
 * Generate a secure verification token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create email verification record
 */
export const createEmailVerification = async (
  userId: number,
  email: string
): Promise<{ token: string; expiresAt: Date }> => {
  try {
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await query(
      `INSERT INTO email_verifications (user_id, email, token, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         token = $3,
         expires_at = $4,
         verified = FALSE`,
      [userId, email, token, expiresAt]
    );

    return { token, expiresAt };
  } catch (error) {
    console.error('❌ Error creating email verification:', error);
    throw error;
  }
};

/**
 * Verify email token
 */
export const verifyEmailToken = async (token: string): Promise<boolean> => {
  try {
    const result = await query(
      `SELECT id, user_id, email FROM email_verifications
       WHERE token = $1 
       AND verified = FALSE
       AND expires_at > NOW()`,
      [token]
    );

    if (!result.rows[0]) {
      console.warn('⚠️ Invalid or expired verification token');
      return false;
    }

    const { id, user_id, email } = result.rows[0];

    // Mark as verified
    await query(
      `UPDATE email_verifications 
       SET verified = TRUE, verified_at = NOW()
       WHERE id = $1`,
      [id]
    );

    // Update user
    await query(
      `UPDATE users 
       SET email_verified = TRUE, email_verified_at = NOW()
       WHERE id = $1`,
      [user_id]
    );

    console.log(`✅ Email verified for user ${user_id}: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error verifying email token:', error);
    throw error;
  }
};

/**
 * Check if user email is verified
 */
export const isEmailVerified = async (userId: number): Promise<boolean> => {
  try {
    const result = await query(
      `SELECT email_verified FROM users WHERE id = $1`,
      [userId]
    );

    return result.rows[0]?.email_verified || false;
  } catch (error) {
    console.error('❌ Error checking email verification status:', error);
    throw error;
  }
};

/**
 * Get verification token for user
 */
export const getVerificationToken = async (userId: number): Promise<string | null> => {
  try {
    const result = await query(
      `SELECT token FROM email_verifications
       WHERE user_id = $1 
       AND verified = FALSE
       AND expires_at > NOW()`,
      [userId]
    );

    return result.rows[0]?.token || null;
  } catch (error) {
    console.error('❌ Error getting verification token:', error);
    throw error;
  }
};

/**
 * Resend verification email (creates new token)
 */
export const resendVerificationEmail = async (userId: number): Promise<string> => {
  try {
    const userResult = await query(
      `SELECT email FROM users WHERE id = $1`,
      [userId]
    );

    if (!userResult.rows[0]) {
      throw new Error(`User ${userId} not found`);
    }

    const email = userResult.rows[0].email;
    const { token } = await createEmailVerification(userId, email);

    return token;
  } catch (error) {
    console.error('❌ Error resending verification email:', error);
    throw error;
  }
};

/**
 * Clean up expired verification tokens
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
  try {
    const result = await query(
      `DELETE FROM email_verifications
       WHERE expires_at < NOW()
       AND verified = FALSE`
    );

    console.log(`🧹 Cleaned up ${result.rowCount} expired verification tokens`);
    return result.rowCount || 0;
  } catch (error) {
    console.error('❌ Error cleaning up expired tokens:', error);
    throw error;
  }
};
