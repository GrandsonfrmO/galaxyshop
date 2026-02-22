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
  total_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

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

-- Insert Default Delivery Zones
INSERT INTO delivery_zones (name, price)
VALUES
  ('Conakry', 5000),
  ('Kindia', 8000),
  ('Mamou', 10000)
ON CONFLICT (name) DO NOTHING;
