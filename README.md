# ProShop E-Commerce

Full-stack MERN e-commerce platform with advanced features.

## ✨ Features

### Customer Features
- 🛍️ Browse products with search & filters
- ⭐ View ratings & reviews
- 🛒 Shopping cart management
- 👤 User authentication & profiles
- 📦 Order tracking & management
- 🔄 Product returns (10-day window)
- 💳 Razorpay payment integration (UPI, Cards, Net Banking)

### Admin Features
- 📊 Inventory management
- 👥 Customer management
- 📋 Return request handling
- ✅ Order fulfillment

### Technical Highlights
- ✅ Full form validation (client & server)
- 🔐 JWT authentication
- 📱 Responsive Tailwind CSS design
- 🎬 Smooth animations (Framer Motion)
- 📊 Redux state management
- 🔗 RTK Query for API calls

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay test account (optional)

### Local Setup

**Backend:**
```bash
cd backend
npm install
# Add to .env:
# MONGODB_URI=mongodb://localhost:27017/proshop
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

---

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

**Quick Deploy:**
1. Push to GitHub
2. Deploy frontend to [Vercel](https://vercel.com)
3. Deploy backend to [Railway](https://railway.app)
4. Add environment variables
5. Update API URLs

---

## 📁 Project Structure

```
/backend
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── config/
  └── server.js

/frontend
  ├── src/
  │   ├── components/
  │   ├── screens/
  │   ├── slices/
  │   ├── utils/
  │   └── App.jsx
  ├── vite.config.js
  └── package.json
```

---

## 🔑 Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=
FRONTEND_URL=
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testing

- **Test Payment:** Use Razorpay test card: `4111 1111 1111 1111` (Exp: any future date, CVV: any 3 digits)
- **Test User:** Register new account or use admin account

---

## 📚 Tech Stack

- **Frontend:** React 19 + Vite + Redux + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB + JWT
- **Payments:** Razorpay
- **Deployment:** Vercel + Railway

---

## 📝 License

MIT License - feel free to use this project!

---

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step setup.
