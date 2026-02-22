# Complete Application Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + Vite)  ←→  Backend (Express)  ←→  Neon  │
│  Port 3000                    Port 5000              Database│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Startup Sequence

### Step 1: User Runs Command
```bash
npm run dev:full
```

### Step 2: Backend Starts
```
✓ Express server starts on port 5000
✓ Loads environment variables from .env.local
✓ Connects to Neon database
✓ Runs migrations automatically
```

### Step 3: Migrations Run
```
✓ Creates migrations tracking table
✓ Reads migration files from services/migrations/
✓ Executes 001_initial_schema.sql
✓ Creates all database tables
✓ Inserts 3 initial products
✓ Records migration as executed
```

### Step 4: Frontend Starts
```
✓ Vite dev server starts on port 3000
✓ Loads React application
✓ Configures API proxy to backend
```

### Step 5: App Component Mounts
```
✓ App.tsx renders
✓ useEffect hook runs
✓ Calls loadDisplayProducts()
```

### Step 6: Load Display Products
```
✓ Zustand store action triggered
✓ Calls fetchDisplayProducts() from API client
✓ Makes fetch request to /api/products/display
✓ Vite proxy routes to http://localhost:5000/api/products/display
```

### Step 7: Backend Handles Request
```
✓ Express receives GET /api/products/display
✓ Calls getDisplayProducts() from productService
✓ Executes SQL: SELECT * FROM products LIMIT 3
✓ Returns 3 products as JSON
```

### Step 8: Frontend Receives Data
```
✓ API client receives response
✓ Zustand store updates displayProducts state
✓ React re-renders with new data
✓ 3D scene renders with 3 products
```

### Step 9: User Sees 3D Scene
```
✓ 3 products displayed in 3D space
✓ Each product shows name, price, image
✓ User can interact with products
✓ Application is ready to use
```

## User Interaction Flow

### Adding a Product

```
User clicks "Ajouter un produit" in admin panel
    ↓
Admin form opens
    ↓
User fills in product details
    ↓
User clicks "Enregistrer"
    ↓
addProduct() called in Zustand store
    ↓
POST /api/products with product data
    ↓
Vite proxy routes to backend
    ↓
Express receives POST request
    ↓
productService.addProduct() called
    ↓
INSERT INTO products table
    ↓
Database returns new product with ID
    ↓
Backend returns product as JSON
    ↓
Frontend receives response
    ↓
Zustand store updates products array
    ↓
loadDisplayProducts() called again
    ↓
Fetch latest 3 products
    ↓
3D scene updates with new products
    ↓
User sees new product in 3D scene
```

### Editing a Product

```
User clicks edit button on product
    ↓
Edit form opens with current data
    ↓
User modifies details
    ↓
User clicks "Enregistrer"
    ↓
updateProduct() called in Zustand store
    ↓
PUT /api/products/:id with updated data
    ↓
Vite proxy routes to backend
    ↓
Express receives PUT request
    ↓
productService.updateProduct() called
    ↓
UPDATE products table WHERE id = :id
    ↓
Database returns updated product
    ↓
Backend returns product as JSON
    ↓
Frontend receives response
    ↓
Zustand store updates products array
    ↓
loadDisplayProducts() called again
    ↓
Fetch latest 3 products
    ↓
3D scene updates with modified products
    ↓
User sees updated product in 3D scene
```

### Deleting a Product

