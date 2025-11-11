# 🚀 Vercel Deployment Guide for GlamHomeBook

This guide will help you deploy your Node.js + React application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm install -g vercel`
3. **GitHub/GitLab Account**: For automatic deployments

## ⚠️ Important Limitations

### Serverless Functions on Vercel:
- ❌ **Cron Jobs**: The `scheduler.ts` file won't work on Vercel's serverless platform
  - **Solution**: Use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) (requires Pro plan) or external services like [cron-job.org](https://cron-job.org)
- ❌ **Long-running processes**: Max execution time is 10s (Hobby) / 60s (Pro)
- ❌ **WebSocket persistence**: Not recommended for production
- ✅ **API Routes**: All your Express routes will work as serverless functions
- ✅ **Database**: Your Neon PostgreSQL connection will work perfectly

## 🔧 Environment Variables

You **MUST** set these in Vercel Dashboard (Settings → Environment Variables):

### Required Variables:
```bash
# Database
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Session Secret
SESSION_SECRET=your-super-secret-key-here

# Node Environment
NODE_ENV=production
```

### Optional Variables:
```bash
# OpenAI (for blog generation)
OPENAI_API_KEY=sk-...

# WhatsApp/Ultramessage
ULTRAMSG_TOKEN=your-token
ULTRAMSG_INSTANCE=your-instance

# Admin Credentials (if using local admin)
ADMIN_EMAIL=admin@glamhomebook.com
ADMIN_PASSWORD=your-secure-password
```

## 📦 Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GlamHomeBook repository
   - Vercel will auto-detect the framework

3. **Configure Environment Variables**:
   - In the import screen, add all environment variables listed above
   - Or add them later in Settings → Environment Variables

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-5 minutes for build to complete
   - Your app will be live at `your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add STRIPE_SECRET_KEY production
   # ... add all other variables
   ```

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## 🔄 Setting Up Cron Jobs (Scheduler Replacement)

Since your app uses `scheduler.ts` for automated offers, you need to replace it:

### Option 1: Vercel Cron Jobs (Pro Plan Required)

Update `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/generate-offers",
      "schedule": "0 10 * * *"
    }
  ]
}
```

Create `/api/cron/generate-offers.ts`:
```typescript
export default async function handler(req: any, res: any) {
  // Verify Vercel cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Call your offer generation logic
  // ...
  
  return res.status(200).json({ success: true });
}
```

### Option 2: External Cron Service (Free)

Use [cron-job.org](https://cron-job.org) or similar:
1. Create an account
2. Set up a cron job to call: `https://your-app.vercel.app/api/offers/trigger-automated`
3. Add authentication header

## 🔐 Stripe Webhook Configuration

After deployment, update your Stripe webhook URL:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
4. Copy the webhook signing secret
5. Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`

## 🗄️ Database Setup

Your app uses Neon PostgreSQL. Make sure:

1. **Database is migrated**:
   ```bash
   npm run db:push
   ```

2. **Connection pooling** is enabled in Neon (it's on by default)

3. **DATABASE_URL** format:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

## 📊 Monitoring & Logs

View logs in Vercel Dashboard:
- Deployments → Your deployment → Logs
- Or use CLI: `vercel logs your-deployment-url`

## 🎨 Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be auto-provisioned

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-app.vercel.app`
2. **API Health**: `https://your-app.vercel.app/api/beauticians`
3. **Admin Login**: `https://your-app.vercel.app/admin-login`

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run check`

### API Routes 500 Error
- Check function logs in Vercel Dashboard
- Verify all environment variables are set
- Check database connection string

### Stripe Webhooks Not Working
- Verify webhook secret is correct
- Check webhook endpoint in Stripe Dashboard
- View logs: Vercel Dashboard → Functions → Logs

### Database Connection Issues
- Verify DATABASE_URL is correct
- Enable connection pooling in Neon
- Check IP allowlist (Vercel IPs should be allowed)

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your repository:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## 📈 Performance Optimization

1. **Enable Edge Functions** (optional):
   - Faster response times globally
   - Update `vercel.json` with edge config

2. **Optimize Images**:
   - Use Vercel Image Optimization
   - Replace `<img>` with Next.js `<Image>` component (if migrating to Next.js)

3. **Caching**:
   - Vercel automatically caches static assets
   - Add cache headers to API routes if needed

## 🆘 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: support@vercel.com (Pro plan)

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated (`npm run db:push`)
- [ ] Stripe webhook URL updated
- [ ] Cron jobs replaced (using Vercel Cron or external service)
- [ ] Admin credentials set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] All pages loading correctly
- [ ] Payment flow tested
- [ ] Email/WhatsApp notifications tested

---

**Happy Deploying! 🎉**

For more help, refer to the [Vercel Documentation](https://vercel.com/docs) or reach out to your development team.

