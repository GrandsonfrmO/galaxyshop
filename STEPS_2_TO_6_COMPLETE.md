# ✅ Steps 2-6: Complete Setup Guide

## 🎯 What You Need to Do

You already have Neon and Resend configured! Just need to:
1. Generate production security keys
2. Test everything works
3. Initialize production database

**Total time: ~10 minutes**

---

## 🚀 Quick Start (Recommended)

Run these three commands:

```bash
# 1. Setup production environment (5 min)
npm run setup:production

# 2. Test everything (2 min)
npm run test:production

# 3. Initialize database (1 min)
npm run db:init:production
```

Done! You're ready for Vercel deployment.

---

## 📋 What Each Step Does

### ✅ Step 2: Configure Neon (DONE)
Your `.env.local` already has:
```
DATABASE_URL=postgresql://neondb_owner:npg_SioVIyh8n9cA@ep-falling-dew-aeu2wjt5...
```

### ✅ Step 3: Configure Resend (DONE)
Your `.env.local` already has:
```
RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
ADMIN_EMAIL=papicamara22@gmail.com
```

### ⏳ Step 5: Fill .env.production (5 min)
Run: `npm run setup:production`

This will:
- Copy your Neon configuration
- Copy your Resend configuration
- Generate new secure keys for production
- Create `.env.production` file
- Create `.env.vercel` file

### ⏳ Step 6: Test Locally (5 min)
Run: `npm run test:production`

This will:
- Test database connection
- Send test email to papicamara22@gmail.com
- Verify security keys are properly configured
- Show you a pass/fail report

---

## 🎬 Step-by-Step Walkthrough

### 1. Run Setup Script

```bash
npm run setup:production
```

**What you'll see:**
```
🚀 Production Environment Setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STEP 1: Neon Production Database
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current DATABASE_URL from .env.local:
  postgresql://neondb_owner:npg_SioVIyh8n9cA@...

Options:
  1. Use existing Neon database (from .env.local)
  2. Create new production database
  3. Enter different connection string

Choose option (1-3):
```

**What to do:** Type `1` and press Enter (use existing)

---

**What you'll see next:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 STEP 2: Resend Email Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current RESEND_API_KEY from .env.local:
  re_Tjyrmhqv...

Options:
  1. Use existing Resend API key (from .env.local)
  2. Enter new API key

Choose option (1-2):
```

**What to do:** Type `1` and press Enter (use existing)

---

**What you'll see next:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 STEP 3: Security Keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generating secure random keys...

✓ Generated ADMIN_API_KEY
✓ Generated INTERNAL_API_KEY
✓ Generated ENCRYPTION_KEY
```

**What happens:** Script automatically generates secure 64-character keys

---

**Final output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SETUP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files created:
  ✓ .env.production (for local testing)
  ✓ .env.vercel (for Vercel deployment)

Next steps:
  1. Test locally: npm run test:production
  2. Initialize database: npm run db:init:production
  3. Add variables to Vercel (see .env.vercel)
  4. Deploy to Vercel
```

---

### 2. Run Tests

```bash
npm run test:production
```

**What you'll see:**
```
🧪 Testing Production Setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test 1: Database Connection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Testing connection to Neon...
✓ Connected to database

Database info:
  Time: 2026-02-23T...
  Version: PostgreSQL 16.x

✅ Database test PASSED
```

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Test 2: Email Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuration:
  API Key: re_Tjyrmhq...
  From: onboarding@resend.dev
  Admin: papicamara22@gmail.com

Testing Resend API...
✓ Test email sent (ID: abc123...)
✓ Check papicamara22@gmail.com for the test email

✅ Email test PASSED
```

**Important:** Check your email inbox for the test email!

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Test 3: Security Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ ADMIN_API_KEY is configured
✓ INTERNAL_API_KEY is configured
✓ ENCRYPTION_KEY is configured
✓ NODE_ENV is set to production

✅ Security test PASSED
```

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Database:  ✅ PASS
Email:     ✅ PASS
Security:  ✅ PASS

🎉 All tests passed! Ready for deployment.

Next steps:
  1. Push to GitHub: git push origin main
  2. Deploy to Vercel
  3. Add environment variables to Vercel (see .env.vercel)
```

---

### 3. Initialize Database

```bash
npm run db:init:production
```

