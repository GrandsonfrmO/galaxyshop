-- Migration: 004_critical_fixes
-- Description: Fix critical database issues
-- Created: 2026-02-23
-- Issues Fixed:
--   1. Add FK constraint for delivery_zone
--   2. Add email confirmation system
--   3. Add soft delete support
--   4. Add email retry tracking
--   5. Add pagination support
--   6. Optimize views with materialization

-- ============================================
-- 1. FIX: Add Foreign Key for delivery_zone
-- ============================================
-- First, ensure delivery_zone column exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone_id INTEGER;

-- Add foreign key constraint
ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS fk_orders_delivery_zone
  FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id) ON DELETE RESTRICT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_delivery_zone_id ON orders(delivery_zone_id);

-- ============================================
-- 2. EMAIL CONFIRMATION SYSTEM
-- ============================================
-- Email Verification Table
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_verified ON email_verifications(verified);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- Add email_verified column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- ============================================
-- 3. EMAIL RETRY SYSTEM
-- ============================================
-- Enhanced Email Logs with retry tracking
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMP;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS resend_id VARCHAR(255);

-- Create index for retry queries
CREATE INDEX IF NOT EXISTS idx_email_logs_retry ON email_logs(status, next_retry_at)
  WHERE status = 'failed' AND next_retry_at IS NOT NULL;

-- ============================================
-- 4. SOFT DELETE SUPPORT
-- ============================================
-- Add soft delete columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_reason VARCHAR(255);

-- Create index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders(deleted_at);

-- Add soft delete columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);

-- Add soft delete columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- ============================================
-- 5. PAGINATION SUPPORT
-- ============================================
-- Add row_number helper view for pagination
CREATE OR REPLACE VIEW orders_paginated AS
SELECT 
  o.id,
  o.user_id,
  o.customer_name,
  o.customer_email,
  o.customer_phone,
  o.total_amount,
  o.status,
  o.delivery_zone_id,
  o.delivery_fee,
  o.created_at,
  o.updated_at,
  ROW_NUMBER() OVER (ORDER BY o.created_at DESC) as row_num
FROM orders o
WHERE o.deleted_at IS NULL;

-- ============================================
-- 6. OPTIMIZE VIEWS WITH MATERIALIZATION
-- ============================================
-- Materialized view for dashboard stats (can be refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats_materialized AS
SELECT
  (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL) as total_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending' AND deleted_at IS NULL) as pending_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'completed' AND deleted_at IS NULL) as completed_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed' AND deleted_at IS NULL) as total_revenue,
  (SELECT COUNT(*) FROM products WHERE deleted_at IS NULL) as total_products,
  (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) as total_users,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'sent') as emails_sent,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'failed') as emails_failed,
  NOW() as last_updated;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_materialized_last_updated 
  ON dashboard_stats_materialized(last_updated);

-- ============================================
-- 7. AUDIT TRAIL TABLE
-- ============================================
-- Track all important changes for compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at DESC);

-- ============================================
-- 8. PERFORMANCE INDEXES
-- ============================================
-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_email_logs_order_status ON email_logs(order_id, status);

-- ============================================
-- 9. UPDATE EXISTING VIEWS
-- ============================================
-- Update dashboard_stats view to exclude soft-deleted records
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL) as total_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending' AND deleted_at IS NULL) as pending_orders,
  (SELECT COUNT(*) FROM orders WHERE status = 'completed' AND deleted_at IS NULL) as completed_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed' AND deleted_at IS NULL) as total_revenue,
  (SELECT COUNT(*) FROM products WHERE deleted_at IS NULL) as total_products,
  (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) as total_users,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'sent') as emails_sent,
  (SELECT COUNT(*) FROM email_logs WHERE status = 'failed') as emails_failed;

-- Update recent_orders view to exclude soft-deleted records
CREATE OR REPLACE VIEW recent_orders AS
SELECT 
  o.id,
  o.customer_name,
  o.customer_email,
  o.customer_phone,
  o.total_amount,
  o.status,
  o.delivery_zone_id,
  o.created_at,
  COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.deleted_at IS NULL
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 50;
