# Commands Reference

## Development

### Start Everything (Recommended)
```bash
npm run dev:full
```
Starts backend (port 5000) + frontend (port 3000) + runs migrations

### Start Backend Only
```bash
npm run server
```
Starts Express server on port 5000

### Start Frontend Only
```bash
npm run dev
```
Starts Vite dev server on port 3000

### Build for Production
```bash
npm run build
```
Creates optimized production build

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally

## Database

### Run Migrations
```bash
npm run migrate
```
Runs all pending migrations

### Check Migration Status
```bash
npm run migrate:check
```
Shows which migrations have been executed

## Testing

### Check Server Health
```bash
curl http://localhost:5000/health
```
Response: `{"status":"ok"}`

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Display Products (3D Scene)
```bash
curl http://localhost:5000/api/products/display
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "description": "Test",
    "category": "Test",
    "imageUrl": "https://example.com/image.jpg",
    "sizes": ["S", "M"],
    "colors": ["Black"],
    "position": [0, 0, 0]
  }'
```

### Update Product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "name": "Updated Product",
    "price": 150000,
    "description": "Updated",
    "category": "Test",
    "imageUrl": "https://example.com/image.jpg",
    "sizes": ["S", "M"],
    "colors": ["Black"],
    "position": [0, 0, 0]
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/1
```

## Troubleshooting

### Kill Process on Port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### Kill Process on Port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

### Check if Port is in Use
```bash
lsof -i :5000
lsof -i :3000
```

### View Server Logs
```bash
npm run server
```
Logs appear in terminal

### View Frontend Logs
```bash
npm run dev
```
Logs appear in terminal and browser console

## Installation

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

## Environment

### View Environment Variables
```bash
cat .env.local
```

### Update Environment
Edit `.env.local` with your values:
```
DATABASE_URL=postgresql://user:password@host.neon.tech/grandson_db
GEMINI_API_KEY=your_key
RESEND_API_KEY=your_key
```

## Database Connection

### Connect to Neon Database
```bash
psql $DATABASE_URL
```

### List Tables
```bash
psql $DATABASE_URL -c "\dt"
```

### View Products Table
```bash
psql $DATABASE_URL -c "SELECT * FROM products;"
```

### View Migrations Table
```bash
psql $DATABASE_URL -c "SELECT * FROM migrations;"
```

## Git

### Check Status
```bash
git status
```

### Add Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your message"
```

### Push Changes
```bash
git push
```

## Useful Aliases

Add to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Start development
alias dev="npm run dev:full"

# Start backend only
alias server="npm run server"

# Start frontend only
alias frontend="npm run dev"

# Run migrations
alias migrate="npm run migrate"

# Check server health
alias health="curl http://localhost:5000/health"

# Get all products
alias products="curl http://localhost:5000/api/products"

# Get display products
alias display="curl http://localhost:5000/api/products/display"

# Kill port 5000
alias kill5000="lsof -ti:5000 | xargs kill -9"

# Kill port 3000
alias kill3000="lsof -ti:3000 | xargs kill -9"
```

## Quick Workflow

### First Time Setup
```bash
npm install
npm run dev:full
```

### Daily Development
```bash
npm run dev:full
```

### Add New Product
1. Open admin panel in browser
2. Click "Ajouter un produit"
3. Fill in details
4. Click save
5. Product appears in 3D scene

### Deploy
```bash
npm run build
# Deploy dist/ folder to hosting
```

## Performance Tips

- Use `npm run dev:full` for development
- Use `npm run build` before deploying
- Check browser console for errors
- Check server logs for API errors
- Use `curl` to test API endpoints directly

## Common Issues

**Port already in use?**
```bash
kill5000  # or kill3000
```

**Products not showing?**
```bash
curl http://localhost:5000/api/products/display
```

**Database connection error?**
```bash
echo $DATABASE_URL
```

**Migrations not running?**
```bash
npm run migrate
```

