# Deployment Guide

Production deployment instructions for Vercel, Netlify, Firebase, and AWS.

## Recommended: Vercel (Easiest)

Vercel is optimized for Next.js but works great with Vite + Express.

### Step 1: Prepare for Deployment

```bash
# Build frontend
npm run build

# Test production build locally
npm run preview
```

### Step 2: Create Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Salon Automation Hub"
```

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/salon-automation-hub.git
git push -u origin main
```

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Select **Import Git Repository**
4. Find and select your GitHub repo
5. Click **Import**

### Step 5: Configure Environment

1. In project settings, go to **Environment Variables**
2. Add all variables from `.env`:
   - `ANTHROPIC_API_KEY`
   - `SQUARE_ACCESS_TOKEN`
   - `SQUARE_LOCATION_ID`
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `SALON_NAME`
   - etc.

3. For backend URL, set:
   ```
   VITE_API_URL=https://your-api.vercel.app
   ```

### Step 6: Deploy Backend

You have two options:

**Option A: Use Vercel Serverless Functions**
```bash
# Create api/ directory for serverless functions
mkdir -p api
# Move backend routes there
```

**Option B: Deploy Backend Separately (Recommended)**

Deploy backend to a separate service (Heroku, Railway, etc.)

1. Modify `backend/server.js` to work with your chosen host
2. Set `VITE_API_URL` to your backend's public URL

**Option C: Deploy to Vercel with Node.js**

Update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "src",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.html",
      "status": 200
    }
  ]
}
```

### Live!

Your app is now live at `https://salon-automation-hub.vercel.app`

---

## Alternative: Netlify

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub
4. Select your repository

### Step 2: Configure Build

```
Build command: npm run build
Publish directory: dist
```

### Step 3: Add Environment Variables

1. **Site settings** → **Build & Deploy** → **Environment**
2. Add all from `.env.example`

### Step 4: Deploy Backend

Use **Netlify Functions** for backend:

```bash
mkdir -p netlify/functions
# Move backend routes there
```

Or deploy backend elsewhere (see Vercel Option B)

---

## Advanced: AWS with Amplify

### Step 1: Install AWS CLI

```bash
brew install awscli  # macOS
# or download from aws.amazon.com/cli
```

### Step 2: Configure AWS

```bash
aws configure
# Enter Access Key ID and Secret Access Key
```

### Step 3: Deploy with Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify init

# Follow prompts
amplify publish
```

---

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] API keys for production (not dev/sandbox)
- [ ] CORS configured for production domain
- [ ] SSL certificate enabled
- [ ] Rate limiting configured
- [ ] Error logging set up
- [ ] Analytics enabled
- [ ] Backups configured
- [ ] Health monitoring active
- [ ] Database backups (if using)

---

## Monitoring & Maintenance

### Set Up Logging

```bash
# Vercel: Logs visible in dashboard
# Netlify: Site analytics in dashboard
# AWS: CloudWatch logs
```

### Health Checks

```bash
# Your monitoring service should periodically check:
curl https://your-domain.com/api/health
```

### Update Dependencies

```bash
npm update              # Minor updates
npm outdated            # Check for updates
npm audit               # Security audit
npm audit fix           # Fix vulnerabilities
```

---

## Scaling

As traffic grows:

1. **Database**: Add MongoDB/PostgreSQL
2. **Caching**: Implement Redis
3. **CDN**: Serve static files from CDN
4. **Load Balancing**: Use load balancer for backend
5. **Queue**: Implement job queue for long tasks

---

## Troubleshooting

### Build Fails

```bash
# Check build output
npm run build

# Verify no errors
npm run test
```

### Environment Variables Not Available

- Double-check variable names match `.env.example`
- Restart deploy after changing variables
- Check console for missing keys

### CORS Errors in Production

Update `backend/server.js`:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

### 503 Service Unavailable

- Check backend is running
- Verify API URL is correct
- Check rate limits haven't been exceeded

---

## Cost Estimates

| Platform | Free Tier | Pro Tier |
|----------|-----------|----------|
| **Vercel** | 100GB bandwidth | $20/mo |
| **Netlify** | 300 build min/mo | $19/mo |
| **AWS** | 1M requests/mo | $0.20+ per M requests |
| **Heroku** | (Discontinued free) | $7/mo dyno |

---

## Next Steps

1. ✅ Deploy to Vercel
2. 📊 Set up monitoring
3. 📈 Track analytics
4. 🔄 Set up CI/CD for auto-deploy on push
5. 🛡️ Enable HTTPS (automatic on Vercel/Netlify)

---

## Documentation Links

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [AWS Amplify Docs](https://docs.amplify.aws/)

## Support

🆘 Deployment issues?
- Check service-specific docs
- [Open GitHub issue](https://github.com/yourusername/salon-automation-hub/issues)
- Join [community discussions](https://github.com/yourusername/salon-automation-hub/discussions)
