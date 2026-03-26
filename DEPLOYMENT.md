# ProShop E-Commerce Deployment Guide

## 📦 Deployment Setup

This project is ready to deploy to **Vercel** (Frontend) and **Railway** (Backend).

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/proshop.git
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repo
4. Select `/frontend` as root directory
5. Set environment variables:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```
6. Click **Deploy**

**Your frontend URL:** `https://your-app.vercel.app`

---

## 🛠️ Backend Deployment (Railway)

### Step 1: Connect GitHub to Railway
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your repo
4. Select `/backend` as root directory

### Step 2: Configure Environment Variables
In Railway dashboard, add:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/proshop
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your_super_secret_jwt_key
```

### Step 3: Deploy
- Railway auto-deploys on push
- Your backend URL: `https://your-railway-app.railway.app`

---

## 📋 Required Services

### MongoDB Atlas (Free Tier)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string → Add to Railway env as `MONGODB_URI`

### Razorpay (Testing)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy test Key ID and Key Secret → Add to Railway env

---

## 🔗 Update Frontend API Endpoint

In `/frontend/src/slices/constants.js`, update:
```javascript
export const BASE_URL = 'https://your-railway-backend.railway.app';
```

---

## ✅ Final Checklist

- [ ] GitHub repo created and pushed
- [ ] Vercel deployment linked
- [ ] Railway deployment configured
- [ ] Environment variables set
- [ ] MongoDB Atlas cluster created
- [ ] Razorpay test keys added
- [ ] Frontend API URL updated
- [ ] Test payment flow

---

## 🎉 You're Live!

Your website is now accessible at: **https://your-app.vercel.app**

Enjoy! 🚀
