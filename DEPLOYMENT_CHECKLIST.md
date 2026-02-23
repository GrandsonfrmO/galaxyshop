# Vercel Deployment Checklist

## Phase 1: Pre-Deployment (Local)

### Code Quality
- [ ] Run `npm run build` locally - no errors
- [ ] Run `npm run pre-deploy` - all checks pass
- [ ] No console errors or warnings in browser
- [ ] All TypeScript types are correct
- [ ] No unused imports or variables

### Environment Setup
- [ ] `.env.production` file exists with all required variables
- [ ] All API keys are valid and not placeholders
- [ ] Database connection string is correct
- [ ] Email service credentials are valid
- [ ] Encryption keys are generated and secure

### Database
- [ ] Neon database is created and running
- [ ] Database connection is tested locally
- [ ] All migrations run successfully: `npm run db:migrate`
- [ ] Database schema is correct
- [ ] Sample data is seeded (optional)

### Security
- [ ] Admin API key is strong (32+ characters)
- [ ] Internal API key is strong (32+ characters)
- [ ] Encryption key is strong (32+ characters)
- [ ] CSRF protection is enabled
- [ ] Rate limiting is configured
- [ ] Input sanitization is active
- [ ] Security headers are set in vercel.json

### API Testing
- [ ] Health endpoint works: `curl http://localhost:5000/health`
- [ ] Products endpoint works: `curl http://localhost:5000/api/products`
- [ ] Order creation works with valid data
- [ ] Admin endpoints require authentication
- [ ] CSRF token is returned in responses

### Frontend Testing
- [ ] App builds without errors
- [ ] All pages load correctly
- [ ] Product search works
- [ ] Shopping cart functions
- [ ] Checkout process works
- [ ] Admin panel is accessible

## Phase 2: Vercel Setup

### Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public or Vercel has access
- [ ] No sensitive data in repository
- [ ] `.gitignore` includes `.env.local`

### Vercel Project
- [ ] Project is created on Vercel
- [ ] GitHub repository is connected
- [ ] Project name is set correctly
- [ ] Root directory is set to project root

### Environment Variables
- [ ] All required variables are added to Vercel
- [ ] Variables are set for Production environment
- [ ] Variables are set for Preview environment (optional)
- [ ] Variables are set for Development environment (optional)
- [ ] No sensitive data is visible in logs

### Build Configuration
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`
- [ ] Node.js version is compatible (18+)
- [ ] Build timeout is sufficient (>60 seconds)

### Deployment Settings
- [ ] Auto-deploy on push is enabled
- [ ] Production branch is set to `main` or `master`
- [ ] Preview deployments are enabled
- [ ] Automatic rollback is enabled

## Phase 3: First Deployment

### Pre-Deployment
- [ ] Run `npm run pre-deploy` - all checks pass
- [ ] Commit all changes to GitHub
- [ ] Push to main branch

### Deployment
- [ ] Vercel starts building automatically
- [ ] Build completes without errors
- [ ] Deployment is successful
- [ ] Production URL is accessible

### Post-Deployment Verification
- [ ] Health endpoint returns 200: `curl https://your-domain.vercel.app/health`
- [ ] Products endpoint works: `curl https://your-domain.vercel.app/api/products`
- [ ] Security headers are present
- [ ] HTTPS is enforced
- [ ] No mixed content warnings

### Functionality Testing
- [ ] Frontend loads correctly
- [ ] All pages are accessible
- [ ] Product search works
- [ ] Shopping cart functions
- [ ] Checkout process works
- [ ] Orders are created successfully
- [ ] Confirmation emails are sent
- [ ] Admin panel is accessible
- [ ] Admin functions work correctly

### Performance Testing
- [ ] Page load time is acceptable (<3s)
- [ ] API response time is acceptable (<500ms)
- [ ] Images load correctly
- [ ] No 404 errors in console
- [ ] No CORS errors

### Security Testing
- [ ] CSRF token is required for POST requests
- [ ] Rate limiting is working
- [ ] Admin endpoints require authentication
- [ ] Invalid API keys are rejected
- [ ] XSS attempts are sanitized
- [ ] SQL injection attempts are blocked

## Phase 4: Monitoring

### Logs
- [ ] Check Vercel function logs for errors
- [ ] Check database connection logs
- [ ] Check email delivery logs
- [ ] No sensitive data in logs

### Metrics
- [ ] Monitor error rate (should be <1%)
- [ ] Monitor response time (should be <500ms)
- [ ] Monitor database connection pool
- [ ] Monitor email delivery rate

### Alerts
- [ ] Set up error alerts
- [ ] Set up performance alerts
- [ ] Set up uptime monitoring
- [ ] Set up email delivery alerts

## Phase 5: Post-Deployment

### Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Document environment variables
- [ ] Document troubleshooting steps

### Backup & Recovery
- [ ] Enable database backups
- [ ] Test backup restoration
- [ ] Document recovery procedure
- [ ] Set up monitoring alerts

### Maintenance
- [ ] Schedule regular security audits
- [ ] Schedule dependency updates
- [ ] Schedule database maintenance
- [ ] Schedule performance reviews

## Troubleshooting

### Build Failures
**Problem**: Build fails with TypeScript errors
**Solution**:
1. Check `npm run build` locally
2. Verify all imports are correct
3. Check tsconfig.json
4. Clear Vercel cache and redeploy

**Problem**: Build fails with missing dependencies
**Solution**:
1. Run `npm install` locally
2. Check package.json for all dependencies
3. Verify package-lock.json is committed
4. Clear node_modules and reinstall

### Runtime Errors
**Problem**: 500 errors on API endpoints
**Solution**:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test database connection
4. Check API key validity

**Problem**: Database connection fails
**Solution**:
1. Verify DATABASE_URL is correct
2. Check Neon database is running
3. Verify IP whitelist (if enabled)
4. Test connection string locally

### Email Issues
**Problem**: Emails not sending
**Solution**:
1. Verify RESEND_API_KEY is correct
2. Check ADMIN_EMAIL is valid
3. Verify RESEND_EMAIL_FROM is authorized
4. Check email logs: `/api/test/email-logs`

**Problem**: Emails going to spam
**Solution**:
1. Add SPF record
2. Add DKIM record
3. Add DMARC record
4. Use branded email domain

### Performance Issues
**Problem**: Slow page load
**Solution**:
1. Check Vercel Analytics
2. Optimize images
3. Enable caching
4. Check database queries

**Problem**: High API latency
**Solution**:
1. Check database connection pool
2. Optimize database queries
3. Add caching layer
3. Check rate limiting

## Rollback Procedure

If deployment fails:
1. Go to Vercel dashboard
2. Select previous successful deployment
3. Click "Promote to Production"
4. Verify application works
5. Investigate and fix issues
6. Redeploy

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Resend Docs: https://resend.com/docs
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Vite Docs: https://vitejs.dev/

## Quick Commands

```bash
# Pre-deployment check
npm run pre-deploy

# Build locally
npm run build

# Run migrations
npm run db:migrate

# Test API locally
npm run server

# Full deployment
npm run deploy:vercel
```

## Notes

- Keep this checklist updated as the application evolves
- Review and update security settings regularly
- Monitor performance metrics continuously
- Test disaster recovery procedures quarterly
- Keep documentation up-to-date
