# 🚀 Automated Deployment Setup Guide

## Phase 1: Local Development with MongoDB Compass (COMPLETE)

### MongoDB Compass Setup
1. **Download & Install** MongoDB Compass from https://www.mongodb.com/products/compass
2. **Connect Local MongoDB**
   - Connection String: `mongodb://localhost:27017`
   - Compass will automatically connect to local MongoDB instance
3. **View Database**
   - Database name: `ecommerce`
   - Collections: `users`, `products`, `orders`

### Backend .env Configuration (DONE ✅)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
RAZORPAY_KEY_ID=rzp_test_KAfDMk4rQAZb4K
RAZORPAY_KEY_SECRET=FMvHy6IfG72YrzVm3G8oRXNJ
JWT_SECRET=supersecret123
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Running Locally
```bash
# Backend (Terminal 1)
cd backend
npm start
# Runs on http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Phase 2: Production Deployment (AUTOMATED)

### Backend Deployment - Railway 🚆

**Prerequisites:**
1. Visit https://railway.app
2. Sign up / Login (with GitHub recommended)
3. Create new project

**Auto-Deployment Steps:**
1. Create new Railway project
2. Click "Deploy from GitHub"
3. Select repository: `nicksanrajnu2025aiml-hub/proshop`
4. Select branch: `main`
5. Choose source root: `/backend`
6. Railway will auto-detect Node.js and use `npm start`

**Environment Variables (Add in Railway):**
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
RAZORPAY_KEY_ID=rzp_test_KAfDMk4rQAZb4K
RAZORPAY_KEY_SECRET=FMvHy6IfG72YrzVm3G8oRXNJ
JWT_SECRET=your_very_secure_jwt_secret_key_change_this
FRONTEND_URL=https://your-frontend.vercel.app
```

**Get MongoDB Atlas Connection String:**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Copy connection string (replace username:password)
4. Use in `MONGO_URI` above

**Railway Backend URL:**
- Format: `https://proshop-production.railway.app` (auto-generated)
- Use this for frontend `VITE_API_URL`

---

### Frontend Deployment - Vercel ✅

**Status:** Configuration already pushed ✅
- GitHub integration: ACTIVE
- Vercel config: `frontend/vercel.json` ✅
- Auto-redeploy on push: ENABLED ✅

**Environment Variables (Vercel Dashboard):**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   ```
   VITE_API_URL=https://proshop-production.railway.app
   ```

**Frontend URL:**
- Format: `https://proshop-app.vercel.app` (auto-generated)
- Auto-deploys when you push to main branch

---

## Phase 3: Complete Automation Flow ⚡

### Push & Deploy (One Command!)
```bash
# Make changes to code
# Add, commit, and push
git add .
git commit -m "Feature: Your feature description"
git push origin main

# Automatic automation:
# 1. GitHub receives push
# 2. Vercel auto-deploys frontend (3-5 min)
# 3. Railway auto-redeploys backend (1-2 min)
# 4. Both live in production!
```

### Deployment Checklist
- [ ] Backend MongoDB Atlas connection string in Railway
- [ ] Backend Razorpay keys in Railway env
- [ ] Backend JWT secret in Railway env
- [ ] Frontend VITE_API_URL pointing to Railway URL
- [ ] Both GitHub → Vercel and GitHub → Railway connected
- [ ] Code pushed to main branch
- [ ] Vercel shows "Ready"
- [ ] Railway shows "Running"

---

## Phase 4: Testing Production URLs

### Testing Backend API
```bash
# Backend health check
curl https://proshop-production.railway.app/api/health

# Get products
curl https://proshop-production.railway.app/api/products
```

### Testing Frontend
- Visit: `https://proshop-app.vercel.app`
- Login, add products to cart, proceed to checkout
- Payment should hit Railway backend via VITE_API_URL

---

## Troubleshooting

### Railway Deployment Issues
- Check Railway logs: Project → Logs tab
- Verify all env vars set (no missing MONGO_URI, RAZORPAY keys)
- Restart deployment if needed: Redeploy button

### Vercel Deployment Issues
- Check Vercel logs: Deployments tab
- Verify VITE_API_URL env var is set
- Frontend should see backend URL in network requests

### API Connection Issues
- Frontend VITE_API_URL must match Railway backend URL
- Check browser console for API errors
- Use Chrome DevTools → Network tab to see actual requests

---

## Quick Reference

| Service | URL | Environment |
|---------|-----|-------------|
| Backend (Local) | `http://localhost:5000` | Development |
| Frontend (Local) | `http://localhost:5173` | Development |
| Backend (Production) | `https://proshop-production.railway.app` | Production |
| Frontend (Production) | `https://proshop-app.vercel.app` | Production |

