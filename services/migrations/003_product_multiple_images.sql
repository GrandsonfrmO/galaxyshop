-- Migration: 003_product_multiple_images
-- Description: Add support for multiple images per product (up to 5)
-- Created: 2026-02-22

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, display_order);

-- Add constraint to limit 5 images per product
CREATE OR REPLACE FUNCTION check_product_images_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM product_images WHERE product_id = NEW.product_id) >= 5 THEN
    RAISE EXCEPTION 'Un produit ne peut avoir que 5 images maximum';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_product_images_limit
  BEFORE INSERT ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION check_product_images_limit();

-- Migrate existing product images to product_images table
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT id, image_url, name, 0
FROM products
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- Add comment to image_url column to indicate it's for backward compatibility
COMMENT ON COLUMN products.image_url IS 'Deprecated: Use product_images table instead. Kept for backward compatibility.';
