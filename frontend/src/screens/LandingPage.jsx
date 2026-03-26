import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const { userInfo = null } = auth;

  // Redirect based on user role
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    }
  }, [userInfo, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ProShop
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Welcome to your e-commerce platform</p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12"
        >
          {/* Customer Card */}
          <motion.div variants={itemVariants}>
            <Link to="/shop">
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 cursor-pointer overflow-hidden border border-slate-600 hover:border-blue-500 transition-all h-full">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />

                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    Customer
                  </h2>

                  <p className="text-gray-300 mb-6">
                    Browse products, add to cart, checkout with Razorpay payments, and track your orders.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Browse Products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>Order Tracking</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2">
                    Shop Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Admin Card */}
          <motion.div variants={itemVariants}>
            <Link to="/admin">
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 cursor-pointer overflow-hidden border border-slate-600 hover:border-purple-500 transition-all h-full">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />

                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    Admin
                  </h2>

                  <p className="text-gray-300 mb-6">
                    Manage products, users, returns, and view analytics from your admin dashboard.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span>Manage Products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span>User Management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span>Return Requests</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2">
                    Admin Panel
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-6 text-center text-sm"
        >
          <Link to="/login" className="text-gray-400 hover:text-blue-400 transition-colors">
            Sign In
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/register" className="text-gray-400 hover:text-blue-400 transition-colors">
            Create Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
