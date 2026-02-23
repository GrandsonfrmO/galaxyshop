import {
  sendOrderConfirmation,
  sendOrderNotificationToAdmin,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendShippingNotification,
  sendContactFormResponse
} from '../services/email';
import { validateInternalAuth, unauthorizedResponse } from '../services/auth';
import { validateEmail } from '../services/validation';

/**
 * Email API Routes
 * 
 * POST /api/email/order-confirmation - Send order confirmation (internal only)
 * POST /api/email/order-notification-admin - Send admin notification (internal only)
 * POST /api/email/welcome - Send welcome email (internal only)
 * POST /api/email/password-reset - Send password reset email (internal only)
 * POST /api/email/shipping-notification - Send shipping notification (internal only)
 * POST /api/email/contact-response - Send contact form response (internal only)
 */

export async function POST(request: Request) {
  // Validate internal authentication
  if (!validateInternalAuth(request)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Send order confirmation
    if (pathname.includes('/order-confirmation')) {
      const { order, items } = await request.json();

      if (!order || !items) {
        return new Response(
          JSON.stringify({ error: 'Order and items are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate order has required fields
      if (!order.id || !order.customerEmail || !order.customerName) {
        return new Response(
          JSON.stringify({ error: 'Order must have id, customerEmail, and customerName' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!validateEmail(order.customerEmail)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendOrderConfirmation(order, items);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send admin notification
    if (pathname.includes('/order-notification-admin')) {
      const { order, items } = await request.json();

      if (!order || !items) {
        return new Response(
          JSON.stringify({ error: 'Order and items are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate order has required fields
      if (!order.id || !order.customerEmail || !order.customerName) {
        return new Response(
          JSON.stringify({ error: 'Order must have id, customerEmail, and customerName' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendOrderNotificationToAdmin(order, items);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send welcome email
    if (pathname.includes('/welcome')) {
      const { email, name } = await request.json();

      if (!email || !name) {
        return new Response(
          JSON.stringify({ error: 'Email and name are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!validateEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate name is not empty
      if (typeof name !== 'string' || name.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Name must be a non-empty string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendWelcomeEmail(email, name);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send password reset email
    if (pathname.includes('/password-reset')) {
      const { email, resetLink } = await request.json();

      if (!email || !resetLink) {
        return new Response(
          JSON.stringify({ error: 'Email and resetLink are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!validateEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate resetLink is a valid URL
      try {
        new URL(resetLink);
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid reset link URL' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendPasswordResetEmail(email, resetLink);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send shipping notification
    if (pathname.includes('/shipping-notification')) {
      const { email, orderData } = await request.json();

      if (!email || !orderData) {
        return new Response(
          JSON.stringify({ error: 'Email and orderData are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!validateEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate orderData has required fields
      if (!orderData.id || !orderData.trackingNumber) {
        return new Response(
          JSON.stringify({ error: 'orderData must have id and trackingNumber' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendShippingNotification(email, orderData);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send contact form response
    if (pathname.includes('/contact-response')) {
      const { email, name, message } = await request.json();

      if (!email || !name || !message) {
        return new Response(
          JSON.stringify({ error: 'Email, name, and message are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate email format
      if (!validateEmail(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validate name and message are non-empty strings
      if (typeof name !== 'string' || name.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Name must be a non-empty string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (typeof message !== 'string' || message.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Message must be a non-empty string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const result = await sendContactFormResponse(email, name, message);
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Unknown email endpoint' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in email API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
