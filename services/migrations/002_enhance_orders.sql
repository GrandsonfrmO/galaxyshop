-- Migration: 002_enhance_orders
-- Description: Enhance orders table with customer info and email tracking
-- Created: 2026-02-22

-- Add customer information columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP;

-- Create index for email tracking
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Email Log Table for tracking all emails sent
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  email_type VARCHAR(50) NOT NULL, -- 'order_confirmation', 'order_status', 'admin_notification'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Dashboard Stats View for quick access
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM orders) as total_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_revenue,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'sent') as emails_sent,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'failed') as emails_failed;

-- Recent Orders View
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
  o.id,
  o.customer_name,
  o.customer_email,
  o.customer_phone,
  o.total_amount,
  o.status,
  o.delivery_zone,
  o.created_at,
  COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 50;
