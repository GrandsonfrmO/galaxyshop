-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  position_x FLOAT,
  position_y FLOAT,
  position_z FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  shipping_address TEXT,
  delivery_zone VARCHAR(100),
  delivery_fee INTEGER DEFAULT 0,
  subtotal INTEGER,
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  price_at_purchase INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  selected_size VARCHAR(50),
  selected_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Game Scores Table
CREATE TABLE IF NOT EXISTS game_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  wave INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);

-- Insert Initial Products
INSERT INTO products (name, description, price, category, image_url, sizes, colors, position_x, position_y, position_z)
VALUES
  (
    'Grandson Hoodie V1',
    'Heavyweight cotton hoodie with embroidered logo.',
    350000,
    'Vêtements',
    'https://picsum.photos/400/400?random=1',
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Black', 'Navy'],
    -4.5,
    0.8,
    0
  ),
  (
    'Orbit Cap',
    '5-panel cap structured for deep space exploration.',
    120000,
    'Accessoires',
    'https://picsum.photos/400/400?random=2',
    ARRAY['One Size'],
    ARRAY['Beige', 'Olive'],
    0,
    1.4,
    0
  ),
  (
    'Lunar Cargo Pants',
    'Technical cargo pants with multiple pockets and relaxed fit.',
    280000,
    'Pantalons',
    'https://picsum.photos/400/400?random=3',
    ARRAY['30', '32', '34', '36'],
    ARRAY['Black', 'Grey'],
    4.5,
    0.8,
    0
  )
ON CONFLICT DO NOTHING;

-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_zones_name ON delivery_zones(name);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id SERIAL PRIMARY KEY,
  login_time TIMESTAMP NOT NULL,
  logout_time TIMESTAMP,
  session_duration_days INTEGER DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_login_time ON admin_sessions(login_time);

-- Email Log Table for tracking all emails sent
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
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
  (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as delivered_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered') as total_revenue,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM users) as total_users;

-- Recent Orders View
CREATE OR REPLACE VIEW recent_orders AS
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
LIMIT 10;

-- Insert Default Delivery Zones
INSERT INTO delivery_zones (name, price)
VALUES
  ('Conakry', 5000),
  ('Kindia', 8000),
  ('Mamou', 10000)
ON CONFLICT (name) DO NOTHING;
