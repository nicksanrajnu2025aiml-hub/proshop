import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, RotateCcw, BarChart3, Settings, Home } from 'lucide-react';

const AdminDashboard = () => {
  const adminOptions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, or delete products from inventory',
      icon: Package,
      link: '/admin/productlist',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Manage Users',
      description: 'View and manage all registered users',
      icon: Users,
      link: '/admin/userlist',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Manage Returns',
      description: 'Handle product return requests and approvals',
      icon: RotateCcw,
      link: '/admin/returns',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Analytics',
      description: 'View sales reports and business metrics',
      icon: BarChart3,
      link: '#',
      color: 'from-green-500 to-emerald-500',
      disabled: true,
    },
    {
      title: 'Settings',
      description: 'Configure system and store settings',
      icon: Settings,
      link: '#',
      color: 'from-slate-500 to-gray-500',
      disabled: true,
    },
    {
      title: 'Back to Shop',
      description: 'Return to customer shopping experience',
      icon: Home,
      link: '/',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Manage your e-commerce store operation
          </p>
        </motion.div>

        {/* Admin Options Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            const isDisabled = option.disabled;

            return (
              <motion.div
                key={option.title}
                variants={itemVariants}
                whileHover={!isDisabled ? { scale: 1.05, y: -5 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                {isDisabled ? (
                  <div className={`bg-gradient-to-br ${option.color} opacity-50 rounded-xl p-8 cursor-not-allowed`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-white bg-opacity-20 rounded-full p-4 mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {option.title}
                      </h3>
                      <p className="text-white text-sm opacity-90 mb-4">
                        {option.description}
                      </p>
                      <span className="text-xs text-white bg-white bg-opacity-30 px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link to={option.link}>
                    <div className={`bg-gradient-to-br ${option.color} rounded-xl p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow`}>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white bg-opacity-20 rounded-full p-4 mb-4">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {option.title}
                        </h3>
                        <p className="text-white text-sm opacity-90">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Users', value: '1.2K' },
            { label: 'Active Products', value: '340' },
            { label: 'Pending Returns', value: '8' },
            { label: 'Monthly Revenue', value: '$12.5K' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-700 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
