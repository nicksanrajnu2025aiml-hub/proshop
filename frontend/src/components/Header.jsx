import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { ShoppingCart, Search, MapPin, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Header = () => {
  const cart = useSelector((state) => state.cart || {});
  const { cartItems = [] } = cart;
  const auth = useSelector((state) => state.auth || {});
  const { userInfo = null } = auth;

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword.trim()}`);
      setSearchKeyword('');
    } else {
      navigate('/');
    }
  };

  const cartCount = Array.isArray(cartItems) 
    ? cartItems.reduce((acc, item) => acc + (item.qty || 0), 0) 
    : 0;

  const userName = (userInfo && userInfo.name) 
    ? userInfo.name.split(' ')[0] 
    : 'sign in';

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Header */}
      <div className="bg-brand-dark text-white py-2 px-4 flex items-center justify-between gap-4">
        {/* Logo & Delivery */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 border border-transparent hover:border-white p-1 rounded transition-all">
             <span className="text-2xl font-black tracking-tight italic">PROSHOP</span>
             <span className="text-brand-primary text-sm font-medium mt-1">.in</span>
          </Link>

          <div className="hidden xl:flex flex-col border border-transparent hover:border-white p-1 rounded cursor-pointer leading-tight transition-all">
            <span className="text-[#cccccc] text-xs ml-4 font-medium">Deliver to</span>
            <div className="flex items-center gap-1">
              <MapPin size={16} strokeWidth={2.5} />
              <span className="text-sm font-bold">Select your address</span>
            </div>
          </div>
        </div>

        {/* Search Bar - Center */}
        <form onSubmit={searchHandler} className="flex-1 max-w-3xl hidden md:flex">
          <div className="flex w-full group overflow-hidden rounded-md focus-within:ring-2 focus-within:ring-brand-primary transition-shadow">
            <button type="button" className="bg-gray-100 text-gray-700 px-3 flex items-center gap-1 text-xs font-medium border-r border-gray-200 hover:bg-gray-200 transition-colors">
              All <ChevronDown size={14} />
            </button>
            <input 
              type="text" 
              placeholder="Search ProShop.in" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-1 py-1.5 px-3 text-black outline-none placeholder:text-gray-500 font-medium"
            />
            <button type="submit" className="bg-brand-primary text-brand-dark p-2 hover:bg-brand-accent transition-colors">
              <Search size={22} strokeWidth={3} />
            </button>
          </div>
        </form>

        {/* User Actions - Right */}
        <div className="flex items-center gap-1">
          {/* Account Dropdown */}
          <div 
             className="relative border border-transparent hover:border-white py-1 px-2 rounded cursor-pointer transition-all leading-tight"
             onMouseEnter={() => setIsAccountOpen(true)}
             onMouseLeave={() => setIsAccountOpen(false)}
          >
            <span className="text-xs font-medium">Hello, {userName}</span>
            <div className="flex items-center">
              <span className="text-sm font-bold">Account & Lists</span>
              <ChevronDown size={14} className="mt-0.5 text-[#cccccc]" />
            </div>

            <AnimatePresence>
              {isAccountOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-1 w-60 bg-white text-brand-dark rounded shadow-2xl z-50 border border-gray-100 p-4"
                >
                   <div className="text-center pb-3 border-b border-gray-100">
                      {userInfo ? (
                        <button 
                          onClick={logoutHandler}
                          className="w-full bg-brand-primary text-brand-dark py-2 text-sm rounded-lg shadow-sm hover:shadow-md transition font-bold"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <Link 
                          to="/login"
                          className="block bg-indigo-600 py-2 text-white text-sm rounded-lg shadow-sm hover:bg-indigo-700 transition font-bold"
                        >
                          Sign In Now
                        </Link>
                      )}
                      {!userInfo && (
                        <div className="text-[10px] mt-2">
                           New customer? <Link to="/register" className="text-blue-600 hover:underline">Start here.</Link>
                        </div>
                      )}
                   </div>
                   <div className="pt-3 grid grid-cols-1 gap-2">
                      <h3 className="text-sm font-bold px-2 text-gray-800 uppercase tracking-wider">Your Account</h3>
                      <Link to="/profile" className="block px-2 py-1.5 text-xs text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">Your Profile</Link>
                      <Link to="/profile" className="block px-2 py-1.5 text-xs text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">Your Orders</Link>
                      
                      {userInfo?.isAdmin ? (
                        <>
                          <div className="pt-2 border-t mt-1"></div>
                          <h3 className="text-sm font-bold px-2 text-indigo-500 uppercase tracking-wider">Admin Control</h3>
                          <Link to="/admin" className="block px-2 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition font-bold">📊 Admin Dashboard</Link>
                          <Link to="/admin/productlist" className="block px-2 py-1.5 text-xs hover:text-indigo-600 hover:bg-indigo-50 rounded transition">Manage Inventory</Link>
                          <Link to="/admin/userlist" className="block px-2 py-1.5 text-xs hover:text-indigo-600 hover:bg-indigo-50 rounded transition">Manage Customers</Link>
                          <Link to="/admin/returns" className="block px-2 py-1.5 text-xs hover:text-indigo-600 hover:bg-indigo-50 rounded transition">Return Center</Link>
                        </>
                      ) : null}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Orders */}
          <Link to="/profile" className="hidden lg:flex flex-col border border-transparent hover:border-white py-1 px-2 rounded leading-tight transition-all">
            <span className="text-xs font-medium">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end border border-transparent hover:border-white py-1 px-2 rounded font-bold transition-all gap-1">
            <div className="relative">
              <ShoppingCart size={34} strokeWidth={1.5} />
              <span className="absolute -top-1 left-4 bg-brand-accent text-brand-dark text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-dark font-black">
                {cartCount}
              </span>
            </div>
            <span className="mb-0.5 text-sm font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub-Header / Nav */}
      <div className="bg-brand-light text-white text-sm py-1 px-4 flex items-center gap-1 overflow-hidden">
          <button className="flex items-center gap-1 border border-transparent hover:border-white py-1 px-2 rounded transition font-bold mr-2">
             <Menu size={20} /> All
          </button>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {['Fresh', 'Mobiles', 'Electronics', 'VIP', 'Home', 'Kitchen', 'Fashion', 'Health'].map(item => (
              <button 
                key={item} 
                onClick={() => navigate(`/search/${item}`)}
                className="border border-transparent hover:border-white py-1 px-2 rounded transition-all font-medium bg-transparent text-white"
              >
                 {item}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden xl:block font-bold border border-transparent hover:border-white py-1 px-2 rounded cursor-pointer leading-tight">
             Join VIP Today
          </div>
      </div>
    </header>
  );
};
export default Header;
