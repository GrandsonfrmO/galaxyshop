/**
 * Database Query Examples
 * Exemples de requêtes pour utiliser la base de données Neon
 */

import { query } from './database';

// ============================================
// PRODUCTS QUERIES
// ============================================

export const getAllProducts = async () => {
  const result = await query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
};

export const getProductById = async (id: number) => {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

export const getProductsByCategory = async (category: string) => {
  const result = await query(
    'SELECT * FROM products WHERE category = $1 ORDER BY name',
    [category]
  );
  return result.rows;
};

export const createProduct = async (product: any) => {
  const result = await query(
    `INSERT INTO products (name, description, price, category, image_url, sizes, colors, position_x, position_y, position_z)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      product.name,
      product.description,
      product.price,
      product.category,
      product.image_url,
      product.sizes,
      product.colors,
      product.position_x,
      product.position_y,
      product.position_z,
    ]
  );
  return result.rows[0];
};

export const updateProduct = async (id: number, product: any) => {
  const result = await query(
    `UPDATE products 
     SET name = $1, description = $2, price = $3, category = $4, image_url = $5, sizes = $6, colors = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [
      product.name,
      product.description,
      product.price,
      product.category,
      product.image_url,
      product.sizes,
      product.colors,
      id,
    ]
  );
  return result.rows[0];
};

export const deleteProduct = async (id: number) => {
  const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// ============================================
// USERS QUERIES
// ============================================

export const getUserByEmail = async (email: string) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const createUser = async (user: any) => {
  const result = await query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role, created_at`,
    [user.email, user.password_hash, user.name, user.role || 'customer']
  );
  return result.rows[0];
};

export const getUserById = async (id: number) => {
  const result = await query(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// ============================================
// ORDERS QUERIES
// ============================================

export const createOrder = async (userId: number, totalAmount: number) => {
  const result = await query(
    `INSERT INTO orders (user_id, total_amount, status)
     VALUES ($1, $2, 'pending')
     RETURNING *`,
    [userId, totalAmount]
  );
  return result.rows[0];
};

export const getOrderById = async (id: number) => {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0];
};

export const getUserOrders = async (userId: number) => {
  const result = await query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const result = await query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

// ============================================
// ORDER ITEMS QUERIES
// ============================================

export const addOrderItem = async (
  orderId: number,
  productId: number,
  quantity: number,
  selectedSize: string,
  selectedColor: string,
  priceAtPurchase: number
) => {
  const result = await query(
    `INSERT INTO order_items (order_id, product_id, quantity, selected_size, selected_color, price_at_purchase)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [orderId, productId, quantity, selectedSize, selectedColor, priceAtPurchase]
  );
  return result.rows[0];
};

export const getOrderItems = async (orderId: number) => {
  const result = await query(
    `SELECT oi.*, p.name, p.image_url
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return result.rows;
};

// ============================================
// CART QUERIES
// ============================================

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number,
  selectedSize: string,
  selectedColor: string
) => {
  const result = await query(
    `INSERT INTO cart_items (user_id, product_id, quantity, selected_size, selected_color)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, product_id, selected_size, selected_color) 
     DO UPDATE SET quantity = quantity + $3, updated_at = NOW()
     RETURNING *`,
    [userId, productId, quantity, selectedSize, selectedColor]
  );
  return result.rows[0];
};

export const getCartItems = async (userId: number) => {
  const result = await query(
    `SELECT ci.*, p.name, p.price, p.image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const removeFromCart = async (cartItemId: number) => {
  const result = await query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [
    cartItemId,
  ]);
  return result.rows[0];
};

export const clearCart = async (userId: number) => {
  const result = await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  return result.rowCount;
};

// ============================================
// GAME SCORES QUERIES
// ============================================

export const saveGameScore = async (userId: number, score: number, wave: number) => {
  const result = await query(
    `INSERT INTO game_scores (user_id, score, wave)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, score, wave]
  );
  return result.rows[0];
};

export const getTopScores = async (limit: number = 10) => {
  const result = await query(
    `SELECT gs.*, u.name, u.email
     FROM game_scores gs
     JOIN users u ON gs.user_id = u.id
     ORDER BY gs.score DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getUserHighScore = async (userId: number) => {
  const result = await query(
    `SELECT MAX(score) as high_score FROM game_scores WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.high_score || 0;
};

// ============================================
// STATISTICS QUERIES
// ============================================

export const getDashboardStats = async () => {
  const stats: any = {};

  // Total Revenue
  const revenue = await query(
    'SELECT SUM(total_amount) as total FROM orders WHERE status = $1',
    ['completed']
  );
  stats.totalRevenue = revenue.rows[0]?.total || 0;

  // Total Orders
  const orders = await query('SELECT COUNT(*) as count FROM orders');
  stats.totalOrders = orders.rows[0]?.count || 0;

  // Total Products
  const products = await query('SELECT COUNT(*) as count FROM products');
  stats.totalProducts = products.rows[0]?.count || 0;

  // Total Users
  const users = await query('SELECT COUNT(*) as count FROM users');
  stats.totalUsers = users.rows[0]?.count || 0;

  // Top Products
  const topProducts = await query(
    `SELECT p.id, p.name, COUNT(oi.id) as sales, SUM(oi.price_at_purchase * oi.quantity) as revenue
     FROM products p
     LEFT JOIN order_items oi ON p.id = oi.product_id
     GROUP BY p.id, p.name
     ORDER BY sales DESC
     LIMIT 5`
  );
  stats.topProducts = topProducts.rows;

  return stats;
};

export const getMonthlyRevenue = async () => {
  const result = await query(
    `SELECT 
       DATE_TRUNC('month', created_at) as month,
       SUM(total_amount) as revenue,
       COUNT(*) as orders
     FROM orders
     WHERE status = 'completed'
     GROUP BY DATE_TRUNC('month', created_at)
     ORDER BY month DESC
     LIMIT 12`
  );
  return result.rows;
};


// ============================================
// DELIVERY ZONES QUERIES
// ============================================

export const getAllDeliveryZones = async () => {
  const result = await query('SELECT * FROM delivery_zones ORDER BY name');
  return result.rows;
};

export const getDeliveryZoneById = async (id: number) => {
  const result = await query('SELECT * FROM delivery_zones WHERE id = $1', [id]);
  return result.rows[0];
};

export const createDeliveryZone = async (name: string, price: number) => {
  const result = await query(
    `INSERT INTO delivery_zones (name, price)
     VALUES ($1, $2)
     RETURNING *`,
    [name, price]
  );
  return result.rows[0];
};

export const updateDeliveryZone = async (id: number, name: string, price: number) => {
  const result = await query(
    `UPDATE delivery_zones 
     SET name = $1, price = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [name, price, id]
  );
  return result.rows[0];
};

export const deleteDeliveryZone = async (id: number) => {
  const result = await query('DELETE FROM delivery_zones WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// ============================================
// ADMIN SESSIONS QUERIES
// ============================================

export const createAdminSession = async (sessionDurationDays: number = 7) => {
  const result = await query(
    `INSERT INTO admin_sessions (login_time, session_duration_days)
     VALUES (NOW(), $1)
     RETURNING *`,
    [sessionDurationDays]
  );
  return result.rows[0];
};

export const endAdminSession = async (sessionId: number) => {
  const result = await query(
    `UPDATE admin_sessions 
     SET logout_time = NOW()
     WHERE id = $1
     RETURNING *`,
    [sessionId]
  );
  return result.rows[0];
};

export const getActiveSessions = async () => {
  const result = await query(
    `SELECT * FROM admin_sessions 
     WHERE logout_time IS NULL 
     AND (NOW() - login_time) < (session_duration_days || ' days')::INTERVAL
     ORDER BY login_time DESC`
  );
  return result.rows;
};

export const getSessionHistory = async (limit: number = 50) => {
  const result = await query(
    `SELECT * FROM admin_sessions 
     ORDER BY login_time DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getExpiredSessions = async () => {
  const result = await query(
    `SELECT * FROM admin_sessions 
     WHERE logout_time IS NULL 
     AND (NOW() - login_time) >= (session_duration_days || ' days')::INTERVAL`
  );
  return result.rows;
};
