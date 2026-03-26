# MongoDB Atlas Setup (FREE) + Local MongoDB Compass

## 🎯 Architecture

```
Local Development:
├─ Frontend: http://localhost:5173
├─ Backend: localhost:5000
└─ MongoDB: localhost (MongoDB Compass) ✅

Production Deployment:
├─ Frontend: https://proshop-app.vercel.app (Vercel)
├─ Backend: https://proshop-prod.railway.app (Railway)
└─ MongoDB: MongoDB Atlas Cloud ☁️ (FREE)
```

---

## Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Visit:** https://www.mongodb.com/cloud/atlas
2. **Sign Up** (or login if you have account)
   - Use Google/GitHub for faster signup
3. **Skip tutorial/welcome** prompts

---

## Step 2: Create Free Cluster

1. **Create Deployment**
   - Click "Create" or "Build a Cluster"
2. **Choose FREE Tier** (M0 Sandbox)
3. **Select Provider & Region**
   - Provider: AWS
   - Region: Pick closest to you (e.g., `ap-south-1` for India)
4. **Click "Create Cluster"**
   - Takes 2-3 minutes to initialize

---

## Step 3: Get Connection String

1. **Go to Clusters** → Click your cluster name
2. **Click "Connect"** button
3. **Choose "Drivers"** option
4. **Select "Node.js"** 
5. **Copy Connection String** - looks like:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 4: Create Database User

**In MongoDB Atlas Dashboard:**

1. **Click "Database Access"** (left sidebar)
2. **Click "Add New Database User"**
3. **Enter:**
   - Username: `proshop`
   - Password: `generate secure password` (copy it!)
4. **Click "Add User"**

---

## Step 5: Whitelist IP Address

**In MongoDB Atlas Dashboard:**

1. **Click "Network Access"** (left sidebar)
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere"**
   - CIDR: `0.0.0.0/0` (allows Railway to connect)
4. **Click "Confirm"**

---

## Step 6: Update Connection String

Replace in the connection string you copied:
- `<username>` → `proshop`
- `<password>` → your secure password
- Add `/ecommerce?` at end for database name

**Final format:**
```
mongodb+srv://proshop:YourSecurePassword@cluster0.abc123.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## Step 7: Update Railway Environment Variables

**In Railway Dashboard:**

1. **Go to your Backend Project**
2. **Click "Variables"** tab
3. **Add/Update these:**

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://proshop:YourSecurePassword@cluster0.abc123.mongodb.net/ecommerce?retryWrites=true&w=majority` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `RAZORPAY_KEY_ID` | `rzp_test_KAfDMk4rQAZb4K` |
| `RAZORPAY_KEY_SECRET` | `FMvHy6IfG72YrzVm3G8oRXNJ` |
| `JWT_SECRET` | `your_secure_jwt_secret_key_here` |
| `FRONTEND_URL` | `https://proshop-app.vercel.app` |

4. **Click "Save" or "Deploy"**

---

## Step 8: Local Development (Still Uses Compass)

**Your backend `.env` stays the same:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
RAZORPAY_KEY_ID=rzp_test_KAfDMk4rQAZb4K
RAZORPAY_KEY_SECRET=FMvHy6IfG72YrzVm3G8oRXNJ
JWT_SECRET=supersecret123
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Run locally:**
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: MongoDB Compass
# Open MongoDB Compass → mongodb://localhost:27017
```

---

## ✅ Complete Setup

| Environment | MongoDB | Backend | Frontend |
|-------------|---------|---------|----------|
| **Local Dev** | MongoDB Compass (laptop) | `http://localhost:5000` | `http://localhost:5173` |
| **Production** | MongoDB Atlas (Cloud) ☁️ | Railway | Vercel |

---

## 🚀 What Happens When You Push to GitHub

1. **You push code** → `git push origin main`
2. **Vercel detects push** → Auto-rebuilds frontend
3. **Railway detects push** → Auto-rebuilds backend with MongoDB Atlas
4. **Both live in 2-3 minutes!**

---

## Troubleshooting

**"Cannot connect to MongoDB Atlas"**
- Check username/password in connection string
- Ensure IP whitelist includes `0.0.0.0/0`
- Check `MONGO_URI` env var has no typos

**"Connection refused locally"**
- Start MongoDB locally: `mongod`
- Verify MongoDB Compass can connect
- Check backend `.env` has `mongodb://localhost:27017`

---

## Summary

✅ Local development: MongoDB Compass (on your laptop)
✅ Production: MongoDB Atlas (cloud free, accessible from Railway)
✅ Both environments with same code!

Need help with any step? Let me know!
