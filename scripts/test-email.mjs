/**
 * Test Email Script
 * Envoie un email de test à l'admin avec la nouvelle template cosmique
 */

import dotenv from 'dotenv';
import { Resend } from 'resend';
import { baseEmailTemplate, welcomeEmailContent, orderConfirmationContent, adminOrderNotificationContent } from '../services/emailTemplates.ts';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev';
const adminEmail = process.env.ADMIN_EMAIL;

if (!adminEmail) {
  console.error('❌ ADMIN_EMAIL not configured in environment variables');
  process.exit(1);
}

console.log('🚀 Envoi des emails de test à:', adminEmail);
console.log('');

async function testEmails() {
  try {
    // Test 1: Welcome Email
    console.log('📧 Test 1: Email de bienvenue...');
    const welcomeContent = welcomeEmailContent('Admin Cosmique');
    const welcomeHtml = baseEmailTemplate({
      preheader: 'Bienvenue!',
      content: welcomeContent,
      cta: {
        text: 'Découvrir la boutique',
        url: 'https://grandson-clothes.com',
      },
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      subject: 'Bienvenue chez Grandson Clothes!',
      html: welcomeHtml,
    });
    console.log('✅ Email de bienvenue envoyé avec succès!');
    console.log('');

    // Test 2: Order Confirmation
    console.log('📧 Test 2: Confirmation de commande...');
    const testOrder = {
      id: 12345,
      customer_name: 'Voyageur Cosmique',
      customer_email: adminEmail,
      customer_phone: '+224 123 456 789',
      shipping_address: '123 Rue de la Galaxie, Conakry, Guinée',
      delivery_zone: 'Conakry',
      subtotal: 500000,
      delivery_fee: 50000,
      total_amount: 550000,
      created_at: new Date().toISOString(),
    };

    const testItems = [
      {
        productName: 'T-Shirt Cosmique',
        quantity: 2,
        priceAtPurchase: 150000,
      },
      {
        productName: 'Pantalon Galaxie',
        quantity: 1,
        priceAtPurchase: 200000,
      },
    ];

    const orderContent = orderConfirmationContent(testOrder, testItems);
    const orderHtml = baseEmailTemplate({
      preheader: 'Confirmation de Commande',
      content: orderContent,
      cta: {
        text: 'Voir ma commande',
        url: `https://grandson-clothes.com/orders/${testOrder.id}`,
      },
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      subject: `Confirmation de commande #${testOrder.id}`,
      html: orderHtml,
    });
    console.log('✅ Email de confirmation de commande envoyé avec succès!');
    console.log('');

    // Test 3: Admin Order Notification
    console.log('📧 Test 3: Notification de commande pour admin...');
    const adminContent = adminOrderNotificationContent(testOrder, testItems);
    const adminHtml = baseEmailTemplate({
      preheader: 'Nouvelle Commande',
      content: adminContent,
      cta: {
        text: 'Voir la commande',
        url: `https://grandson-clothes.com/admin/orders/${testOrder.id}`,
      },
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmail,
      subject: `[NOUVELLE COMMANDE] #${testOrder.id} - ${testOrder.customer_name}`,
      html: adminHtml,
    });
    console.log('✅ Email de notification admin envoyé avec succès!');
    console.log('');

    console.log('🌟 Tous les emails de test ont été envoyés avec succès!');
    console.log('Vérifiez votre boîte mail:', adminEmail);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    process.exit(1);
  }
}

testEmails();
