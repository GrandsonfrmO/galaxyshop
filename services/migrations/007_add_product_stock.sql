-- Migration: 007_add_product_stock
-- Description: Add stock management to products
-- Created: 2026-02-22

-- Add stock column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Add index for stock queries
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Update existing products to have unlimited stock (set to 999)
UPDATE products SET stock = 999 WHERE stock = 0;

-- Add comment
COMMENT ON COLUMN products.stock IS 'Quantité en stock. 0 = rupture de stock mais toujours commandable';
