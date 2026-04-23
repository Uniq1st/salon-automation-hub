# API Keys & Credentials Setup

This guide walks through obtaining and configuring all required API credentials.

## Required Services

1. **Anthropic** (Claude AI)
2. **Square** (Payment & SMS)
3. **Gmail** (Email)

## 1. Anthropic API Key (Claude AI)

### Get Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key**
5. Name it (e.g., "Salon Hub")
6. Copy the key

### Add to `.env`

```bash
ANTHROPIC_API_KEY=sk-ant-... (paste your key)
```

### Test It

```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-sonnet-4-20250514", "max_tokens": 100, "messages": [{"role": "user", "content": "Hello"}]}'
```

---

## 2. Square Credentials

### OAuth Setup for SMS

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select your application
3. Navigate to **Credentials**
4. Copy:
   - **Access Token** (Personal Access Token or OAuth token)
   - **Location ID** (from Locations section)

### Get Location ID

1. In Square Dashboard, go to **Settings** → **Locations**
2. Find your salon location
3. Copy the Location ID (visible in the URL or details)

### Add to `.env`

```bash
SQUARE_ACCESS_TOKEN=sq_... (your token)
SQUARE_LOCATION_ID=LJDRXPJBMD5Y2
SQUARE_API_URL=https://connect.squareupsandbox.com  # Sandbox for testing
```

### Test It

```bash
curl -X GET https://connect.squareupsandbox.com/v2/customers \
  -H "Authorization: Bearer $SQUARE_ACCESS_TOKEN"
```

---

## 3. Gmail OAuth2 Setup

### Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **Salon Automation Hub**
3. Enable **Gmail API**:
   - Search "Gmail API"
   - Click **Enable**
4. Create OAuth 2.0 credentials:
   - **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     http://localhost:3001/api/auth/gmail/callback
     https://yourdomain.com/api/auth/gmail/callback  # Production URL
     ```
   - Copy **Client ID** and **Client Secret**

### Add to `.env`

```bash
GMAIL_CLIENT_ID=xxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REDIRECT_URL=http://localhost:3001/api/auth/gmail/callback
```

### Test OAuth Flow

```bash
# This will open a browser window for Gmail login
node scripts/test-gmail-auth.js
```

---

## 4. Salon Information

Add your salon details to `.env`:

```bash
SALON_NAME=Brows and Lashes
SALON_EMAIL=browsandlashesbyuniqswek@gmail.com
SALON_PHONE=+1 917-388-2434
SALON_ADDRESS=1240 Lexington Ave, New York, NY 10028
BOOKING_URL=https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services
```

---

## 5. Environment Variables Checklist

Run this to verify all keys are set:

```bash
npm run check:env
```

Or manually verify `.env` has:

```
✓ ANTHROPIC_API_KEY
✓ SQUARE_ACCESS_TOKEN
✓ SQUARE_LOCATION_ID
✓ GMAIL_CLIENT_ID
✓ GMAIL_CLIENT_SECRET
✓ GMAIL_REDIRECT_URL
✓ SALON_NAME
✓ SALON_EMAIL
✓ SALON_PHONE
✓ SALON_ADDRESS
✓ BOOKING_URL
✓ PORT (default: 3001)
✓ CORS_ORIGIN (default: http://localhost:5173)
```

---

## Security Best Practices

🔒 **NEVER** commit `.env` to Git

✓ `.env` is already in `.gitignore`

✓ Use `.env.example` template instead

✓ For production, use environment variable services:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site settings → Build & Deploy → Environment
- **Heroku**: Config Vars

### Rotate Keys Regularly

- Change Anthropic keys monthly
- Rotate Square tokens quarterly
- Review Gmail permissions yearly

---

## Testing Credentials

### Quick API Tests

```bash
# Anthropic
npm run test:anthropic

# Square
npm run test:square

# Gmail
npm run test:gmail
```

### Full Integration Test

```bash
npm run test:integration
```

---

## Troubleshooting

### Invalid API Key Error

```
Error: 401 Unauthorized
```

- Double-check key in `.env`
- Verify key hasn't expired in console
- Generate new key if needed

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

- Ensure `CORS_ORIGIN` matches your frontend URL
- For local dev: `http://localhost:5173`
- For production: your actual domain

### Rate Limits

- **Anthropic**: 60 requests/minute (free tier)
- **Square**: 1000 requests/hour
- **Gmail**: 1 million requests/day

If hitting limits, implement request queuing (see [ARCHITECTURE.md](ARCHITECTURE.md))

---

## Next Steps

1. [Run locally](SETUP.md) with credentials
2. [Run tests](../package.json) to verify
3. [Deploy](DEPLOYMENT.md) to production

## Support

🆘 Having issues? 
- Check [README.md](../README.md#troubleshooting)
- [Open an issue](https://github.com/yourusername/salon-automation-hub/issues)
