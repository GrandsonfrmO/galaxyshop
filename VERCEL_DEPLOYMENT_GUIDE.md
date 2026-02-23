# Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Before deploying to Vercel, ensure all required environment variables are configured:

**Required Variables:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `RESEND_API_KEY` - Resend email service API key
- `ADMIN_EMAIL` - Email for order notifications
- `RESEND_EMAIL_FROM` - Email sender address
- `ADMIN_API_KEY` - Secure admin API key (generate: `openssl rand -hex 32`)
- `INTERNAL_API_KEY` - Internal API key (generate: `openssl rand -hex 32`)
- `ENCRYPTION_KEY` - Encryption key for sensitive data (generate: `openssl rand -hex 32`)

**Optional Security Variables:**
- `IP_WHITELIST_ENABLED` - Set to `true` to enable IP whitelisting
- `WHITELISTED_IPS` - Comma-separated list of allowed IPs
- `ALLOW_PRIVATE_IPS` - Set to `true` to allow private IP ranges
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

### 2. Database Setup
1. Create a Neon PostgreSQL database at https://console.neon.tech
2. Get the connection string from Neon console
3. Run migrations on the production database:
   ```bash
   DATABASE_URL="your-neon-connection-string" npm run db:migrate
   ```

### 3. API Keys
- **Gemini API**: Get from https://ai.google.dev/
- **Resend Email**: Get from https://resend.com/api-keys
- **Admin/Internal API Keys**: Generate secure random keys

## Deployment Steps

### Step 1: Connect Repository to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the project root directory
4. Click "Deploy"

### Step 2: Configure Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add all required variables from the checklist above
3. Set environment to: Production, Preview, Development (as needed)

### Step 3: Configure Build Settings
Vercel should auto-detect the build settings, but verify:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Configure Serverless Functions
The API routes are handled by Express server. Vercel will:
1. Build the frontend with Vite
2. Serve static files from `dist/`
3. Route API calls to the Express server

### Step 5: Deploy
1. Push changes to your repository
2. Vercel will automatically deploy on push
3. Monitor deployment in Vercel dashboard

## Post-Deployment Verification

### 1. Check Health Endpoint
```bash
curl https://your-domain.vercel.app/health
# Should return: { "status": "ok" }
```

### 2. Test API Endpoints
```bash
# Get products
curl https://your-domain.vercel.app/api/products

# Create order
curl -X POST https://your-domain.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "items": [{"id": "1", "name": "Product", "price": 100, "quantity": 1}],
    "totalAmount": 100
  }'
```

### 3. Verify Security Headers
```bash
curl -i https://your-domain.vercel.app/
# Check for security headers:
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - X-XSS-Protection: 1; mode=block
```

### 4. Test Admin Panel
1. Navigate to `/admin`
2. Login with admin credentials
3. Verify all admin functions work

## Troubleshooting

### Build Failures
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation: `npm run build` locally

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check Neon database is running
3. Ensure IP whitelist allows Vercel IPs (if enabled)
4. Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Email Not Sending
1. Verify `RESEND_API_KEY` is correct
2. Check `ADMIN_EMAIL` is valid
3. Verify `RESEND_EMAIL_FROM` is authorized in Resend
4. Check email logs: `curl https://your-domain.vercel.app/api/test/email-logs`

### Rate Limiting Issues
1. Check `X-RateLimit-*` headers in response
2. Verify rate limit configuration in environment variables
3. Consider increasing limits for legitimate high-traffic scenarios

### CSRF Token Errors
1. Ensure token is included in request headers
2. Check token hasn't expired (24 hours)
3. Verify token format is correct

## Performance Optimization

### 1. Enable Caching
Vercel automatically caches:
- Static assets (images, CSS, JS)
- API responses (if configured)

### 2. Monitor Performance
1. Use Vercel Analytics dashboard
2. Check Core Web Vitals
3. Monitor API response times

### 3. Optimize Images
- Use WebP format where possible
- Implement lazy loading
- Use responsive images

## Security Checklist

- [ ] All environment variables are set in Vercel
- [ ] Database connection uses SSL (sslmode=require)
- [ ] Admin API key is strong and unique
- [ ] CSRF protection is enabled
- [ ] Rate limiting is configured
- [ ] IP whitelist is configured (if needed)
- [ ] Security headers are set in vercel.json
- [ ] HTTPS is enforced
- [ ] Email service is configured
- [ ] Encryption key is set for sensitive data

## Monitoring and Maintenance

### 1. Set Up Alerts
- Monitor error rates
- Track API response times
- Watch database connection pool

### 2. Regular Backups
- Neon provides automatic backups
- Configure backup retention policy
- Test restore procedures

### 3. Update Dependencies
```bash
npm audit
npm update
```

### 4. Review Logs
- Check Vercel function logs
- Monitor database logs
- Review email delivery logs

## Rollback Procedure

If deployment fails:
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"
4. Verify application works

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Resend Docs: https://resend.com/docs
