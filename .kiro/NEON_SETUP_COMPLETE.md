# Neon Database Setup - Complete Guide

## Overview
The application now has a complete backend setup with:
- Express server for API routes
- Neon PostgreSQL database integration
- Automatic migrations on server startup
- Frontend React app with Vite

## Prerequisites
1. Node.js 18+ installed
2. Neon database URL in `.env.local`
3. All dependencies installed

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `express` - Backend server
- `cors` - Cross-origin requests
- `tsx` - TypeScript execution
- `concurrently` - Run multiple commands

### 2. Configure Environment
Update `.env.local` with your Neon database URL:
```
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
```

### 3. Run the Application

#### Option A: Run Both Server and Frontend (Recommended)
```bash
npm run dev:full
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`
- Migrations run automatically on server startup

#### Option B: Run Separately
Terminal 1 - Start backend server:
```bash
npm run server
```

Terminal 2 - Start frontend:
```bash
npm run dev
```

### 4. Verify Setup

#### Check Server Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{ "status": "ok" }
```

#### Check Products API
```bash
curl http://localhost:5000/api/products
```

Should return 3 initial products from the database.

#### Check Display Products (for 3D scene)
```bash
curl http://localhost:5000/api/products/display
```

Should return exactly 3 products.

## How It Works

### Database Flow
1. **Server Startup** → Runs migrations automatically
2. **Migrations** → Creates tables and inserts initial data
3. **Frontend Loads** → Calls `loadDisplayProducts()` in App.tsx
4. **3D Scene** → Displays 3 products from database

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/display` | Get 3 products for 3D scene |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### File Structure

```
services/
├── database.ts           # Database connection pool
├── productService.ts     # Product CRUD operations
├── runMigrations.ts      # Migration runner
└── migrations/
    └── 001_initial_schema.sql  # Initial schema

api/
└── products.ts           # API route handlers (reference)

server.ts                # Express backend server
App.tsx                  # Frontend - loads display products
store/useStore.ts        # Zustand store with async actions
```

## Troubleshooting

### "Cannot find module" errors
- Make sure all imports use `.ts` not `.js`
- Run `npm install` to ensure all dependencies are installed

### Database connection errors
- Verify `DATABASE_URL` in `.env.local`
- Check Neon dashboard for connection status
- Ensure IP is whitelisted in Neon

### Products not showing in 3D scene
- Check browser console for API errors
- Verify server is running on port 5000
- Check that migrations completed successfully

### Port already in use
- Change port in vite.config.ts (frontend) or server.ts (backend)
- Or kill existing process: `lsof -ti:5000 | xargs kill -9`

## Next Steps

1. **Add Products in Admin Panel**
   - Login to admin panel
   - Add new products
   - They'll be saved to Neon database

2. **Customize Initial Data**
   - Edit `services/migrations/001_initial_schema.sql`
   - Change product names, prices, images
   - Run migrations again

3. **Deploy**
   - Build frontend: `npm run build`
   - Deploy server and frontend to hosting
   - Update `DATABASE_URL` in production environment

## Commands Reference

```bash
# Development
npm run dev:full          # Run server + frontend
npm run server            # Run backend only
npm run dev               # Run frontend only

# Database
npm run migrate           # Run migrations manually
npm run migrate:check     # Check migration status

# Production
npm run build             # Build frontend for production
```

## Important Notes

- **Migrations run automatically** on server startup
- **Display products** are loaded when App.tsx mounts
- **Products persist** in Neon database (not localStorage)
- **3 products** are displayed in the 3D scene
- **Admin panel** can add/edit/delete products

