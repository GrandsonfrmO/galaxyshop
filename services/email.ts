/**
 * Email Service with Resend
 * Service d'envoi d'emails avec Resend
 */

import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);

// Email templates
const EMAIL_FROM = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev';
const COMPANY_NAME = 'Grandson Clothes';

/**
 * Send order confirmation email
 */
export const sendOrderConfirmation = async (
  email: string,
  orderData: {
    orderId: number;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    estimatedDelivery: string;
  }
) => {
  const itemsHtml = orderData.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} GNF</td>
        </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #eee; }
          table { width: 100%; border-collapse: collapse; }
          .total { font-size: 18px; font-weight: bold; color: #000; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Confirmation de Commande</p>
          </div>

          <div class="content">
            <p>Bonjour ${orderData.customerName},</p>
            <p>Merci pour votre commande! Voici les détails:</p>

            <div class="order-details">
              <h2>Commande #${orderData.orderId}</h2>
              
              <table>
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Produit</th>
                    <th style="padding: 10px; text-align: center;">Quantité</th>
                    <th style="padding: 10px; text-align: right;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                <p style="font-size: 16px;">
                  <strong>Total:</strong> <span class="total">${orderData.total.toLocaleString()} GNF</span>
                </p>
                <p>
                  <strong>Livraison estimée:</strong> ${orderData.estimatedDelivery}
                </p>
              </div>
            </div>

            <p>Vous pouvez suivre votre commande sur votre compte.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://grandson-clothes.com/orders/${orderData.orderId}" class="button">Voir ma commande</a>
            </p>

            <p>Merci de votre confiance!</p>
            <p>${COMPANY_NAME}</p>
          </div>

          <div class="footer">
            <p>© 2024 ${COMPANY_NAME}. Tous droits réservés.</p>
            <p>Cet email a été envoyé à ${email}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Confirmation de commande #${orderData.orderId}`,
      html,
    });

    console.log('✅ Order confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Bienvenue!</p>
          </div>

          <div class="content">
            <p>Bonjour ${name},</p>
            <p>Bienvenue chez ${COMPANY_NAME}!</p>
            <p>Nous sommes heureux de vous accueillir. Explorez notre collection exclusive de vêtements et accessoires.</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://grandson-clothes.com" class="button">Découvrir la boutique</a>
            </p>

            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>${COMPANY_NAME}</p>
          </div>

          <div class="footer">
            <p>© 2024 ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;

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
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Réinitialisation de mot de passe</p>
          </div>

          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé une réinitialisation de mot de passe.</p>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
            </p>

            <div class="warning">
              <strong>⚠️ Attention:</strong> Ce lien expire dans 24 heures.
            </div>

            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <p>${COMPANY_NAME}</p>
          </div>

          <div class="footer">
            <p>© 2024 ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;

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
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .tracking-box { background: #fff; padding: 20px; border: 2px solid #8b5cf6; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: #fff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Votre commande est en route!</p>
          </div>

          <div class="content">
            <p>Bonjour ${orderData.customerName},</p>
            <p>Votre commande #${orderData.orderId} a été expédiée!</p>

            <div class="tracking-box">
              <h3>Numéro de suivi</h3>
              <p style="font-size: 18px; font-weight: bold; color: #8b5cf6;">
                ${orderData.trackingNumber}
              </p>
              <p>Livraison estimée: <strong>${orderData.estimatedDelivery}</strong></p>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="https://grandson-clothes.com/track/${orderData.trackingNumber}" class="button">Suivre ma commande</a>
            </p>

            <p>Merci de votre confiance!</p>
            <p>${COMPANY_NAME}</p>
          </div>

          <div class="footer">
            <p>© 2024 ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;

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
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .message-box { background: #fff; padding: 20px; border-left: 4px solid #8b5cf6; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p>Merci de nous avoir contactés</p>
          </div>

          <div class="content">
            <p>Bonjour ${name},</p>
            <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>

            <div class="message-box">
              <h3>Votre message:</h3>
              <p>${message}</p>
            </div>

            <p>Notre équipe examinera votre demande et vous répondra dans les plus brefs délais.</p>
            <p>${COMPANY_NAME}</p>
          </div>

          <div class="footer">
            <p>© 2024 ${COMPANY_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;

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
