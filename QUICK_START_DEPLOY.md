# 🚀 Quick Start: Deploy to Vercel (5 minutes)

## You're 5 minutes away from production!

### Step 1: Open Vercel
Go to → https://vercel.com/new

### Step 2: Import from GitHub
1. Click "Import Git Repository"
2. Type in search: `Layeroi`
3. Click on: `hridhaygarg/Layeroi`
4. Click "Import"

### Step 3: Configure
Set these values:
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Framework Preset:** React

Click "Deploy"

### Step 4: Wait (~2-3 minutes)
Watch the build progress. You'll see:
```
✓ Build successful
✓ Vercel assigned your site a production domain
```

### Step 5: Visit Your Site
Click the deployment link or visit:
```
https://your-project.vercel.app
```

**That's it! You're live! 🎉**

---

## Verify It Works

1. **Page Loads:** Should see the React app
2. **No Errors:** Open browser DevTools (F12), check Console for errors
3. **Fast:** Should load in under 3 seconds
4. **Responsive:** Resize browser, check mobile view

---

## If You Get Stuck

Check detailed guide: `VERCEL_DEPLOYMENT_GUIDE.md`

Or use the deployment script:
```bash
chmod +x DEPLOY_FRONTEND.sh
./DEPLOY_FRONTEND.sh
```

---

## After Deployment

### Optional: Custom Domain
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add: `app.layeroi.com` (or your domain)
4. Follow DNS instructions

### Optional: Environment Variables
If backend API URL needs to be set:
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `REACT_APP_API_URL=https://api.layeroi.com`
3. Redeploy

---

## Key Info

- **Repository:** https://github.com/hridhaygarg/Layeroi
- **Live App:** https://layeroi.vercel.app
- **Dashboard:** https://vercel.com/dashboard
- **Status:** ✅ Production Ready

---

**Start deployment → Click link above → Follow 5 steps → Live in 5 minutes**
