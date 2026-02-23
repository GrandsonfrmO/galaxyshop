import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { getDisplayProducts, getAllProducts, addProduct, updateProduct, deleteProduct } from './services/productService';
import { 
  createOrder, 
  logEmail
} from './services/orderService';
import { runMigrations } from './services/runMigrations';
import { 
  sendOrderConfirmation,
  sendOrderNotificationToAdmin
} from './services/email';
import { query } from './services/database';
import adminRoutes from './api/admin';
import { fileURLToPath } from 'url';
import {
  apiLimiter,
  authLimiter,
  orderLimiter,
  adminLimiter,
  csrfMiddleware,
  sanitizeRequestBody,
  ipWhitelistMiddleware,
  initializeIPWhitelist,
  authMiddleware,
} from './services/security/index';

dotenv.config({ path: '.env.local' });

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize IP whitelist if configured
if (process.env.IP_WHITELIST_ENABLED === 'true') {
  initializeIPWhitelist({
    enabled: true,
    ips: (process.env.WHITELISTED_IPS || '').split(',').filter(Boolean),
    allowPrivate: process.env.ALLOW_PRIVATE_IPS !== 'false',
  });
}

// Security Middleware (order matters)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Apply IP whitelist if enabled
if (process.env.IP_WHITELIST_ENABLED === 'true') {
  app.use(ipWhitelistMiddleware);
}

// Apply input sanitization
app.use(sanitizeRequestBody);

// Apply CSRF protection
app.use(csrfMiddleware);

// Apply rate limiting to all routes
app.use(apiLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// ADMIN API ROUTES
// ============================================
app.use('/api/admin', authLimiter, authMiddleware, adminLimiter, adminRoutes);

// Test endpoint for email logs
app.get('/api/test/email-logs', async (req, res) => {
  try {
    const { getEmailLogs } = await import('./services/orderService');
    const logs = await getEmailLogs(50);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs', details: String(error) });
  }
});

// ============================================
// EMAIL API ROUTES - REMOVED (Use /api/admin/email/* instead)
// ============================================
// ⚠️ Public email routes have been removed for security
// Use /api/admin/email/* routes with proper authentication instead

// ============================================
// PUBLIC PRODUCTS API ROUTES
// ============================================

// Get all products (public)
app.get('/api/products', async (_req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get display products (public)
app.get('/api/products/display', async (_req, res) => {
  try {
    const products = await getDisplayProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching display products:', error);
    res.status(500).json({ error: 'Failed to fetch display products' });
  }
});

// Create product (public - for frontend)
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await addProduct(product);
    
    if (!newProduct) {
      return res.status(400).json({ error: 'Failed to create product' });
    }
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (public - for frontend)
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = req.body;
    const updatedProduct = await updateProduct(product);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (public - for frontend)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteProduct(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================
// PUBLIC ORDERS API ROUTES
// ============================================

// Create order (public)
app.post('/api/orders', orderLimiter, async (req, res) => {
  try {
    const orderData = req.body;

    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail || !orderData.items || orderData.items.length === 0) {
      console.error('❌ Missing required fields:', { 
        hasName: !!orderData.customerName, 
        hasEmail: !!orderData.customerEmail, 
        hasItems: !!orderData.items && orderData.items.length > 0 
      });
      return res.status(400).json({ 
        error: 'Missing required fields: customerName, customerEmail, items' 
      });
    }

    console.log('📝 Creating order for:', orderData.customerEmail);
    console.log('📋 Order data:', JSON.stringify(orderData, null, 2));
    
    const order = await createOrder(orderData);
    console.log('✅ Order created with ID:', order.id);
    console.log('📊 Order details:', JSON.stringify(order, null, 2));
    
    // Send confirmation email to customer
    try {
      console.log('📧 Sending confirmation email to customer:', orderData.customerEmail);
      const emailResult = await sendOrderConfirmation(order, orderData.items);
      console.log('✅ Customer email sent successfully:', emailResult);
      await logEmail(order.id, orderData.customerEmail, `Confirmation de commande #${order.id}`, 'order_confirmation', 'sent');
    } catch (emailError) {
      console.error('❌ Error sending customer email:', emailError);
      await logEmail(order.id, orderData.customerEmail, `Confirmation de commande #${order.id}`, 'order_confirmation', 'failed', String(emailError));
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        console.log('📧 Sending admin notification to:', adminEmail);
        const emailResult = await sendOrderNotificationToAdmin(order, orderData.items);
        console.log('✅ Admin email sent successfully:', emailResult);
        await logEmail(order.id, adminEmail, `[NOUVELLE COMMANDE] #${order.id} - ${orderData.customerName}`, 'admin_notification', 'sent');
      } else {
        console.warn('⚠️ ADMIN_EMAIL not configured');
      }
    } catch (emailError) {
      console.error('❌ Error sending admin email:', emailError);
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await logEmail(order.id, adminEmail, `[NOUVELLE COMMANDE] #${order.id} - ${orderData.customerName}`, 'admin_notification', 'failed', String(emailError));
      }
    }
    
    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: String(error)
    });
  }
});



// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Run migrations on startup
  try {
    console.log('🔄 Running database migrations...');
    await runMigrations();
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
});
