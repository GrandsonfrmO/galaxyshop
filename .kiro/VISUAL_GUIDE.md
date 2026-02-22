# Visual Guide - Neon Database Integration

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  http://localhost:3000                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  React App (App.tsx)                                │  │  │
│  │  │  - Renders 3D Scene                                 │  │  │
│  │  │  - Shows 3 Products                                 │  │  │
│  │  │  - Admin Panel                                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Zustand Store                                      │  │  │
│  │  │  - displayProducts                                  │  │  │
│  │  │  - loadDisplayProducts()                            │  │  │
│  │  │  - addProduct()                                     │  │  │
│  │  │  - updateProduct()                                  │  │  │
│  │  │  - deleteProduct()                                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  API Client (services/api.ts)                       │  │  │
│  │  │  - fetch('/api/products/display')                   │  │  │
│  │  │  - fetch('/api/products', POST)                     │  │  │
│  │  │  - fetch('/api/products/:id', PUT)                  │  │  │
│  │  │  - fetch('/api/products/:id', DELETE)               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Vite Proxy                                         │  │  │
│  │  │  /api/* → http://localhost:5000/api/*              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  http://localhost:5000                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Express Server (server.ts)                         │  │  │
│  │  │  - GET /api/products                                │  │  │
│  │  │  - GET /api/products/display                        │  │  │
│  │  │  - POST /api/products                               │  │  │
│  │  │  - PUT /api/products/:id                            │  │  │
│  │  │  - DELETE /api/products/:id                         │  │  │
│  │  │  - GET /health                                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Product Service (services/productService.ts)       │  │  │
│  │  │  - getAllProducts()                                 │  │  │
│  │  │  - getDisplayProducts()                             │  │  │
│  │  │  - addProduct()                                     │  │  │
│  │  │  - updateProduct()                                  │  │  │
│  │  │  - deleteProduct()                                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Database Service (services/database.ts)            │  │  │
│  │  │  - Connection Pool                                  │  │  │
│  │  │  - query()                                          │  │  │
│  │  │  - getClient()                                      │  │  │
│  │  │  - closePool()                                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Migrations (services/runMigrations.ts)             │  │  │
│  │  │  - Runs on startup                                  │  │  │
│  │  │  - Creates tables                                   │  │  │
│  │  │  - Inserts initial data                             │  │  │
│  │  │  - Tracks executed migrations                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEON CLOUD                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                      │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Tables:                                            │  │  │
│  │  │  - products (id, name, price, description, ...)     │  │  │
│  │  │  - users                                            │  │  │
│  │  │  - orders                                           │  │  │
│  │  │  - order_items                                      │  │  │
│  │  │  - cart_items                                       │  │  │
│  │  │  - game_scores                                      │  │  │
│  │  │  - delivery_zones                                   │  │  │
│  │  │  - admin_sessions                                   │  │  │
│  │  │  - pwa_settings                                     │  │  │
│  │  │  - migrations (tracking)                            │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Startup Sequence

```
┌─────────────────────────────────────────────────────────────┐
│  npm run dev:full                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Starts (port 5000)                                 │
│  - Express server initializes                               │
│  - Loads .env.local                                         │
│  - Connects to Neon database                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Migrations Run                                             │
│  - Creates migrations table                                 │
│  - Reads migration files                                    │
│  - Executes 001_initial_schema.sql                          │
│  - Creates all tables                                       │
│  - Inserts 3 initial products                               │
│  - Records migration as executed                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend Starts (port 3000)                                │
│  - Vite dev server initializes                              │
│  - React app loads                                          │
│  - API proxy configured                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  App Component Mounts                                       │
│  - App.tsx renders                                          │
│  - useEffect hook runs                                      │
│  - loadDisplayProducts() called                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Load Display Products                                      │
│  - Zustand action triggered                                 │
│  - API client called                                        │
│  - fetch('/api/products/display')                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Vite Proxy Routes Request                                  │
│  - /api/products/display                                    │
│  - → http://localhost:5000/api/products/display             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Handles Request                                    │
│  - Express receives GET request                             │
│  - Calls getDisplayProducts()                               │
│  - Executes SQL: SELECT * FROM products LIMIT 3             │
│  - Returns 3 products as JSON                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend Receives Data                                     │
│  - API client receives response                             │
│  - Zustand store updates displayProducts                    │
│  - React re-renders                                         │
│  - 3D scene renders with 3 products                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ✅ Application Ready                                       │
│  - 3 products visible in 3D scene                           │
│  - Admin panel functional                                   │
│  - Ready for user interaction                               │
└─────────────────────────────────────────────────────────────┘
```

## Adding a Product Flow

```
┌──────────────────────────────────────────────────────────────┐
│  User clicks "Ajouter un produit" in admin panel             │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Admin form opens                                            │
│  - User fills in product details                             │
│  - Name, price, description, image, etc.                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  User clicks "Enregistrer"                                   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  addProduct() called in Zustand store                        │
│  - Product object created                                    │
│  - API client called                                         │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  POST /api/products                                          │
│  - Vite proxy routes to backend                              │
│  - Express receives request                                  │
│  - productService.addProduct() called                        │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Database Operation                                          │
│  - INSERT INTO products (...)                                │
│  - Database returns new product with ID                      │
│  - Backend returns product as JSON                           │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Frontend Updates                                            │
│  - Zustand store updates products array                      │
│  - loadDisplayProducts() called again                        │
│  - Fetch latest 3 products                                   │
│  - 3D scene updates                                          │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  ✅ Product Added                                            │
│  - New product visible in 3D scene                           │
│  - Saved to Neon database                                    │
│  - Persists across page refreshes                            │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│  products                                                   │
├─────────────────────────────────────────────────────────────┤
│  id (SERIAL PRIMARY KEY)                                    │
│  name (VARCHAR)                                             │
│  description (TEXT)                                         │
│  price (INTEGER)                                            │
│  category (VARCHAR)                                         │
│  image_url (VARCHAR)                                        │
│  sizes (TEXT[])                                             │
│  colors (TEXT[])                                            │
│  position_x (FLOAT)                                         │
│  position_y (FLOAT)                                         │
│  position_z (FLOAT)                                         │
│  created_at (TIMESTAMP)                                     │
│  updated_at (TIMESTAMP)                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  migrations                                                 │
├─────────────────────────────────────────────────────────────┤
│  id (SERIAL PRIMARY KEY)                                    │
│  name (VARCHAR UNIQUE)                                      │
│  executed_at (TIMESTAMP)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Other Tables                                               │
├─────────────────────────────────────────────────────────────┤
│  users, orders, order_items, cart_items, game_scores,       │
│  delivery_zones, admin_sessions, pwa_settings               │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

```
GET /api/products
├─ Returns: All products from database
├─ Status: 200 OK
└─ Response: [{ id, name, price, ... }, ...]

GET /api/products/display
├─ Returns: First 3 products (for 3D scene)
├─ Status: 200 OK
└─ Response: [{ id, name, price, ... }, ...]

POST /api/products
├─ Body: { name, price, description, ... }
├─ Status: 201 Created
└─ Response: { id, name, price, ... }

PUT /api/products/:id
├─ Body: { id, name, price, description, ... }
├─ Status: 200 OK
└─ Response: { id, name, price, ... }

DELETE /api/products/:id
├─ Status: 200 OK
└─ Response: { success: true }

GET /health
├─ Returns: Server status
├─ Status: 200 OK
└─ Response: { status: "ok" }
```

## File Organization

```
Root
├── server.ts                    ← Express backend
├── App.tsx                      ← React app
├── vite.config.ts               ← Vite config
├── package.json                 ← Dependencies
│
├── services/
│   ├── database.ts              ← DB connection
│   ├── productService.ts        ← Product CRUD
│   ├── api.ts                   ← API client
│   ├── runMigrations.ts         ← Migration runner
│   └── migrations/
│       └── 001_initial_schema.sql ← Schema
│
├── store/
│   └── useStore.ts              ← Zustand store
│
├── ui/
│   ├── AdminPanelImproved.tsx   ← Admin interface
│   └── ...
│
├── canvas/
│   ├── SceneCanvas.tsx          ← 3D scene
│   └── ...
│
└── .kiro/
    ├── QUICK_START_NEON.md      ← Quick start
    ├── NEON_SETUP_COMPLETE.md   ← Setup guide
    ├── ARCHITECTURE.md          ← Architecture
    ├── COMPLETE_FLOW.md         ← Data flow
    ├── COMMANDS_REFERENCE.md    ← Commands
    └── ...
```

## Ports Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Your Computer                                              │
├─────────────────────────────────────────────────────────────┤
│  Port 3000  ← Frontend (Vite)                               │
│  Port 5000  ← Backend (Express)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Neon Cloud                                                 │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database (no local port)                        │
└─────────────────────────────────────────────────────────────┘
```

## Status Indicators

```
✅ Backend Running
   - Server listening on port 5000
   - Migrations completed
   - Database connected

✅ Frontend Running
   - Vite dev server on port 3000
   - React app loaded
   - API proxy configured

✅ Database Ready
   - All tables created
   - Initial data inserted
   - Migrations tracked

✅ 3D Scene Ready
   - 3 products loaded
   - Scene rendering
   - Ready for interaction

✅ Admin Panel Ready
   - Can add products
   - Can edit products
   - Can delete products
   - Changes persist
```

