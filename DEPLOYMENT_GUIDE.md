# Layeroi v2.0 — Deployment Guide

## ⚠️ CRITICAL: Environment Variables

Before deploying to Railway, you MUST generate a JWT_SECRET:

```bash
node -e 'console.log("JWT_SECRET=" + require("crypto").randomBytes(64).toString("hex"))'
```

Copy the output and add to Railway variables.

## BACKEND DEPLOYMENT (Railway)

### Step 1: Push to GitHub

```bash
cd backend
git remote add origin https://github.com/YOUR_USERNAME/layeroi-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to https://railway.app
2. Create new project
3. Select "GitHub Repo" → authenticate → select this repo
4. Railway auto-detects Node.js

### Step 3: Set Environment Variables in Railway

Add these variables in Railway dashboard under "Variables":

**REQUIRED:**
- `SUPABASE_URL` - Copy from .env.railway
- `SUPABASE_KEY` - Copy from .env.railway
- `OPENAI_API_KEY` - Your OpenAI key
- `ANTHROPIC_API_KEY` - Your Anthropic key
- `GOOGLE_API_KEY` - Your Google key
- `AZURE_API_KEY` - Your Azure key (if using)
- `AZURE_ENDPOINT` - Your Azure endpoint (if using)
- `JWT_SECRET` - GENERATE: `node -e 'console.log(require("crypto").randomBytes(64).toString("hex"))'`
- `GOOGLE_OAUTH_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_OAUTH_CLIENT_SECRET` - From Google Cloud Console
- `NODE_ENV` - `production`
- `PORT` - `5000`
- `API_BASE_URL` - `https://api.layeroi.com` (replace with actual domain)

**OPTIONAL:**
- `RESEND_API_KEY` - For email notifications
- `DATADOG_API_KEY` - For monitoring
- `VALID_API_KEYS` - Comma-separated test keys

### Step 4: Deploy

Railway auto-deploys on git push. Watch deployment in dashboard.

### Step 5: Verify Health Check

```bash
curl https://api.layeroi.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-14T10:00:00.000Z",
  "version": "2.0.0"
}
```

---

## FRONTEND DEPLOYMENT (Vercel)

### Step 1: Build Frontend

```bash
cd ../frontend
npm install
npm run build
```

**Must show: "✓ Build successful" with zero errors**

### Step 2: Create vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "@api_url"
  }
}
```

### Step 3: Connect to Vercel

1. Go to https://vercel.com
2. Import Git project
3. Select frontend directory
4. Add environment variable: `REACT_APP_API_URL=https://api.layeroi.com`
5. Deploy

### Step 4: Verify Pages Load

```bash
curl https://layeroi.com
curl https://layeroi.com/signup
curl https://layeroi.com/dashboard
curl https://layeroi.com/docs
```

---

## ENDPOINT VERIFICATION

### Health Check (No Auth)

```bash
curl https://api.layeroi.com/health
```

### Create User

```bash
curl -X POST https://api.layeroi.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@layeroi.com",
    "company": "Test Company"
  }'
```

**Response:** `{"success": true, "token": "JWT_TOKEN", "apiKey": "sk-..."}`

### Use API Key

```bash
API_KEY=$(curl -s -X POST https://api.layeroi.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@test.com","company":"Test"}' | jq -r '.apiKey')

curl -H "X-API-Key: $API_KEY" https://api.layeroi.com/v2/agents
```

### Test Automations

```bash
# SEO automation
curl -X POST https://api.layeroi.com/automations/seo

# Email automation
curl -X POST https://api.layeroi.com/automations/email

# Free tier checks
curl -X POST https://api.layeroi.com/automations/free-tier

# Intent detection
curl -X POST https://api.layeroi.com/automations/intent
```

---

## MONITORING

### Datadog Dashboard

If you configured Datadog, view metrics at:
- https://app.datadoghq.com/dashboard
- Filter by service: `layeroi-api`
- Check: Request count, latency, errors

### Railroad Logs

View in Railway dashboard:
- Deployment logs
- Runtime logs
- Error logs

```bash
railway logs
```

---

## TROUBLESHOOTING

| Error | Solution |
|-------|----------|
| `SUPABASE_URL not set` | Add to Railway variables |
| `Cannot find module 'openai'` | Run `npm install` in backend |
| `401 Unauthorized` | Check JWT_SECRET is set correctly |
| `CORS error` | Verify `API_BASE_URL` matches request origin |
| `Database connection failed` | Verify Supabase credentials |

---

## PRODUCTION CHECKLIST

- [ ] All environment variables set in Railway
- [ ] Database health check passes
- [ ] All 6 test endpoints return correct responses
- [ ] Frontend builds with zero errors
- [ ] Frontend pages load correctly
- [ ] Datadog metrics showing traffic
- [ ] Error rate < 1%
- [ ] Average response time < 500ms
- [ ] SSL certificate valid
- [ ] CORS working for all origins
- [ ] Authentication flows tested
- [ ] API key management working
- [ ] Webhooks can be registered
- [ ] Cost tracking functional
- [ ] Insights generation working
