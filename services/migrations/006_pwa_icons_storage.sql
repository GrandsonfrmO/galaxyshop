-- Migration: 006_pwa_icons_storage
-- Description: Store PWA icons in database for proper mobile display
-- Created: 2026-02-22

-- Drop old pwa_settings table
DROP TABLE IF EXISTS pwa_settings;

-- Create new pwa_settings table with all icon sizes
CREATE TABLE IF NOT EXISTS pwa_settings (
  id SERIAL PRIMARY KEY,
  app_name VARCHAR(255) DEFAULT 'The Boutique',
  short_name VARCHAR(50) DEFAULT 'Boutique',
  description TEXT DEFAULT 'Immersive fashion store with 3D experience',
  theme_color VARCHAR(7) DEFAULT '#a855f7',
  background_color VARCHAR(7) DEFAULT '#050505',
  
  -- Store all icon sizes as base64 data URLs
  icon_16 TEXT,
  icon_32 TEXT,
  icon_72 TEXT,
  icon_96 TEXT,
  icon_120 TEXT,
  icon_128 TEXT,
  icon_144 TEXT,
  icon_152 TEXT,
  icon_167 TEXT,
  icon_180 TEXT,
  icon_192 TEXT,
  icon_384 TEXT,
  icon_512 TEXT,
  icon_192_maskable TEXT,
  icon_512_maskable TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO pwa_settings (app_name, short_name, description, theme_color, background_color)
VALUES ('The Boutique', 'Boutique', 'Immersive fashion store with 3D experience', '#a855f7', '#050505')
ON CONFLICT DO NOTHING;
