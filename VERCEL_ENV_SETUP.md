# 🔐 Vercel Environment Variables Setup

## ✅ Your Database URL (Ready to Use)

I have your Neon PostgreSQL database URL. Here's how to add it to Vercel:

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Find your project: **GlamHomeBook**
3. Click on the project
4. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Click **"Add New"** for each variable:

#### 1. DATABASE_URL (✅ Ready)
- **Key:** `DATABASE_URL`
- **Value:** `postgresql://neondb_owner:npg_SEbOR0igM9Dy@ep-curly-brook-afzxhm0b.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require`
- **Environment:** Production, Preview, Development (select all)

#### 2. SESSION_SECRET (Generate Now)
- **Key:** `SESSION_SECRET`
- **Value:** Generate with this command:
  ```bash
  openssl rand -base64 32
  ```
  Example output: `Kx8F3nP2mQ7vR9sT1wU4yB6cD8eG0hJ2lM5nO7pQ9r=`
- **Environment:** Production, Preview, Development

#### 3. STRIPE_SECRET_KEY (From Stripe Dashboard)
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** Get from https://dashboard.stripe.com/apikeys
  - Use `sk_test_...` for testing
  - Use `sk_live_...` for production
- **Environment:** Production

#### 4. NODE_ENV (Required)
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production

---

## ⚠️ After First Deployment

### 5. STRIPE_WEBHOOK_SECRET (Add After Deploy)

**Why wait?** You need your Vercel URL first to configure the webhook.

**Steps:**
1. After your first deployment, note your URL: `https://your-app.vercel.app`
2. Go to https://dashboard.stripe.com/webhooks
3. Click **"Add endpoint"**
4. Enter URL: `https://your-app.vercel.app/api/stripe/webhook`
5. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
6. Click **"Add endpoint"**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add to Vercel:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...`

---

## 🎯 Optional but Recommended

### 6. ALLOWED_ORIGINS (Security)
- **Key:** `ALLOWED_ORIGINS`
- **Value:** Your production domain (comma-separated)
  - Example: `glamhomebook.com,www.glamhomebook.com`
  - Or leave empty to allow all `.vercel.app` domains
- **Environment:** Production

### 7. CRON_SECRET (For scheduled tasks)
- **Key:** `CRON_SECRET`
- **Value:** Generate with: `openssl rand -base64 32`
- **Environment:** Production
- **Used for:** Protecting the `/api/cron/generate-offers` endpoint

---

## 📱 Optional Services

### For AI Blog Generation (OpenAI)
- **Key:** `OPENAI_API_KEY`
- **Value:** Get from https://platform.openai.com/api-keys
- **Environment:** Production

### For WhatsApp Notifications (Ultramessage)
- **Key:** `ULTRAMSG_TOKEN`
- **Value:** Your Ultramessage token
- **Environment:** Production

- **Key:** `ULTRAMSG_INSTANCE`
- **Value:** Your instance ID
- **Environment:** Production

### For Admin Access (Local Login)
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@example.com`
- **Environment:** Production

- **Key:** `ADMIN_PASSWORD`
- **Value:** Your secure password
- **Environment:** Production

---

## 🔑 Generate Secrets Commands

Run these in your terminal to generate secure secrets:

```bash
# SESSION_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32

# Or generate multiple at once:
echo "SESSION_SECRET=$(openssl rand -base64 32)"
echo "CRON_SECRET=$(openssl rand -base64 32)"
```

---

## ✅ Complete Setup Checklist

### Minimum Required (Must Have)
- [ ] ✅ DATABASE_URL (you have this!)
- [ ] SESSION_SECRET (generate now)
- [ ] STRIPE_SECRET_KEY (get from Stripe)
- [ ] NODE_ENV=production

### After First Deploy
- [ ] STRIPE_WEBHOOK_SECRET (after configuring webhook)

### Recommended
- [ ] ALLOWED_ORIGINS (your domain)
- [ ] CRON_SECRET (for scheduled tasks)

### Optional
- [ ] OPENAI_API_KEY (AI blog generation)
- [ ] ULTRAMSG_TOKEN (WhatsApp)
- [ ] ADMIN_EMAIL & ADMIN_PASSWORD

---

## 🚀 After Adding All Variables

1. **Redeploy** (if already deployed):
   - Vercel Dashboard → Deployments → "Redeploy"
   
   OR
   
2. **Deploy Now** (if first time):
   - Variables are set ✅
   - Go to: https://vercel.com/new
   - Import: `bionanite/GlamHomeBook`
   - Click "Deploy" (variables are already there!)

---

## 🧪 Verify Setup

After deployment, test:

```bash
# Replace with your actual Vercel URL
export VERCEL_URL="https://your-app.vercel.app"

# Test health (should show database: connected)
curl $VERCEL_URL/api/health

# Test API
curl $VERCEL_URL/api/beauticians

# Open in browser
open $VERCEL_URL
```

**Expected Results:**
- ✅ Health check returns: `{"status":"healthy","database":"connected"}`
- ✅ API returns JSON data
- ✅ Homepage loads correctly
- ✅ No 500 errors

---

## 🔐 Security Best Practices

### ✅ DO:
- Store all secrets in Vercel Dashboard
- Use strong random values for secrets
- Rotate secrets periodically
- Use `sk_test_` keys for testing
- Use `sk_live_` keys only in production

### ❌ DON'T:
- Never commit secrets to Git
- Never share your `.env` file
- Never expose secrets in logs
- Never use production keys in development

---

## 📊 Quick Reference

| Variable | Required | When to Add | Where to Get |
|----------|----------|-------------|--------------|
| DATABASE_URL | ✅ Yes | Before deploy | ✅ You have it! |
| SESSION_SECRET | ✅ Yes | Before deploy | Generate with OpenSSL |
| STRIPE_SECRET_KEY | ✅ Yes | Before deploy | Stripe Dashboard |
| NODE_ENV | ✅ Yes | Before deploy | Set to "production" |
| STRIPE_WEBHOOK_SECRET | ⚠️ After | After first deploy | Stripe Webhooks |
| ALLOWED_ORIGINS | 💡 Recommended | Before deploy | Your domain |
| CRON_SECRET | 💡 Recommended | Before deploy | Generate with OpenSSL |
| OPENAI_API_KEY | ℹ️ Optional | Anytime | OpenAI Platform |

---

## 🆘 Troubleshooting

### "Internal Server Error" after deployment
**Solution:** Check that all required environment variables are set

### "Database connection failed"
**Solution:** Verify DATABASE_URL is correct and includes `?sslmode=require`

### "Invalid Stripe key"
**Solution:** Ensure STRIPE_SECRET_KEY starts with `sk_test_` or `sk_live_`

### Webhook not receiving events
**Solution:** 
1. Check STRIPE_WEBHOOK_SECRET is set
2. Verify webhook URL in Stripe Dashboard
3. Test webhook in Stripe Dashboard

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
- **Neon Docs:** https://neon.tech/docs/connect/connection-string
- **Stripe Webhooks:** https://stripe.com/docs/webhooks

---

**Status:** ✅ Database URL Ready  
**Next Step:** Add variables to Vercel Dashboard  
**Then:** Deploy!  

**GO TO:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

