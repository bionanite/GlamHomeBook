# 🎨 GlamHomeBook - Vercel Deployment Guide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/glamhomebook)

## 🚀 Quick Deploy

**Choose your deployment method:**

1. **🚀 Fast Track (5 min)**: [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
2. **📚 Detailed Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 📦 What's Included

This project is fully configured for Vercel deployment with:

- ✅ **React Frontend** - Optimized Vite build
- ✅ **Express API** - Converted to serverless functions
- ✅ **PostgreSQL Database** - Neon serverless database
- ✅ **Stripe Payments** - Webhook support
- ✅ **Authentication** - Session-based auth
- ✅ **Cron Jobs** - Scheduled offer generation (Pro plan or external service)
- ✅ **TypeScript** - Full type safety

## 🏗️ Project Structure

```
GlamHomeBook-3/
├── api/                          # Vercel serverless functions
│   ├── index.ts                 # Main API handler
│   └── cron/
│       └── generate-offers.ts   # Automated offer generation
├── client/                       # React frontend
│   └── src/
├── server/                       # Backend logic (shared with API)
│   ├── routes.ts                # API routes
│   ├── storage.ts               # Database operations
│   └── services/                # Business logic
├── shared/                       # Shared types/schemas
├── vercel.json                   # Vercel configuration
├── DEPLOY_QUICK_START.md        # 5-minute deployment guide
└── VERCEL_DEPLOYMENT.md         # Detailed deployment guide
```

## 🔑 Required Environment Variables

Add these in Vercel Dashboard (Settings → Environment Variables):

```bash
# Essential - Add BEFORE deploying
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SESSION_SECRET=random-secret-here
NODE_ENV=production

# Optional - Add as needed
OPENAI_API_KEY=sk-...
ULTRAMSG_TOKEN=...
CRON_SECRET=...
```

## 📝 Deployment Checklist

Before deploying, ensure:

- [ ] ✅ Build passes locally: `npm run build`
- [ ] ✅ Database is created (Neon PostgreSQL)
- [ ] ✅ Stripe account is set up
- [ ] ✅ Environment variables are documented
- [ ] ✅ Git repository is created
- [ ] ✅ Code is pushed to GitHub/GitLab

After deploying:

- [ ] ✅ Environment variables are added to Vercel
- [ ] ✅ Stripe webhook URL is updated
- [ ] ✅ Database is migrated: `npm run db:push`
- [ ] ✅ Cron job is configured (Vercel Cron or external)
- [ ] ✅ Admin account is created
- [ ] ✅ Payment flow is tested
- [ ] ✅ Custom domain is configured (optional)

## 🧪 Test Your Deployment

After deploying, test these endpoints:

### Frontend
```bash
# Homepage
https://your-app.vercel.app/

# Admin dashboard
https://your-app.vercel.app/admin-login
```

### API Endpoints
```bash
# Get beauticians
curl https://your-app.vercel.app/api/beauticians

# Health check
curl https://your-app.vercel.app/api/settings/social-media
```

### Cron Job (Protected)
```bash
curl -X POST https://your-app.vercel.app/api/cron/generate-offers \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ⚙️ Configuration Files

### `vercel.json`
Configures Vercel deployment, serverless functions, and cron jobs.

```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cron/generate-offers",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### `package.json` Scripts
- `npm run build` - Build frontend and API
- `npm run build:api` - Build serverless functions only
- `npm run dev` - Local development
- `npm run db:push` - Migrate database

## 🚨 Common Issues & Solutions

### Build Fails
```bash
# Test locally first
npm install
npm run build

# Check TypeScript errors
npm run check
```

### API Returns 500
- Check Vercel function logs
- Verify environment variables are set
- Check database connection string

### Database Connection Fails
- Enable connection pooling in Neon
- Verify `DATABASE_URL` format
- Check Neon IP allowlist

### Stripe Webhooks Not Working
- Update webhook URL in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check function logs for errors

### Cron Jobs Not Running
**Free Tier**: Use external service like [cron-job.org](https://cron-job.org)
**Pro Plan**: Ensure `CRON_SECRET` is set and cron is configured in `vercel.json`

## 📊 Performance

Expected performance on Vercel:

- **Frontend**: ~100ms response time (CDN cached)
- **API Routes**: ~200-500ms (cold start), ~50-150ms (warm)
- **Database Queries**: ~50-200ms (Neon serverless)
- **Stripe Webhooks**: ~100-300ms

### Optimization Tips

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Compress images before uploading
3. **API Caching**: Add cache headers for static data
4. **Database Indexing**: Add indexes for frequently queried fields

## 🔐 Security

Security features included:

- ✅ Session-based authentication
- ✅ Rate limiting on admin routes
- ✅ CORS protection
- ✅ Stripe webhook signature verification
- ✅ Environment variable encryption
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection (React)

### Additional Security Steps

1. Set strong `SESSION_SECRET` (32+ characters)
2. Use strong admin password
3. Enable Vercel authentication (Pro plan)
4. Set up custom domain with SSL
5. Enable Vercel firewall (Pro plan)
6. Regularly update dependencies: `npm audit fix`

## 🌐 Custom Domain

To use a custom domain:

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain: `www.glamhomebook.com`
3. Update DNS records as instructed
4. SSL certificate will be auto-provisioned
5. Update Stripe webhook URL with new domain

## 📈 Scaling

Your app is ready to scale on Vercel:

- **Automatic scaling**: Handles traffic spikes automatically
- **Global CDN**: Content served from nearest edge location
- **Serverless**: No server management required
- **Database**: Neon scales automatically

### Upgrade to Pro Plan for:
- Longer function execution time (60s vs 10s)
- More bandwidth and functions invocations
- Vercel Cron Jobs
- Priority support
- Team collaboration features

## 💰 Cost Estimate

### Free Tier (Hobby)
- ✅ 100 GB bandwidth
- ✅ 100 hours serverless function execution
- ✅ 1 concurrent build
- ⚠️ No cron jobs (use external service)

### Pro Plan ($20/month)
- ✅ 1 TB bandwidth
- ✅ 1000 hours serverless function execution
- ✅ 3 concurrent builds
- ✅ Vercel Cron Jobs
- ✅ Password protection
- ✅ Priority support

**Estimated Monthly Cost for Small Business:**
- Vercel: $0-20 (Free or Pro)
- Neon Database: $0-25 (Free tier or Scale)
- Stripe: Pay per transaction (2.9% + 30¢)
- **Total: $0-50/month** (depending on traffic)

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Stripe Integration](https://stripe.com/docs)
- [React Documentation](https://react.dev)

## 🆘 Support

Need help?

1. **Documentation**: Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
2. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
3. **Community**: [GitHub Discussions](https://github.com/vercel/vercel/discussions)
4. **Stripe Support**: [stripe.com/support](https://stripe.com/support)

## 🔄 Continuous Deployment

Your app is configured for automatic deployments:

- **Production**: Pushes to `main` branch → `your-app.vercel.app`
- **Preview**: Pull requests → `your-app-git-branch.vercel.app`
- **Development**: Local → `localhost:5000`

### Deployment Workflow

```bash
# Make changes
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin main

# Vercel automatically deploys
# View deployment at: https://vercel.com/dashboard
```

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Ready to Deploy?

Choose your deployment method:

1. **🚀 Quick Start (5 minutes)**: [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
2. **📚 Detailed Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Questions?** Open an issue or contact support.

**Happy deploying! 🚀✨**

