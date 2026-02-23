-- Migration: 005_fix_product_images_size
-- Description: Change product_images.image_url from VARCHAR(500) to TEXT to support base64 images
-- Created: 2026-02-22

-- Modify product_images table to support larger image URLs (base64)
ALTER TABLE product_images ALTER COLUMN image_url TYPE TEXT;
