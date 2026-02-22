# Setup Checklist

## Pre-Setup Requirements

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Neon account created
- [ ] Neon database created
- [ ] Database URL obtained from Neon

## Environment Setup

- [ ] `.env.local` file exists
- [ ] `DATABASE_URL` set in `.env.local`
- [ ] `GEMINI_API_KEY` set in `.env.local`
- [ ] `RESEND_API_KEY` set in `.env.local`

## Installation

- [ ] Run `npm install`
- [ ] All dependencies installed successfully
- [ ] No installation errors in console

## Verify Files

- [ ] `server.ts` exists
- [ ] `App.tsx` has `loadDisplayProducts()` call
- [ ] `vite.config.ts` has API proxy
- [ ] `package.json` has new scripts
- [ ] `services/runMigrations.ts` has correct imports

## Start Application

- [ ] Run `npm run dev:full`
- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 3000
- [ ] Migrations run automatically
- [ ] No errors in console

## Test Backend

- [ ] `curl http://localhost:5000/health` returns `{"status":"ok"}`
- [ ] `curl http://localhost:5000/api/products` returns products
- [ ] `curl http://localhost:5000/api/products/display` returns 3 products

## Test Frontend

- [ ] Open `http://localhost:3000` in browser
- [ ] Page loads without errors
- [ ] 3D scene displays
- [ ] 3 products visible in 3D scene
- [ ] No errors in browser console

## Test Admin Panel

- [ ] Click admin button (bottom right)
- [ ] Admin panel opens
- [ ] Can see products list
- [ ] Can add new product
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Changes appear in 3D scene

## Test Database

- [ ] Products table exists in Neon
- [ ] 3 initial products in database
- [ ] Migrations table exists
- [ ] Migration records exist

## Verify Integration

- [ ] Adding product in admin saves to database
- [ ] Deleting product in admin removes from database
- [ ] Editing product in admin updates database
- [ ] 3D scene updates when products change
- [ ] Page refresh shows products from database

## Documentation

- [ ] Read `.kiro/NEON_SETUP_COMPLETE.md`
- [ ] Read `.kiro/QUICK_START_NEON.md`
- [ ] Read `.kiro/ARCHITECTURE.md`
- [ ] Understand the system architecture
- [ ] Know how to run commands

## Troubleshooting

- [ ] Know how to check server health
- [ ] Know how to kill ports
- [ ] Know how to check logs
- [ ] Know how to verify database connection
- [ ] Know how to run migrations manually

## Ready for Development

- [ ] Application running smoothly
- [ ] No errors in console
- [ ] Products displaying correctly
- [ ] Admin panel working
- [ ] Database persisting data

## Ready for Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Database configured
- [ ] Environment variables set
- [ ] Build successful: `npm run build`
- [ ] Production build tested: `npm run preview`

## Post-Deployment

- [ ] Update DATABASE_URL for production
- [ ] Update other environment variables
- [ ] Test all API endpoints
- [ ] Test admin panel
- [ ] Monitor server logs
- [ ] Monitor database performance

## Maintenance

- [ ] Regular backups of database
- [ ] Monitor server performance
- [ ] Check logs regularly
- [ ] Update dependencies periodically
- [ ] Test migrations before deploying

---

## Quick Start Checklist

If you just want to get started quickly:

1. [ ] `npm install`
2. [ ] Verify `.env.local` has DATABASE_URL
3. [ ] `npm run dev:full`
4. [ ] Open `http://localhost:3000`
5. [ ] See 3 products in 3D scene
6. [ ] Done!

## Troubleshooting Checklist

If something isn't working:

1. [ ] Check server is running: `curl http://localhost:5000/health`
2. [ ] Check frontend is running: Open `http://localhost:3000`
3. [ ] Check DATABASE_URL: `echo $DATABASE_URL`
4. [ ] Check browser console for errors
5. [ ] Check server logs for errors
6. [ ] Try killing ports: `kill5000` and `kill3000`
7. [ ] Try fresh install: `rm -rf node_modules && npm install`
8. [ ] Try running migrations: `npm run migrate`

