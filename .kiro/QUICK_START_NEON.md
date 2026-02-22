# Quick Start - Neon Database Integration

## What's New
✅ Backend Express server created  
✅ API routes for products  
✅ Automatic migrations on startup  
✅ Display products load from database  
✅ 3 products show in 3D scene  

## Run the Application

### Start Everything (Recommended)
```bash
npm run dev:full
```

This will:
1. Start backend server on `http://localhost:5000`
2. Start frontend on `http://localhost:3000`
3. Run migrations automatically
4. Load 3 products from database into 3D scene

### Or Run Separately
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

## What Happens on Startup

1. **Server starts** → Runs migrations
2. **Migrations create** → Database tables and insert 3 initial products
3. **Frontend loads** → Calls `loadDisplayProducts()`
4. **3D scene renders** → Shows 3 products from Neon database

## Test It

### Check Server
```bash
curl http://localhost:5000/health
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get Display Products (3D scene)
```bash
curl http://localhost:5000/api/products/display
```

## Admin Panel

1. Open `http://localhost:3000`
2. Click admin button (bottom right)
3. Add/edit/delete products
4. Changes save to Neon database
5. 3D scene updates automatically

## Files Changed

- ✅ `server.ts` - New Express backend
- ✅ `App.tsx` - Loads display products on mount
- ✅ `vite.config.ts` - Proxy API to backend
- ✅ `package.json` - Added dependencies and scripts
- ✅ `services/runMigrations.ts` - Fixed imports

## Troubleshooting

**Products not showing?**
- Check browser console for errors
- Verify server is running on port 5000
- Check `.env.local` has DATABASE_URL

**Port already in use?**
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Or change port in server.ts

**Database errors?**
- Verify DATABASE_URL in `.env.local`
- Check Neon dashboard connection

