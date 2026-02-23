-- Security Fixes Migration
-- Adds foreign key constraint for delivery_zone to ensure referential integrity

-- Add foreign key constraint for delivery_zone
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_delivery_zone 
FOREIGN KEY (delivery_zone) 
REFERENCES delivery_zones(name) 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Create index on delivery_zone for better query performance
CREATE INDEX idx_orders_delivery_zone ON orders(delivery_zone);

-- Create index on order status for dashboard queries
CREATE INDEX idx_orders_status ON orders(status);

-- Create index on created_at for time-based queries
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Add email_logs table for tracking email sends (for retry mechanism)
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email_logs for status and retry queries
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX idx_email_logs_retry ON email_logs(status, retry_count) WHERE status = 'failed' AND retry_count < max_retries;