```
User clicks delete button on product
    ↓
Confirmation dialog appears
    ↓
User confirms deletion
    ↓
deleteProduct() called in Zustand store
    ↓
DELETE /api/products/:id
    ↓
Vite proxy routes to backend
    ↓
Express receives DELETE request
    ↓
productService.deleteProduct() called
    ↓
DELETE FROM products WHERE id = :id
    ↓
Database confirms deletion
    ↓
Backend returns success
    ↓
Frontend receives response
    ↓
Zustand store removes product from array
    ↓
loadDisplayProducts() called again
    ↓
Fetch latest 3 products
    ↓
3D scene updates without deleted product
    ↓
User sees product removed from 3D scene
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  App.tsx                                               │  │
│  │  - Renders 3D scene                                    │  │
│  │  - Calls loadDisplayProducts() on mount                │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Zustand Store (useStore.ts)                           │  │
│  │  - displayProducts state                               │  │
│  │  - loadDisplayProducts() action                        │  │
│  │  - addProduct() action                                 │  │
│  │  - updateProduct() action                              │  │
│  │  - deleteProduct() action                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Client (services/api.ts)                          │  │
│  │  - fetchDisplayProducts()                              │  │
│  │  - createProduct()                                     │  │
│  │  - updateProductAPI()                                  │  │
│  │  - deleteProductAPI()                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Vite Proxy                                            │  │
│  │  /api/* → http://localhost:5000/api/*                 │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  server.ts                                             │  │
│  │  - GET /api/products                                   │  │
│  │  - GET /api/products/display                           │  │
│  │  - POST /api/products                                  │  │
│  │  - PUT /api/products/:id                               │  │
│  │  - DELETE /api/products/:id                            │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Product Service (services/productService.ts)          │  │
│  │  - getAllProducts()                                    │  │
│  │  - getDisplayProducts()                                │  │
│  │  - addProduct()                                        │  │
│  │  - updateProduct()                                     │  │
│  │  - deleteProduct()                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Database Service (services/database.ts)               │  │
│  │  - Connection pool                                     │  │
│  │  - query() - execute SQL                               │  │
│  │  - getClient() - get connection                        │  │
│  │  - closePool() - cleanup                               │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Migrations (services/runMigrations.ts)                │  │
│  │  - Runs on server startup                              │  │
│  │  - Creates tables                                      │  │
│  │  - Inserts initial data                                │  │
│  │  - Tracks executed migrations                          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                  NEON POSTGRESQL DATABASE                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Tables:                                               │  │
│  │  - products (id, name, price, description, etc.)       │  │
│  │  - users                                               │  │
│  │  - orders                                              │  │
│  │  - order_items                                         │  │
│  │  - cart_items                                          │  │
│  │  - game_scores                                         │  │
│  │  - delivery_zones                                      │  │
│  │  - admin_sessions                                      │  │
│  │  - pwa_settings                                        │  │
│  │  - migrations (tracking)                               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Request/Response Cycle

### GET /api/products/display

```
Frontend Request:
  GET /api/products/display
  
Vite Proxy:
  Routes to http://localhost:5000/api/products/display
  
Backend Processing:
  1. Express receives request
  2. Calls getDisplayProducts()
  3. Executes: SELECT * FROM products LIMIT 3
  4. Database returns 3 rows
  5. Maps rows to Product objects
  6. Returns JSON response
  
Response:
  [
    {
      id: "1",
      name: "Grandson Hoodie V1",
      price: 350000,
      description: "...",
      category: "Vêtements",
      imageUrl: "...",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy"],
      position: [-4.5, 0.8, 0]
    },
    ...
  ]
  
Frontend Processing:
  1. Receives response
  2. Updates Zustand store
  3. Re-renders 3D scene
  4. Products display
```

## Error Handling

### If Database Connection Fails
```
Backend starts
    ↓
Tries to run migrations
    ↓
Database connection fails
    ↓
Error logged to console
    ↓
Server continues running
    ↓
Frontend loads
    ↓
API calls fail
    ↓
Error logged to browser console
    ↓
User sees empty 3D scene
    ↓
Check DATABASE_URL in .env.local
```

### If API Request Fails
```
Frontend makes API request
    ↓
Backend receives request
    ↓
Database query fails
    ↓
Error caught in try/catch
    ↓
Error response sent (500 status)
    ↓
Frontend receives error
    ↓
Error logged to console
    ↓
Zustand store not updated
    ↓
3D scene shows previous data or empty
```

## Performance Considerations

1. **Lazy Loading** - 3D scene loads after initial render
2. **Connection Pooling** - Database uses connection pool
3. **Caching** - Zustand store caches products
4. **Pagination** - Display products limited to 3
5. **Indexing** - Database tables have indexes

## Security Considerations

1. **CORS** - Enabled for frontend communication
2. **Environment Variables** - Sensitive data in .env.local
3. **SQL Injection** - Parameterized queries used
4. **Error Messages** - Generic errors returned to client
5. **Admin Session** - 7-day timeout for admin access

