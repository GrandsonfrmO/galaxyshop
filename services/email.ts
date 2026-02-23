/**
 * Email Service with Resend
 * Service d'envoi d'emails avec Resend
 * Includes retry logic and email tracking
 */

import { Resend } from 'resend';
import {
  baseEmailTemplate,
  orderConfirmationContent,
  welcomeEmailContent,
  shippingNotificationContent,
  passwordResetContent,
  contactFormResponseContent,
  adminOrderNotificationContent,
} from './emailTemplates';
import { logEmailAttempt, scheduleEmailRetry, markEmailAsSent } from './emailRetryService';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);

// Email configuration
const EMAIL_FROM = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev';
const COMPANY_NAME = 'Grandson Clothes';

/**
 * Send order confirmation email to customer with retry logic
 */
export const sendOrderConfirmation = async (
  order: any,
  items: any[]
) => {
  const content = orderConfirmationContent(order, items);
  const html = baseEmailTemplate({
    preheader: 'Confirmation de Commande',
    content,
    cta: {
      text: 'Voir ma commande',
      url: `https://grandson-clothes.com/orders/${order.id}`,
    },
  });

  const subject = `Confirmation de commande #${order.id}`;

  try {
    // Log email attempt
    const emailLogId = await logEmailAttempt(
      order.id,
      order.customer_email,
      subject,
      'order_confirmation',
      'pending'
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: order.customer_email,
      subject,
      html,
    });

    // Mark as sent
    await markEmailAsSent(emailLogId, result.id);
    console.log('✅ Order confirmation email sent to customer:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    
    // Log failure and schedule retry
    const emailLogId = await logEmailAttempt(
      order.id,
      order.customer_email,
      subject,
      'order_confirmation',
      'failed',
      String(error)
    );
    
    await scheduleEmailRetry(emailLogId, String(error));
    throw error;
  }
};

/**
 * Send order notification email to admin with retry logic
 */
export const sendOrderNotificationToAdmin = async (
  order: any,
  items: any[]
) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL not configured in environment variables');
    return;
  }

  const content = adminOrderNotificationContent(order, items);
  const html = baseEmailTemplate({
    preheader: 'Nouvelle Commande',
    content,
    cta: {
      text: 'Voir la commande',
      url: `https://grandson-clothes.com/admin/orders/${order.id}`,
    },
  });

  const subject = `[NOUVELLE COMMANDE] #${order.id} - ${order.customer_name}`;

  try {
    // Log email attempt
    const emailLogId = await logEmailAttempt(
      order.id,
      adminEmail,
      subject,
      'admin_notification',
      'pending'
    );

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      subject,
      html,
    });

    // Mark as sent
    await markEmailAsSent(emailLogId, result.id);
    console.log('✅ Order notification email sent to admin:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending order notification to admin:', error);
    
    // Log failure and schedule retry
    const emailLogId = await logEmailAttempt(
      order.id,
      adminEmail,
      subject,
      'admin_notification',
      'failed',
      String(error)
    );
    
    await scheduleEmailRetry(emailLogId, String(error));
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
  const content = welcomeEmailContent(name);
  const html = baseEmailTemplate({
    preheader: 'Bienvenue!',
    content,
    cta: {
      text: 'Découvrir la boutique',
      url: 'https://grandson-clothes.com',
    },
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Bienvenue chez ${COMPANY_NAME}!`,
      html,
    });

    console.log('✅ Welcome email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const content = passwordResetContent(resetLink);
  const html = baseEmailTemplate({
    preheader: 'Réinitialisation de mot de passe',
    content,
    cta: {
      text: 'Réinitialiser mon mot de passe',
      url: resetLink,
    },
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html,
    });

    console.log('✅ Password reset email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send shipping notification email
 */
export const sendShippingNotification = async (
  email: string,
  orderData: {
    orderId: number;
    customerName: string;
    trackingNumber: string;
    estimatedDelivery: string;
  }
) => {
  const content = shippingNotificationContent(orderData);
  const html = baseEmailTemplate({
    preheader: 'Votre commande est en route!',
    content,
    cta: {
      text: 'Suivre ma commande',
      url: `https://grandson-clothes.com/track/${orderData.trackingNumber}`,
    },
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Votre commande #${orderData.orderId} est en route!`,
      html,
    });

    console.log('✅ Shipping notification email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending shipping notification email:', error);
    throw error;
  }
};

/**
 * Send contact form response
 */
export const sendContactFormResponse = async (
  email: string,
  name: string,
  message: string
) => {
  const content = contactFormResponseContent(name, message);
  const html = baseEmailTemplate({
    preheader: 'Nous avons reçu votre message',
    content,
  });

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Nous avons reçu votre message',
      html,
    });

    console.log('✅ Contact form response email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending contact form response email:', error);
    throw error;
  }
};

export default resend;
