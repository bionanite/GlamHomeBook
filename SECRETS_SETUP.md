# 🔐 Kosmospace Secrets Setup Guide

## Good News! ✅

**All required secrets are already configured in your Replit project!**

Your application has the following secrets set up:
- ✅ Database credentials (PostgreSQL)
- ✅ Stripe payment keys
- ✅ OpenAI API key (for AI blog generation)
- ✅ Twilio WhatsApp credentials
- ✅ Ultramsg credentials
- ✅ Session secret

---

## How Secrets Work in Replit

**Important:** Replit doesn't use `.env` files. Instead, secrets are managed through the **Replit Secrets** tool, which is more secure.

### Viewing Your Secrets

1. Click the **lock icon** 🔒 in the left sidebar (Tools menu)
2. You'll see all your configured secrets
3. Click the eye icon to view (but **never share** these values!)

### Adding New Secrets

If you ever need to add more secrets:

1. Open the **Secrets** tool (lock icon)
2. Click **"New Secret"**
3. Enter the key name (e.g., `MY_NEW_SECRET`)
4. Enter the secret value
5. Click **"Add Secret"**

---

## Required Secrets Reference

See `.env.example` file for a complete list of all secrets your application needs.

### Core Services (All Configured ✅)

#### Database
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`

#### Payment Processing
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key

#### WhatsApp Messaging
- `ULTRAMSG_INSTANCE_ID` - Ultramsg instance ID
- `ULTRAMSG_TOKEN` - Ultramsg authentication token
- `TWILIO_ACCOUNT_SID` - Twilio account SID (fallback)
- `TWILIO_AUTH_TOKEN` - Twilio auth token (fallback)
- `TWILIO_WHATSAPP_NUMBER` - Twilio WhatsApp number

#### AI Features
- `OPENAI_API_KEY` - OpenAI API key for blog generation

#### Security
- `SESSION_SECRET` - Express session encryption key

---

## Where to Get API Keys

### Stripe (Payment Processing)
1. Visit: https://dashboard.stripe.com/apikeys
2. Copy **Publishable key** → `VITE_STRIPE_PUBLIC_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`

### OpenAI (AI Blog Generation)
1. Visit: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key → `OPENAI_API_KEY`
4. **Note:** Key is only shown once!

### Ultramsg (WhatsApp Primary)
1. Visit: https://ultramsg.com/
2. Create account and instance
3. Copy **Instance ID** → `ULTRAMSG_INSTANCE_ID`
4. Copy **Token** → `ULTRAMSG_TOKEN`

### Twilio (WhatsApp Fallback)
1. Visit: https://www.twilio.com/console
2. Copy **Account SID** → `TWILIO_ACCOUNT_SID`
3. Copy **Auth Token** → `TWILIO_AUTH_TOKEN`
4. Get WhatsApp number → `TWILIO_WHATSAPP_NUMBER`

---

## Security Best Practices

🚨 **Never:**
- Share your secret keys publicly
- Commit secrets to Git/GitHub
- Include secrets in screenshots
- Use production keys in development (use test keys)

✅ **Always:**
- Use Replit Secrets for sensitive data
- Rotate keys if they're compromised
- Use separate keys for testing and production
- Keep `.env.example` updated (without actual values)

---

## Testing Your Secrets

To verify all secrets are loaded:

```bash
# This will show secret names (not values)
env | grep -E "(STRIPE|OPENAI|TWILIO|ULTRAMSG|DATABASE)" | cut -d= -f1
```

---

## Troubleshooting

### Secret Not Found Error
- Check the secret name matches exactly (case-sensitive)
- Make sure you added it in Replit Secrets (not .env file)
- Restart your application after adding new secrets

### Database Connection Error
- Database secrets are auto-created by Replit
- Check the Database tool in left sidebar
- Verify connection is active

### Payment Not Working
- Verify both `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY` are set
- Check you're using the correct keys (test vs live)
- Stripe test cards: `4242 4242 4242 4242`

---

## Need Help?

- Check `.env.example` for the complete list
- All your secrets are already configured! ✅
- Contact the service provider if you need to regenerate keys
