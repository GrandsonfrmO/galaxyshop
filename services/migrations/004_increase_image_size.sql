-- Migration: 004_increase_image_size
-- Description: Change image_url from VARCHAR(500) to TEXT to support base64 images
-- Created: 2026-02-22

-- Modify products table to support larger image URLs (base64)
ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;

-- Modify pwa_settings table to support larger app icons (base64)
ALTER TABLE pwa_settings ALTER COLUMN app_icon TYPE TEXT;
