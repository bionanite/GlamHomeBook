# ✅ Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is configured correctly.

## 🔍 Files & Configuration

### Required Files (Auto-generated)
- [x] `vercel.json` - Vercel configuration
- [x] `api/index.ts` - Serverless function handler
- [x] `api/cron/generate-offers.ts` - Cron job handler
- [x] `.vercelignore` - Build optimization
- [x] `package.json` - Updated scripts
- [x] `vite.config.ts` - Vercel-compatible config

### Documentation Files
- [x] `README_VERCEL.md` - Main deployment guide
- [x] `VERCEL_DEPLOYMENT.md` - Detailed instructions
- [x] `DEPLOY_QUICK_START.md` - Quick start guide
- [x] `DEPLOYMENT_SUMMARY.md` - Summary of changes
- [x] `PRE_DEPLOY_CHECKLIST.md` - This file

## 🧪 Local Testing

Run these commands to verify everything works:

### 1. Install Dependencies
```bash
npm install
```
- [ ] ✅ No errors
- [ ] ✅ All packages installed

### 2. TypeScript Check
```bash
npm run check
```
- [ ] ✅ No TypeScript errors

### 3. Build Test
```bash
npm run build
```
- [ ] ✅ Frontend builds successfully
- [ ] ✅ API builds successfully
- [ ] ✅ No build errors

### 4. Local Development
```bash
npm run dev
```
- [ ] ✅ Server starts without errors
- [ ] ✅ Can access http://localhost:5000
- [ ] ✅ API routes work

## 🗄️ Database Setup

### Neon PostgreSQL
- [ ] ✅ Database created
- [ ] ✅ Connection string obtained
- [ ] ✅ Schema pushed: `npm run db:push`
- [ ] ✅ Test connection works

### Connection String Format
```
postgresql://user:password@host/database?sslmode=require
```

## 💳 Stripe Configuration

### Stripe Dashboard
- [ ] ✅ Account created/activated
- [ ] ✅ Test mode keys obtained:
  - [ ] Secret key: `sk_test_...`
  - [ ] Publishable key: `pk_test_...`
- [ ] ✅ Webhook endpoint ready to update after deployment

### Products/Prices
- [ ] ✅ Test products created (optional)
- [ ] ✅ Payment methods configured

## 🔐 Environment Variables

### Required Variables (Must Have)
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_... or sk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - Will add after deployment
- [ ] `SESSION_SECRET` - Random string (32+ characters)
- [ ] `NODE_ENV=production`

### Optional Variables (Add If Using)
- [ ] `OPENAI_API_KEY` - For blog generation
- [ ] `ULTRAMSG_TOKEN` - For WhatsApp notifications
- [ ] `ULTRAMSG_INSTANCE` - WhatsApp instance ID
- [ ] `ADMIN_EMAIL` - Admin login email
- [ ] `ADMIN_PASSWORD` - Admin login password
- [ ] `CRON_SECRET` - For protecting cron endpoints

### Generate Secrets
```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32
```

## 📦 Git Repository

### GitHub/GitLab Setup
- [ ] ✅ Repository created
- [ ] ✅ .gitignore configured
- [ ] ✅ Local repo initialized: `git init`
- [ ] ✅ Remote added: `git remote add origin ...`
- [ ] ✅ Files committed:
  ```bash
  git add .
  git commit -m "Configure for Vercel deployment"
  ```
- [ ] ✅ Pushed to remote: `git push origin main`

## 🔄 Scheduler/Cron Setup

Choose ONE option:

### Option A: Vercel Cron (Pro Plan - $20/month)
- [ ] Ready to upgrade to Vercel Pro
- [ ] `CRON_SECRET` environment variable prepared
- [ ] Cron config already in `vercel.json` ✅

