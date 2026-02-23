# 🚀 Production Setup Guide

Quick guide to complete steps 2-6 of your deployment checklist.

## ⏱️ Time Estimate
- Step 2: Configure Neon (5 min - already done!)
- Step 3: Configure Resend (5 min - already done!)
- Step 5: Fill .env.production (5 min)
- Step 6: Test locally (10 min)

**Total: ~25 minutes**

---

## 📋 Current Status

Based on your `.env.local`, you already have:
- ✅ Neon database configured
- ✅ Resend API key configured
- ✅ Admin email set
- ⚠️ Security keys need to be regenerated for production

---

## 🎯 Quick Setup (Recommended)

Run the interactive setup script:

```bash
npm run setup:production
```

This will:
1. Guide you through Neon configuration
2. Configure Resend settings
3. Generate secure production keys
4. Create `.env.production` file
5. Create `.env.vercel` file for deployment

---

## 🧪 Test Your Setup

After running setup, test everything:

```bash
npm run test:production
```

This will verify:
- ✅ Database connection works
- ✅ Email service works (sends test email)
- ✅ Security keys are properly configured

---

## 📝 Manual Setup (Alternative)

If you prefer manual setup:

### Step 1: Copy your existing config

```bash
cp .env.local .env.production
```

### Step 2: Generate new security keys

```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows (PowerShell)
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 3: Update `.env.production`

Replace these values:
```env
ADMIN_API_KEY=<generated-key-1>
INTERNAL_API_KEY=<generated-key-2>
ENCRYPTION_KEY=<generated-key-3>
NODE_ENV=production
```

### Step 4: Verify database URL

Make sure your `DATABASE_URL` uses the non-pooler endpoint for migrations:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require
```

---

## 🔍 What Each Script Does

### `npm run setup:production`
Interactive wizard that:
- Asks if you want to use existing or new Neon database
- Asks if you want to use existing or new Resend config
- Generates secure random keys automatically
- Creates both `.env.production` and `.env.vercel`

### `npm run test:production`
Comprehensive test suite that:
- Tests database connection
- Lists existing tables
- Sends a real test email to your admin email
- Validates security key configuration
- Provides detailed pass/fail report

### `npm run test:complete-flow`
End-to-end test that:
- Tests product listing
- Tests order creation
- Tests email sending
- Tests admin API
- Simulates real user flow

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env.production` file exists
- [ ] `.env.vercel` file exists (for Vercel deployment)
- [ ] Database connection test passes
- [ ] Test email received in your inbox
- [ ] Security keys are 64 characters long
- [ ] No "CHANGE_ME" or "dev-" prefixes in keys

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Initialize production database:**
   ```bash
   NODE_ENV=production npm run db:init
   ```

2. **Seed with sample data (optional):**
   ```bash
   NODE_ENV=production npm run seed
   ```

3. **Test the complete flow:**
   ```bash
   npm run test:complete-flow
   ```

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production environment configured"
   git push origin main
   ```

5. **Deploy to Vercel:**
   - Go to vercel.com
   - Import your GitHub repository
   - Copy variables from `.env.vercel` to Vercel dashboard
   - Deploy!

---

## 🔐 Security Notes

### Keys to Keep Secret
Never commit these to Git:
- `.env.production`
- `.env.vercel`
- `.env.local`

### Keys Already in .gitignore
Your `.gitignore` should already have:
```
.env*
!.env.example
```

### Rotating Keys
To rotate security keys in production:
1. Generate new keys: `openssl rand -hex 32`
2. Update in Vercel dashboard
3. Redeploy application
4. Old keys become invalid immediately

---

## 🐛 Troubleshooting

### Database Connection Fails
- Check if `DATABASE_URL` has `?sslmode=require`
- Verify Neon project is not paused
- Check if IP is whitelisted in Neon (if enabled)

### Email Test Fails
- Verify `RESEND_API_KEY` is correct
- Check if sender email is verified in Resend
- Make sure you're not using `onboarding@resend.dev` in production

### Security Keys Too Short
- Keys should be 64 characters (32 bytes in hex)
- Run setup script again to regenerate

### "Module not found" Errors
- Make sure you ran `npm install`
- Check that all dependencies are installed

---

## 📞 Need Help?

If you encounter issues:

1. Check the test output for specific error messages
2. Verify all environment variables are set
3. Check Neon dashboard for database status
4. Check Resend dashboard for API key status
5. Review logs in `scripts/test-production-setup.mjs`

---

## 🎉 Success Criteria

You're ready to deploy when:
- ✅ `npm run test:production` passes all tests
- ✅ You received the test email
- ✅ Database shows all required tables
- ✅ Security keys are properly generated
- ✅ `.env.vercel` file is ready for Vercel

**Estimated total time: 25-30 minutes** ⏱️
