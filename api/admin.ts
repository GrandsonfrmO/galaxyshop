import { Router } from 'express';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/productService';
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus,
  getDashboardStats,
  getRecentOrders,
  getEmailLogs
} from '../services/orderService';
import { 
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendShippingNotification,
  sendContactFormResponse
} from '../services/email';
import { query } from '../services/database';
import { Product } from '../types';

const router = Router();

// ============================================
// PRODUCTS ADMIN ROUTES
// ============================================

// Get all products (admin)
router.get('/products', async (_req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product (admin)
router.post('/products', async (req, res) => {
  try {
    const product: Product = req.body;
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

// Update product (admin)
router.put('/products/:id', async (req, res) => {
  try {
    const product: Product = req.body;
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

// Delete product (admin)
router.delete('/products/:id', async (req, res) => {
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
// ORDERS ADMIN ROUTES
// ============================================

// Get all orders (admin)
router.get('/orders', async (_req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (admin)
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(parseInt(id));
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await updateOrderStatus(parseInt(id), status);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ============================================
// DASHBOARD ADMIN ROUTES
// ============================================

// Get dashboard statistics (admin)
router.get('/dashboard/stats', async (_req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get recent orders (admin)
router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const orders = await getRecentOrders(limit);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// ============================================
// EMAIL LOGS ADMIN ROUTES
// ============================================

// Get email logs (admin)
router.get('/email-logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await getEmailLogs(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// ============================================
// DELIVERY ZONES ADMIN ROUTES
// ============================================

// Get all delivery zones (admin)
router.get('/delivery-zones', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM delivery_zones ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    res.status(500).json({ error: 'Failed to fetch delivery zones' });
  }
});

// Create delivery zone (admin)
router.post('/delivery-zones', async (req, res) => {
  try {
    const { name, price } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const result = await query(
      'INSERT INTO delivery_zones (name, price) VALUES ($1, $2) RETURNING *',
      [name, price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating delivery zone:', error);
    res.status(500).json({ error: 'Failed to create delivery zone' });
  }
});

// Update delivery zone (admin)
router.put('/delivery-zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const result = await query(
      'UPDATE delivery_zones SET name = $1, price = $2 WHERE id = $3 RETURNING *',
      [name, price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery zone not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating delivery zone:', error);
    res.status(500).json({ error: 'Failed to update delivery zone' });
  }
});

// Delete delivery zone (admin)
router.delete('/delivery-zones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM delivery_zones WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery zone not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting delivery zone:', error);
    res.status(500).json({ error: 'Failed to delete delivery zone' });
  }
});


// ============================================
// EMAIL ADMIN ROUTES
// ============================================

// Send order confirmation email (admin)
router.post('/email/order-confirmation', async (req, res) => {
  try {
    const { order, items } = req.body;

    if (!order || !items) {
      return res.status(400).json({ error: 'Order and items are required' });
    }

    const result = await sendOrderConfirmation(order, items);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

// Send welcome email (admin)
router.post('/email/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const result = await sendWelcomeEmail(email, name);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

// Send password reset email (admin)
router.post('/email/password-reset', async (req, res) => {
  try {
    const { email, resetLink } = req.body;

    if (!email || !resetLink) {
      return res.status(400).json({ error: 'Email and resetLink are required' });
    }

    const result = await sendPasswordResetEmail(email, resetLink);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

// Send shipping notification email (admin)
router.post('/email/shipping-notification', async (req, res) => {
  try {
    const { email, orderData } = req.body;

    if (!email || !orderData) {
      return res.status(400).json({ error: 'Email and orderData are required' });
    }

    const result = await sendShippingNotification(email, orderData);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

// Send contact form response email (admin)
router.post('/email/contact-response', async (req, res) => {
  try {
    const { email, name, message } = req.body;

    if (!email || !name || !message) {
      return res.status(400).json({ error: 'Email, name, and message are required' });
    }

    const result = await sendContactFormResponse(email, name, message);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending contact response email:', error);
    res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

export default router;