### Option B: External Cron Service (FREE)
- [ ] Signed up at [cron-job.org](https://cron-job.org)
- [ ] Cron job configuration ready:
  - URL: `https://[YOUR-APP].vercel.app/api/cron/generate-offers`
  - Schedule: `0 10 * * *` (daily at 10 AM)
  - Header: `Authorization: Bearer [CRON_SECRET]`
- [ ] `CRON_SECRET` prepared

## 🎨 Custom Domain (Optional)

If using custom domain:
- [ ] Domain purchased
- [ ] DNS access available
- [ ] SSL certificate ready (Vercel handles this)

## 📊 Monitoring & Analytics

- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking service configured (optional, e.g., Sentry)
- [ ] Stripe webhooks monitoring set up

## 🚀 Deployment Readiness

### Vercel Account
- [ ] ✅ Vercel account created
- [ ] ✅ Vercel CLI installed (optional): `npm install -g vercel`
- [ ] ✅ GitHub/GitLab connected to Vercel

### Pre-Deploy Validation
- [ ] ✅ All required files present
- [ ] ✅ Build passes locally
- [ ] ✅ No TypeScript errors
- [ ] ✅ Environment variables documented
- [ ] ✅ Database schema pushed
- [ ] ✅ Code pushed to repository

## 📝 Deployment Plan

### Step 1: Initial Deploy
1. [ ] Go to [vercel.com/new](https://vercel.com/new)
2. [ ] Import Git repository
3. [ ] Add environment variables (except STRIPE_WEBHOOK_SECRET)
4. [ ] Click "Deploy"
5. [ ] Wait for deployment to complete
6. [ ] Note your deployment URL: `https://[your-app].vercel.app`

### Step 2: Configure Stripe Webhook
1. [ ] Go to Stripe Dashboard → Webhooks
2. [ ] Add endpoint: `https://[your-app].vercel.app/api/stripe/webhook`
3. [ ] Select events: `payment_intent.*`
4. [ ] Copy webhook signing secret
5. [ ] Add `STRIPE_WEBHOOK_SECRET` to Vercel
6. [ ] Redeploy: `vercel --prod` or push to main branch

### Step 3: Configure Cron Job
1. [ ] If using Vercel Cron: Add `CRON_SECRET` env var
2. [ ] If using external cron: Set up job at cron-job.org
3. [ ] Test cron endpoint manually
4. [ ] Verify offers are generated

### Step 4: Testing
1. [ ] Test homepage loads
2. [ ] Test API endpoints
3. [ ] Test admin login
4. [ ] Test beautician onboarding
5. [ ] Test booking flow
6. [ ] Test payment flow (end-to-end)
7. [ ] Test Stripe webhooks
8. [ ] Test cron job

## ✅ Post-Deployment Verification

After deployment, verify:

### Frontend
- [ ] ✅ Homepage loads: `https://your-app.vercel.app`
- [ ] ✅ All pages accessible
- [ ] ✅ Images load correctly
- [ ] ✅ No console errors

### API
- [ ] ✅ GET `/api/beauticians` returns data
- [ ] ✅ GET `/api/settings/social-media` works
- [ ] ✅ POST `/api/beauticians/onboard` (with auth)
- [ ] ✅ No 500 errors in function logs

### Authentication
- [ ] ✅ Admin login works
- [ ] ✅ Customer registration works
- [ ] ✅ Beautician onboarding works
- [ ] ✅ Session persists

### Payments
- [ ] ✅ Stripe checkout loads
- [ ] ✅ Test payment succeeds
- [ ] ✅ Webhook receives events
- [ ] ✅ Booking status updates

### Cron Job
- [ ] ✅ Endpoint is protected (401 without auth)
- [ ] ✅ Returns 200 with correct auth
- [ ] ✅ Offers are generated
- [ ] ✅ Scheduled job runs (if configured)

## 🐛 Common Issues

### Build Fails
- **Cause**: Missing dependencies or TypeScript errors
- **Fix**: Run `npm run check` and fix errors

### API Returns 500
- **Cause**: Missing environment variables
- **Fix**: Add all required env vars in Vercel Dashboard

### Database Connection Fails
- **Cause**: Wrong connection string
- **Fix**: Verify `DATABASE_URL` in Neon dashboard

### Stripe Webhook Fails
- **Cause**: Wrong webhook secret
- **Fix**: Update `STRIPE_WEBHOOK_SECRET` in Vercel

### Cron Job Doesn't Run
- **Cause**: Not configured or wrong secret
- **Fix**: Verify cron setup and `CRON_SECRET`

## 📚 Documentation Reference

- **Quick Start**: [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
- **Full Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **README**: [README_VERCEL.md](./README_VERCEL.md)
- **Summary**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

## 🎉 Ready to Deploy!

Once all items are checked, you're ready to deploy!

**Deploy now**: Follow [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)

---

## 📞 Support

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [GitHub Discussions](https://github.com/vercel/vercel/discussions)

**Good luck! 🚀**