**What you'll see:**
```
🗄️  Initializing Production Database

Connected to database

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running Migrations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running: Initial schema...
✓ Initial schema completed

Running: Enhanced orders...
✓ Enhanced orders completed

Running: Multiple product images...
✓ Multiple product images completed

Running: Critical fixes...
✓ Critical fixes completed

Running: Security fixes...
✓ Security fixes completed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Database Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tables created:
  ✓ products
  ✓ orders
  ✓ delivery_zones
  ✓ order_items

Current data:
  Products: 0
  Orders: 0
  Delivery Zones: 0

✅ Database initialization complete!

💡 Tip: Run "npm run seed" to add sample products
```

---

## 🎉 Success! What You Have Now

After completing these steps, you have:

✅ `.env.production` - Production environment file
✅ `.env.vercel` - Ready for Vercel deployment
✅ Secure API keys (64 characters each)
✅ Tested database connection
✅ Tested email service
✅ Initialized database with all tables
✅ All security features configured

---

## 📁 Files Created

### `.env.production`
```env
DATABASE_URL=postgresql://neondb_owner:npg_SioVIyh8n9cA@...
RESEND_API_KEY=re_Tjyrmhqv_Kc9WE3miNHCf3AdqF1wgV1zB
ADMIN_EMAIL=papicamara22@gmail.com
RESEND_EMAIL_FROM=onboarding@resend.dev
ADMIN_API_KEY=<64-char-secure-key>
INTERNAL_API_KEY=<64-char-secure-key>
ENCRYPTION_KEY=<64-char-secure-key>
NODE_ENV=production
```

### `.env.vercel`
Same as above, formatted for easy copy-paste to Vercel dashboard.

---

## 🚀 Next Steps (Steps 7-11)

You're now ready for:

### Step 7: Push to GitHub (5 min)
```bash
git add .
git commit -m "Production environment configured"
git push origin main
```

### Step 8: Create Vercel Project (5 min)
1. Go to vercel.com
2. Click "New Project"
3. Import your GitHub repository

### Step 9: Add Variables to Vercel (10 min)
1. Go to Project Settings → Environment Variables
2. Copy each variable from `.env.vercel`
3. Set environment to: Production, Preview, Development

### Step 10: Deploy (5 min)
Vercel will automatically deploy after you push to GitHub

### Step 11: Test in Production (10 min)
Test your live site!

---

## 🔒 Security Checklist

Before deploying, verify:

- [ ] `.env.production` is NOT committed to Git
- [ ] `.env.vercel` is NOT committed to Git
- [ ] Security keys are 64 characters long
- [ ] No "CHANGE_ME" or "dev-" prefixes in keys
- [ ] Test email was received
- [ ] Database connection works
- [ ] All tests passed

---

## 💾 Backup Your Keys

**Important:** Save these somewhere secure!

1. Open `.env.vercel`
2. Copy all the keys
3. Save in a password manager or secure note
4. You'll need these for Vercel setup

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check if Neon project is active (not paused)
- Verify DATABASE_URL has `?sslmode=require`
- Check Neon dashboard for connection issues

### "Email test failed"
- Verify RESEND_API_KEY is correct
- Check if sender email is verified in Resend
- Look for error message in test output

### "Security keys too short"
- Run setup script again: `npm run setup:production`
- Make sure openssl is installed (or script uses fallback)

### "No tables found"
- Run: `npm run db:init:production`
- Check for migration errors in output

---

## ✅ Completion Checklist

Mark these off as you complete them:

- [ ] Ran `npm run setup:production`
- [ ] Chose option 1 for Neon (use existing)
- [ ] Chose option 1 for Resend (use existing)
- [ ] Saw "SETUP COMPLETE" message
- [ ] Ran `npm run test:production`
- [ ] All 3 tests passed (Database, Email, Security)
- [ ] Received test email in inbox
- [ ] Ran `npm run db:init:production`
- [ ] Saw all tables created
- [ ] Saved `.env.vercel` keys securely
- [ ] Ready for Vercel deployment!

---

## 🎊 You're Done!

**Time spent:** ~10 minutes
**Status:** ✅ Steps 2-6 Complete
**Next:** Steps 7-11 (Vercel deployment)

Your production environment is configured and tested. You're ready to deploy! 🚀
