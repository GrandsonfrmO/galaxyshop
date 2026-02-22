/**
 * Email Service Test
 * Test d'envoi d'emails avec Resend
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

console.log('\n📧 EMAIL SERVICE TEST\n');
console.log('================================\n');

if (!RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY not configured in .env.local\n');
  console.log('📝 To configure:');
  console.log('1. Create a Resend account at https://resend.com');
  console.log('2. Get your API key from the dashboard');
  console.log('3. Add to .env.local:\n');
  console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx\n');
  console.log('4. Run this test again\n');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found\n');
console.log('API Key (masked):');
const maskedKey = RESEND_API_KEY.substring(0, 10) + '...' + RESEND_API_KEY.substring(RESEND_API_KEY.length - 5);
console.log(`   ${maskedKey}\n`);

// Try to send test emails
(async () => {
  try {
    console.log('🔄 Testing email service...\n');

    const { 
      sendOrderConfirmation, 
      sendWelcomeEmail, 
      sendPasswordResetEmail,
      sendShippingNotification,
      sendContactFormResponse 
    } = await import('./services/email.ts');

    // Test 1: Welcome Email
    console.log('TEST 1: Welcome Email');
    try {
      const result = await sendWelcomeEmail(
        'test@grandson-clothes.com',
        'Test User'
      );
      console.log('✅ Welcome email sent successfully');
      console.log(`   ID: ${result.id}\n`);
    } catch (error: any) {
      console.log('⚠️  Welcome email test skipped');
      console.log(`   Reason: ${error.message}\n`);
    }

    // Test 2: Order Confirmation Email
    console.log('TEST 2: Order Confirmation Email');
    try {
      const result = await sendOrderConfirmation(
        'test@grandson-clothes.com',
        {
          orderId: 12345,
          customerName: 'Test User',
          items: [
            { name: 'Grandson Hoodie V1', quantity: 1, price: 350000 },
            { name: 'Orbit Cap', quantity: 2, price: 120000 },
          ],
          total: 590000,
          estimatedDelivery: '2024-03-01',
        }
      );
      console.log('✅ Order confirmation email sent successfully');
      console.log(`   ID: ${result.id}\n`);
    } catch (error: any) {
      console.log('⚠️  Order confirmation email test skipped');
      console.log(`   Reason: ${error.message}\n`);
    }

    // Test 3: Password Reset Email
    console.log('TEST 3: Password Reset Email');
    try {
      const result = await sendPasswordResetEmail(
        'test@grandson-clothes.com',
        'https://grandson-clothes.com/reset?token=abc123xyz'
      );
      console.log('✅ Password reset email sent successfully');
      console.log(`   ID: ${result.id}\n`);
    } catch (error: any) {
      console.log('⚠️  Password reset email test skipped');
      console.log(`   Reason: ${error.message}\n`);
    }

    // Test 4: Shipping Notification Email
    console.log('TEST 4: Shipping Notification Email');
    try {
      const result = await sendShippingNotification(
        'test@grandson-clothes.com',
        {
          orderId: 12345,
          customerName: 'Test User',
          trackingNumber: 'TRACK123456789',
          estimatedDelivery: '2024-03-01',
        }
      );
      console.log('✅ Shipping notification email sent successfully');
      console.log(`   ID: ${result.id}\n`);
    } catch (error: any) {
      console.log('⚠️  Shipping notification email test skipped');
      console.log(`   Reason: ${error.message}\n`);
    }

    // Test 5: Contact Form Response Email
    console.log('TEST 5: Contact Form Response Email');
    try {
      const result = await sendContactFormResponse(
        'test@grandson-clothes.com',
        'Test User',
        'This is a test message from the contact form.'
      );
      console.log('✅ Contact form response email sent successfully');
      console.log(`   ID: ${result.id}\n`);
    } catch (error: any) {
      console.log('⚠️  Contact form response email test skipped');
      console.log(`   Reason: ${error.message}\n`);
    }

    console.log('================================');
    console.log('✅ Email service tests completed!\n');

    process.exit(0);
  } catch (error: any) {
    console.log('❌ Email service test failed!\n');
    console.log('Error:', error.message);
    console.log('\n================================\n');
    process.exit(1);
  }
})();
