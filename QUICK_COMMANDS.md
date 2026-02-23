# ⚡ Quick Commands Reference

## 🚀 Production Setup (Steps 2-6)

### One-Command Setup
```bash
npm run setup:production && npm run test:production
```
This runs the interactive setup and tests everything automatically.

---

## 📋 Step-by-Step Commands

### Step 2-5: Configure Environment
```bash
npm run setup:production
```
- Guides you through Neon/Resend configuration
- Generates secure keys
- Creates `.env.production` and `.env.vercel`

### Step 6: Test Everything
```bash
npm run test:production
```
- Tests database connection
- Sends test email
- Validates security keys

### Initialize Production Database
```bash
npm run db:init:production
```
- Runs all migrations
- Shows table status
- Displays record counts

### Test Complete Flow
```bash
npm run test:complete-flow
```
- Tests products API
- Tests order creation
- Tests email sending
- Tests admin API

---

## 🔧 Troubleshooting Commands

### Check Database Connection
```bash
node scripts/diagnose-database.mjs
```

### Test Email Only
```bash
node scripts/test-email.mjs
```

### Test Order Flow
```bash
npm run test:order-flow
```

### Pre-Deployment Check
```bash
npm run pre-deploy
```

---

## 📊 Expected Output

### ✅ Success Looks Like:
```
🧪 Testing Production Setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test 1: Database Connection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Connected to database
✓ Database test PASSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Test 2: Email Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Test email sent
✓ Email test PASSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Test 3: Security Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ ADMIN_API_KEY is configured
✓ INTERNAL_API_KEY is configured
✓ ENCRYPTION_KEY is configured
✓ Security test PASSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Database:  ✅ PASS
Email:     ✅ PASS
Security:  ✅ PASS

🎉 All tests passed! Ready for deployment.
```

---

## ⏱️ Time Estimates

| Command | Time | What It Does |
|---------|------|--------------|
| `npm run setup:production` | 5 min | Interactive setup wizard |
| `npm run test:production` | 2 min | Comprehensive tests |
| `npm run db:init:production` | 1 min | Database initialization |
| `npm run test:complete-flow` | 2 min | End-to-end testing |
| **Total** | **~10 min** | Complete setup & testing |

---

## 🎯 Recommended Workflow

```bash
# 1. Setup (5 min)
npm run setup:production

# 2. Test (2 min)
npm run test:production

# 3. Initialize DB (1 min)
npm run db:init:production

# 4. Final test (2 min)
npm run test:complete-flow

# 5. Ready to deploy! 🚀
```

---

## 🔑 What Gets Created

After running setup:
- ✅ `.env.production` - For local testing
- ✅ `.env.vercel` - For Vercel deployment
- ✅ Secure API keys (64 chars each)
- ✅ Encryption key
- ✅ All environment variables configured

---

## 📝 Next Steps After Success

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production environment ready"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to vercel.com
   - Import repository
   - Copy variables from `.env.vercel`
   - Deploy!

---

## 🆘 If Something Fails

### Database Connection Error
```bash
# Check your DATABASE_URL
cat .env.production | grep DATABASE_URL

# Test connection manually
node scripts/diagnose-database.mjs
```

### Email Test Error
```bash
# Check Resend configuration
cat .env.production | grep RESEND

# Test email manually
node scripts/test-email.mjs
```

### Security Keys Error
```bash
# Regenerate keys
npm run setup:production
# Choose option to regenerate keys
```

---

## 💡 Pro Tips

1. **Keep `.env.vercel` handy** - You'll need it for Vercel setup
2. **Save your keys** - Store them in a password manager
3. **Test email first** - Make sure you receive the test email
4. **Check spam folder** - Test emails might go there
5. **Use non-pooler URL** - For migrations, use direct connection

---

## 🔒 Security Reminders

- ✅ `.env.production` is in `.gitignore`
- ✅ `.env.vercel` is in `.gitignore`
- ✅ Never commit these files
- ✅ Rotate keys regularly
- ✅ Use strong, random keys (64 chars)

---

## 📞 Quick Help

**Everything working?** → Proceed to Vercel deployment

**Database issues?** → Check Neon dashboard, verify URL

**Email issues?** → Check Resend dashboard, verify API key

**Security issues?** → Regenerate keys with setup script

**Still stuck?** → Check logs in test output for details
