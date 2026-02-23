import { config } from 'dotenv';
import pool from './database';

config({ path: '.env.local' });

export interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
  deliveryZone: string;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  items: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  priceAtPurchase: number;
}

/**
 * Create a new order with items
 */
export const createOrder = async (orderData: OrderData) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        shipping_address, delivery_zone, delivery_fee,
        subtotal, total_amount, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        orderData.deliveryAddress,
        orderData.deliveryZone,
        orderData.deliveryFee,
        orderData.subtotal,
        orderData.totalAmount,
        'pending',
        orderData.notes
      ]
    );
    
    const order = orderResult.rows[0];
    
    // Insert order items
    for (const item of orderData.items) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, quantity,
          selected_size, selected_color, price_at_purchase
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.productId,
          item.quantity,
          item.selectedSize,
          item.selectedColor,
          item.priceAtPurchase
        ]
      );
    }
    
    await client.query('COMMIT');
    
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get all orders with items
 */
export const getAllOrders = async () => {
  const result = await pool.query(`
    SELECT 
      o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'productName', p.name,
            'quantity', oi.quantity,
            'selectedSize', oi.selected_size,
            'selectedColor', oi.selected_color,
            'priceAtPurchase', oi.price_at_purchase,
            'imageUrl', p.image_url
          ) ORDER BY oi.id
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  
  return result.rows;
};

/**
 * Get order by ID with items
 */
export const getOrderById = async (orderId: number) => {
  const result = await pool.query(`
    SELECT 
      o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'productName', p.name,
            'quantity', oi.quantity,
            'selectedSize', oi.selected_size,
            'selectedColor', oi.selected_color,
            'priceAtPurchase', oi.price_at_purchase,
            'imageUrl', p.image_url
          ) ORDER BY oi.id
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1
    GROUP BY o.id
  `, [orderId]);
  
  return result.rows[0];
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  const result = await pool.query(
    `UPDATE orders 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING *`,
    [status, orderId]
  );
  
  return result.rows[0];
};

/**
 * Mark email as sent for order
 */
export const markEmailSent = async (orderId: number) => {
  const result = await pool.query(
    `UPDATE orders 
     SET email_sent = TRUE, email_sent_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [orderId]
  );
  
  return result.rows[0];
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const result = await pool.query('SELECT * FROM dashboard_stats');
  return result.rows[0];
};

/**
 * Get recent orders
 */
export const getRecentOrders = async (limit: number = 10) => {
  const result = await pool.query(`
    SELECT * FROM recent_orders LIMIT $1
  `, [limit]);
  
  return result.rows;
};

/**
 * Log email sent
 */
export const logEmail = async (
  orderId: number | null,
  recipientEmail: string,
  subject: string,
  emailType: string,
  status: string = 'sent',
  errorMessage: string | null = null
) => {
  const result = await pool.query(
    `INSERT INTO email_logs (
      order_id, recipient_email, subject, email_type, status, error_message, sent_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *`,
    [orderId, recipientEmail, subject, emailType, status, errorMessage]
  );
  
  return result.rows[0];
};

/**
 * Get email logs
 */
export const getEmailLogs = async (limit: number = 50) => {
  const result = await pool.query(`
    SELECT * FROM email_logs 
    ORDER BY created_at DESC 
    LIMIT $1
  `, [limit]);
  
  return result.rows;
};
