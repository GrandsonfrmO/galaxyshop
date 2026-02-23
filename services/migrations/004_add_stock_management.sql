-- Add stock management to products table
-- Migration: Add stock column to products

-- Add stock column if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Add index on stock for queries
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Add stock history table for audit trail
CREATE TABLE IF NOT EXISTS stock_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created_at ON stock_history(created_at DESC);

-- Function to log stock changes
CREATE OR REPLACE FUNCTION log_stock_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock != OLD.stock THEN
    INSERT INTO stock_history (product_id, quantity_change, reason)
    VALUES (NEW.id, NEW.stock - OLD.stock, 'Manual update');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log stock changes
DROP TRIGGER IF EXISTS trigger_log_stock_change ON products;
CREATE TRIGGER trigger_log_stock_change
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION log_stock_change();

-- Update initial products with stock
UPDATE products SET stock = 50 WHERE name = 'Grandson Hoodie V1';
UPDATE products SET stock = 100 WHERE name = 'Orbit Cap';
UPDATE products SET stock = 75 WHERE name = 'Lunar Cargo Pants';

-- Add constraint to ensure stock is not negative
ALTER TABLE products
ADD CONSTRAINT check_stock_not_negative CHECK (stock >= 0);
