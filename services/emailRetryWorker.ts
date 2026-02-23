/**
 * Email Retry Worker
 * Background job to retry failed emails
 * Should be run periodically (e.g., every 5 minutes)
 */

import { Resend } from 'resend';
import { getPendingEmailsForRetry, markEmailAsSent, scheduleEmailRetry } from './emailRetryService';
import { query } from './database';

const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);
const EMAIL_FROM = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev';

/**
 * Process pending emails and retry sending
 */
export const processEmailRetries = async (): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> => {
  const stats = {
    processed: 0,
    succeeded: 0,
    failed: 0,
  };

  try {
    const pendingEmails = await getPendingEmailsForRetry();
    console.log(`📧 Processing ${pendingEmails.length} pending emails for retry`);

    for (const email of pendingEmails) {
      stats.processed++;

      try {
        // Reconstruct email content from database
        const emailContent = await reconstructEmailContent(email);

        if (!emailContent) {
          console.warn(`⚠️ Could not reconstruct email content for log ${email.id}`);
          stats.failed++;
          continue;
        }

        // Send email
        const result = await resend.emails.send({
          from: EMAIL_FROM,
          to: email.recipient_email,
          subject: email.subject,
          html: emailContent,
        });

        // Mark as sent
        await markEmailAsSent(email.id, result.id);
        stats.succeeded++;
        console.log(`✅ Retry succeeded for email ${email.id}`);
      } catch (error) {
        console.error(`❌ Retry failed for email ${email.id}:`, error);
        
        // Schedule next retry
        await scheduleEmailRetry(email.id, String(error));
        stats.failed++;
      }
    }

    console.log(`📊 Email retry stats:`, stats);
    return stats;
  } catch (error) {
    console.error('❌ Error processing email retries:', error);
    throw error;
  }
};

/**
 * Reconstruct email HTML content from database
 * This is a simplified version - in production, you might want to store the full HTML
 */
const reconstructEmailContent = async (email: any): Promise<string | null> => {
  try {
    const { email_type, order_id } = email;

    // For order-related emails, fetch order data
    if (order_id && (email_type === 'order_confirmation' || email_type === 'admin_notification')) {
      const orderResult = await query(
        `SELECT o.*, json_agg(json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'selected_size', oi.selected_size,
          'selected_color', oi.selected_color,
          'price_at_purchase', oi.price_at_purchase
        )) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1
        GROUP BY o.id`,
        [order_id]
      );

      if (!orderResult.rows[0]) {
        console.warn(`⚠️ Order ${order_id} not found for email reconstruction`);
        return null;
      }

      // For now, return a simple HTML template
      // In production, you'd want to regenerate the full email template
      const order = orderResult.rows[0];
      return `
        <html>
          <body>
            <h2>${email.subject}</h2>
            <p>Order #${order.id}</p>
            <p>Customer: ${order.customer_name}</p>
            <p>Total: ${order.total_amount}</p>
          </body>
        </html>
      `;
    }

    return null;
  } catch (error) {
    console.error('❌ Error reconstructing email content:', error);
    return null;
  }
};

/**
 * Start email retry worker (runs periodically)
 */
export const startEmailRetryWorker = (intervalMs: number = 5 * 60 * 1000) => {
  console.log(`🚀 Starting email retry worker (interval: ${intervalMs}ms)`);

  setInterval(async () => {
    try {
      await processEmailRetries();
    } catch (error) {
      console.error('❌ Email retry worker error:', error);
    }
  }, intervalMs);
};

/**
 * Get email retry statistics
 */
export const getEmailRetryStats = async () => {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total_pending,
         SUM(CASE WHEN retry_count = 0 THEN 1 ELSE 0 END) as first_attempt,
         SUM(CASE WHEN retry_count > 0 THEN 1 ELSE 0 END) as retried,
         MAX(retry_count) as max_retries
       FROM email_logs
       WHERE status = 'pending'
       AND next_retry_at IS NOT NULL`
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error fetching email retry stats:', error);
    throw error;
  }
};
