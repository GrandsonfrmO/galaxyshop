# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│                    http://localhost:3000                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App.tsx                                             │  │
│  │  - Loads display products on mount                   │  │
│  │  - Renders 3D scene with 3 products                  │  │
│  │  - Manages admin panel                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Zustand Store (useStore.ts)                         │  │
│  │  - loadDisplayProducts() - async fetch from API      │  │
│  │  - addProduct() - POST to /api/products              │  │
│  │  - updateProduct() - PUT to /api/products/:id        │  │
│  │  - deleteProduct() - DELETE to /api/products/:id     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Client (services/api.ts)                        │  │
│  │  - fetchProducts()                                   │  │
│  │  - fetchDisplayProducts()                            │  │
│  │  - createProduct()                                   │  │
│  │  - updateProductAPI()                                │  │
│  │  - deleteProductAPI()                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Vite Proxy                                          │  │
│  │  /api/* → http://localhost:5000/api/*               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express)                          │
│                  http://localhost:5000                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  server.ts                                           │  │
│  │  - GET /api/products                                 │  │
│  │  - GET /api/products/display                         │  │
│  │  - POST /api/products                                │  │
│  │  - PUT /api/products/:id                             │  │
│  │  - DELETE /api/products/:id                          │  │
│  │  - Runs migrations on startup                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Product Service (services/productService.ts)        │  │
│  │  - getAllProducts()                                  │  │
│  │  - getDisplayProducts() - returns first 3            │  │
│  │  - addProduct()                                      │  │
│  │  - updateProduct()                                   │  │
│  │  - deleteProduct()                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database Service (services/database.ts)             │  │
│  │  - Connection pool (pg)                              │  │
│  │  - query() - execute SQL                             │  │
│  │  - getClient() - get connection                      │  │
│  │  - closePool() - cleanup                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Migrations (services/runMigrations.ts)              │  │
│  │  - Runs on server startup                            │  │
│  │  - Creates tables                                    │  │
│  │  - Inserts initial data                              │  │
│  │  - Tracks executed migrations                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Neon PostgreSQL Database                            │  │
│  │  - products table                                    │  │
│  │  - users table                                       │  │
│  │  - orders table                                      │  │
│  │  - delivery_zones table                              │  │
│  │  - migrations table (tracking)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Application Startup
```
npm run dev:full
    ↓
Backend starts (port 5000)
    ↓
Migrations run automatically
    ↓
Frontend starts (port 3000)
    ↓
App.tsx mounts
    ↓
loadDisplayProducts() called
    ↓
Fetch /api/products/display
    ↓
Get 3 products from database
    ↓
3D scene renders with products
```

### 2. Adding a Product (Admin Panel)
```
Admin adds product
    ↓
addProduct() called in store
    ↓
POST /api/products
    ↓
Backend receives request
    ↓
productService.addProduct()
    ↓
INSERT into products table
    ↓
Return new product
    ↓
Store updates products array
    ↓
Fetch display products again
    ↓
3D scene updates
```

### 3. Updating a Product
```
Admin edits product
    ↓
updateProduct() called in store
    ↓
PUT /api/products/:id
    ↓
Backend receives request
    ↓
productService.updateProduct()
    ↓
UPDATE products table
    ↓
Return updated product
    ↓
Store updates products array
    ↓
Fetch display products again
    ↓
3D scene updates
```

### 4. Deleting a Product
```
Admin deletes product
    ↓
deleteProduct() called in store
    ↓
DELETE /api/products/:id
    ↓
Backend receives request
    ↓
productService.deleteProduct()
    ↓
DELETE from products table
    ↓
Return success
    ↓
Store removes product
    ↓
Fetch display products again
    ↓
3D scene updates
```

## Key Components

### Frontend
- **App.tsx** - Main component, loads display products
- **useStore.ts** - Zustand store with async product actions
- **services/api.ts** - API client functions
- **ui/AdminPanelImproved.tsx** - Admin interface for managing products

### Backend
- **server.ts** - Express server with API routes
- **services/productService.ts** - Product CRUD operations
- **services/database.ts** - Database connection pool
- **services/runMigrations.ts** - Migration runner

### Database
- **services/migrations/001_initial_schema.sql** - Schema definition
- **Neon PostgreSQL** - Cloud database

## Environment Variables

```
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
GEMINI_API_KEY=your_api_key
RESEND_API_KEY=your_api_key
```

## Ports

- **Frontend**: 3000 (Vite dev server)
- **Backend**: 5000 (Express server)
- **Database**: Neon cloud (no local port)

## Technologies

- **Frontend**: React 19, Vite, Zustand, Three.js
- **Backend**: Express, Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Direct SQL queries with pg library
- **Build**: TypeScript, tsx

