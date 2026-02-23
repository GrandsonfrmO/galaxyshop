/**
 * Email Retry Service
 * Handles email retry logic with exponential backoff
 */

import { query } from './database';

interface EmailRetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_CONFIG: EmailRetryConfig = {
  maxRetries: 3,
  initialDelayMs: 5000, // 5 seconds
  backoffMultiplier: 2, // exponential backoff
};

/**
 * Calculate next retry time with exponential backoff
 */
export const calculateNextRetryTime = (
  retryCount: number,
  config: EmailRetryConfig = DEFAULT_CONFIG
): Date => {
  const delayMs = config.initialDelayMs * Math.pow(config.backoffMultiplier, retryCount);
  return new Date(Date.now() + delayMs);
};

/**
 * Log email attempt to database
 */
export const logEmailAttempt = async (
  orderId: number | null,
  recipientEmail: string,
  subject: string,
  emailType: string,
  status: 'pending' | 'sent' | 'failed',
  errorMessage?: string,
  resendId?: string
) => {
  try {
    const result = await query(
      `INSERT INTO email_logs 
       (order_id, recipient_email, subject, email_type, status, error_message, resend_id, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        orderId,
        recipientEmail,
        subject,
        emailType,
        status,
        errorMessage || null,
        resendId || null,
        status === 'sent' ? new Date() : null,
      ]
    );
    return result.rows[0]?.id;
  } catch (error) {
    console.error('❌ Error logging email attempt:', error);
    throw error;
  }
};

/**
 * Mark email as failed and schedule retry
 */
export const scheduleEmailRetry = async (
  emailLogId: number,
  errorMessage: string,
  config: EmailRetryConfig = DEFAULT_CONFIG
) => {
  try {
    const result = await query(
      `SELECT retry_count FROM email_logs WHERE id = $1`,
      [emailLogId]
    );

    if (!result.rows[0]) {
      throw new Error(`Email log ${emailLogId} not found`);
    }

    const currentRetryCount = result.rows[0].retry_count || 0;

    if (currentRetryCount >= config.maxRetries) {
      // Max retries exceeded
      await query(
        `UPDATE email_logs 
         SET status = 'failed', error_message = $1
         WHERE id = $2`,
        [`Max retries exceeded: ${errorMessage}`, emailLogId]
      );
      console.error(`❌ Email ${emailLogId} failed after ${config.maxRetries} retries`);
      return false;
    }

    // Schedule next retry
    const nextRetryTime = calculateNextRetryTime(currentRetryCount, config);
    await query(
      `UPDATE email_logs 
       SET status = 'pending', 
           retry_count = $1, 
           next_retry_at = $2,
           error_message = $3
       WHERE id = $4`,
      [currentRetryCount + 1, nextRetryTime, errorMessage, emailLogId]
    );

    console.log(
      `⏱️ Email ${emailLogId} scheduled for retry at ${nextRetryTime.toISOString()}`
    );
    return true;
  } catch (error) {
    console.error('❌ Error scheduling email retry:', error);
    throw error;
  }
};

/**
 * Get pending emails that need to be retried
 */
export const getPendingEmailsForRetry = async () => {
  try {
    const result = await query(
      `SELECT id, order_id, recipient_email, subject, email_type, retry_count
       FROM email_logs
       WHERE status = 'pending' 
       AND next_retry_at IS NOT NULL
       AND next_retry_at <= NOW()
       ORDER BY next_retry_at ASC
       LIMIT 100`
    );
    return result.rows;
  } catch (error) {
    console.error('❌ Error fetching pending emails:', error);
    throw error;
  }
};

/**
 * Mark email as successfully sent
 */
export const markEmailAsSent = async (
  emailLogId: number,
  resendId?: string
) => {
  try {
    await query(
      `UPDATE email_logs 
       SET status = 'sent', 
           sent_at = NOW(),
           resend_id = $1
       WHERE id = $2`,
      [resendId || null, emailLogId]
    );
    console.log(`✅ Email ${emailLogId} marked as sent`);
  } catch (error) {
    console.error('❌ Error marking email as sent:', error);
    throw error;
  }
};

/**
 * Get email statistics
 */
export const getEmailStats = async () => {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM email_logs`
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error fetching email stats:', error);
    throw error;
  }
};
