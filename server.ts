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

// ============================================
// PUBLIC PWA API ROUTES
// ============================================
app.get('/api/pwa/settings', async (req, res) => {
  try {
    const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        appName: 'The Boutique',
        shortName: 'Boutique',
        description: 'Immersive fashion store with 3D experience',
        themeColor: '#a855f7',
        backgroundColor: '#050505',
        icons: {}
      });
    }
    
    const settings = result.rows[0];
    res.json({
      appName: settings.app_name,
      shortName: settings.short_name,
      description: settings.description,
      themeColor: settings.theme_color,
      backgroundColor: settings.background_color,
      icons: {
        icon16: settings.icon_16,
        icon32: settings.icon_32,
        icon72: settings.icon_72,
        icon96: settings.icon_96,
        icon120: settings.icon_120,
        icon128: settings.icon_128,
        icon144: settings.icon_144,
        icon152: settings.icon_152,
        icon167: settings.icon_167,
        icon180: settings.icon_180,
        icon192: settings.icon_192,
        icon384: settings.icon_384,
        icon512: settings.icon_512,
        icon192Maskable: settings.icon_192_maskable,
        icon512Maskable: settings.icon_512_maskable
      }
    });
  } catch (error) {
    console.error('Error fetching PWA settings:', error);
    res.status(500).json({ error: 'Failed to fetch PWA settings' });
  }
});

// Save PWA settings (admin)
app.post('/api/pwa/settings', async (req, res) => {
  try {
    const { appName, shortName, description, themeColor, backgroundColor } = req.body;
    
    await query(`
      UPDATE pwa_settings 
      SET app_name = $1, 
          short_name = $2, 
          description = $3, 
          theme_color = $4, 
          background_color = $5,
          updated_at = NOW()
      WHERE id = (SELECT id FROM pwa_settings ORDER BY id DESC LIMIT 1)
    `, [appName, shortName, description, themeColor, backgroundColor]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving PWA settings:', error);
    res.status(500).json({ error: 'Failed to save PWA settings' });
  }
});

// Get PWA icons (admin)
app.get('/api/pwa/icons', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({});
    }
    
    const settings = result.rows[0];
    res.json({
      icon16: settings.icon_16,
      icon32: settings.icon_32,
      icon72: settings.icon_72,
      icon96: settings.icon_96,
      icon120: settings.icon_120,
      icon128: settings.icon_128,
      icon144: settings.icon_144,
      icon152: settings.icon_152,
      icon167: settings.icon_167,
      icon180: settings.icon_180,
      icon192: settings.icon_192,
      icon384: settings.icon_384,
      icon512: settings.icon_512,
      icon192Maskable: settings.icon_192_maskable,
      icon512Maskable: settings.icon_512_maskable
    });
  } catch (error) {
    console.error('Error fetching PWA icons:', error);
    res.status(500).json({ error: 'Failed to fetch PWA icons' });
  }
});

