# 🚀 Quick Start: Deploy to Vercel in 5 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/glamhomebook.git
git branch -M main
git push -u origin main
```

## Step 2: Import to Vercel (1 minute)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GlamHomeBook repository
4. Click "Import"

## Step 3: Add Environment Variables (2 minutes)

Before clicking "Deploy", add these environment variables:

### ✅ Required (Add these NOW):
```
DATABASE_URL=your_neon_postgres_url
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SESSION_SECRET=generate-a-random-string-here
NODE_ENV=production
```

### ⚠️ Optional (Add later if needed):
```
OPENAI_API_KEY=sk-...
ULTRAMSG_TOKEN=...
ULTRAMSG_INSTANCE=...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
CRON_SECRET=random-secret-for-cron-jobs
```

## Step 4: Deploy! (2 minutes)

Click "Deploy" and wait for the build to complete.

Your app will be live at: `https://your-project-name.vercel.app`

## Step 5: Configure Stripe Webhook (1 minute)

After deployment:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-project-name.vercel.app/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
4. Copy webhook secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

## 🎉 Done!

Visit your live site: `https://your-project-name.vercel.app`

---

## 📝 Important Notes

### ⚠️ Scheduler/Cron Jobs
The automated offer scheduler won't work on Vercel's free tier. You have two options:

**Option 1: Vercel Cron (Pro Plan - $20/month)**
- Already configured in `vercel.json`
- Runs daily at 10 AM UTC
- Add `CRON_SECRET` env variable

**Option 2: External Cron Service (FREE)**
1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create a cron job:
   - URL: `https://your-app.vercel.app/api/cron/generate-offers`
   - Schedule: Daily at 10:00 AM
   - Header: `Authorization: Bearer YOUR_CRON_SECRET`
3. Add `CRON_SECRET` to Vercel env variables

---

## 🐛 Troubleshooting

### Build Failed?
- Check build logs in Vercel Dashboard
- Make sure all dependencies are installed: `npm install`
- Test local build: `npm run build`

### Can't Connect to Database?
- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection string
- Ensure database is migrated: `npm run db:push`

### API Routes Return 500?
- Check function logs in Vercel Dashboard
- Verify all required environment variables are set
- Check if Stripe keys are correct

---

## 📚 Full Documentation

For detailed information, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🆘 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Environment variables not loading | Redeploy after adding variables |
| Stripe webhook not working | Update webhook URL in Stripe Dashboard |
| Database connection timeout | Enable connection pooling in Neon |
| Cron jobs not running | Use external cron service (free) |

**Still stuck?** Check [Vercel Support](https://vercel.com/support) or the [Vercel Community](https://github.com/vercel/vercel/discussions)