// Save PWA icons (admin)
app.post('/api/pwa/icons', async (req, res) => {
  try {
    const icons = req.body;
    
    await query(`
      UPDATE pwa_settings 
      SET icon_16 = $1,
          icon_32 = $2,
          icon_72 = $3,
          icon_96 = $4,
          icon_120 = $5,
          icon_128 = $6,
          icon_144 = $7,
          icon_152 = $8,
          icon_167 = $9,
          icon_180 = $10,
          icon_192 = $11,
          icon_384 = $12,
          icon_512 = $13,
          icon_192_maskable = $14,
          icon_512_maskable = $15,
          updated_at = NOW()
      WHERE id = (SELECT id FROM pwa_settings ORDER BY id DESC LIMIT 1)
    `, [
      icons.icon16, icons.icon32, icons.icon72, icons.icon96, icons.icon120,
      icons.icon128, icons.icon144, icons.icon152, icons.icon167, icons.icon180,
      icons.icon192, icons.icon384, icons.icon512, icons.icon192Maskable, icons.icon512Maskable
    ]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving PWA icons:', error);
    res.status(500).json({ error: 'Failed to save PWA icons' });
  }
});

// Serve individual icon by size (public)
app.get('/api/pwa/icon/:size', async (req, res) => {
  try {
    const { size } = req.params;
    const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length > 0) {
      const settings = result.rows[0];
      
      // Map size to database column
      const sizeMap: { [key: string]: string } = {
        '16': settings.icon_16,
        '32': settings.icon_32,
        '72': settings.icon_72,
        '96': settings.icon_96,
        '120': settings.icon_120,
        '128': settings.icon_128,
        '144': settings.icon_144,
        '152': settings.icon_152,
        '167': settings.icon_167,
        '180': settings.icon_180,
        '192': settings.icon_192,
        '384': settings.icon_384,
        '512': settings.icon_512,
        '192-maskable': settings.icon_192_maskable,
        '512-maskable': settings.icon_512_maskable
      };
      
      const iconData = sizeMap[size];
      
      if (iconData) {
        // Convert base64 data URL to buffer
        const base64Data = iconData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        return res.send(buffer);
      }
    }
    
    // Fallback: serve static icon from public folder
    const iconPath = path.join(__dirname, 'public', `icon-${size}.png`);
    
    if (fs.existsSync(iconPath)) {
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=31536000');
      return res.sendFile(iconPath);
    }
    
    res.status(404).send('Icon not found');
  } catch (error) {
    console.error('Error serving icon:', error);
    res.status(500).send('Failed to serve icon');
  }
});

// Get dynamic manifest (public)
app.get('/api/pwa/manifest', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM pwa_settings ORDER BY id DESC LIMIT 1');
    
    let settings;
    if (result.rows.length === 0) {
      settings = {
        app_name: 'The Boutique',
        short_name: 'Boutique',
        description: 'Immersive fashion store with 3D experience',
        theme_color: '#a855f7',
        background_color: '#050505'
      };
    } else {
      settings = result.rows[0];
    }
    
    const manifest = {
      name: settings.app_name,
      short_name: settings.short_name,
      description: settings.description,
      start_url: '/',
      scope: '/',
      id: '/',
      display: 'standalone',
      display_override: ['standalone', 'fullscreen', 'minimal-ui'],
      orientation: 'portrait-primary',
      background_color: settings.background_color,
      theme_color: settings.theme_color,
      lang: 'fr-FR',
      dir: 'ltr',
      prefer_related_applications: false,
      icons: [
        { src: '/api/pwa/icon/72', sizes: '72x72', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/96', sizes: '96x96', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/128', sizes: '128x128', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/144', sizes: '144x144', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/152', sizes: '152x152', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/384', sizes: '384x384', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/api/pwa/icon/192-maskable', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/api/pwa/icon/512-maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ],
      screenshots: [
        { src: '/screenshot-540x720.png', sizes: '540x720', type: 'image/png', form_factor: 'narrow', label: 'Boutique principale' },
        { src: '/screenshot-1280x720.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Vue catalogue' }
      ],
      categories: ['shopping', 'lifestyle', 'entertainment'],
      shortcuts: [
        {
          name: 'Catalogue',
          short_name: 'Catalogue',
          description: 'Voir le catalogue',
          url: '/?tab=shop',
          icons: [{ src: '/api/pwa/icon/96', sizes: '96x96', type: 'image/png' }]
        },
        {
          name: 'Panier',
          short_name: 'Panier',
          description: 'Voir mon panier',
          url: '/?tab=cart',
          icons: [{ src: '/api/pwa/icon/96', sizes: '96x96', type: 'image/png' }]
        }
      ],
      share_target: {
        action: '/share',
        method: 'GET',
        params: { title: 'title', text: 'text', url: 'url' }
      }
    };
    
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache'); // Don't cache manifest
    res.json(manifest);
  } catch (error) {
    console.error('Error generating manifest:', error);
    res.status(500).json({ error: 'Failed to generate manifest' });
  }
});

// Save manifest (for compatibility - admin)
app.post('/api/pwa/manifest', async (_req, res) => {
  // Manifest is generated dynamically, so we just acknowledge the request
  res.json({ success: true });
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
