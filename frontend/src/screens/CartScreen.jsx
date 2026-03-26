import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { Trash2, ShoppingBasket, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tighter uppercase flex items-center gap-3">
           <ShoppingBasket size={32} strokeWidth={2.5} /> Shopping Basket
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-9 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Products</span>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">Price</span>
            </div>

            {cartItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBasket className="text-gray-200" size={40} />
                </div>
                <h2 className="text-2xl font-black text-brand-dark mb-2">Your Basket is Empty</h2>
                <p className="text-gray-500 font-medium mb-8">Items stay in your basket for 90 days. Get them before they fly!</p>
                <Link to="/" className="bg-brand-primary text-brand-dark px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-accent transition flex items-center gap-2">
                   Shop Today's Deals <ArrowRight size={18} />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <Link to={`/product/${item._id}`} className="shrink-0 w-24 h-24 bg-gray-50 rounded-xl p-2 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                      </Link>

                      <div className="flex-grow space-y-2">
                        <Link to={`/product/${item._id}`} className="text-lg font-black text-brand-dark hover:text-brand-accent transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-green-700">
                           <Truck size={14} /> Eligible for FREE Shipping
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-brand-primary transition-colors shadow-sm">
                             <select
                                value={item.qty}
                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                className="pl-3 pr-8 py-1.5 text-xs font-black bg-transparent outline-none cursor-pointer appearance-none"
                              >
                                {[...Array(item.countInStock).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    Qty: {x + 1}
                                  </option>
                                ))}
                              </select>
                          </div>
                          <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1.5 border-l pl-3 border-gray-200"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-2xl font-black text-brand-dark shrink-0">
                         ₹{item.price}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                 <Link to="/" className="text-sm font-bold text-blue-600 hover:text-brand-accent hover:underline flex items-center gap-2">
                    <ArrowRight size={16} className="rotate-180" /> Continue Shopping
                 </Link>
                 <div className="text-right">
                    <span className="text-lg font-bold text-gray-500">Subtotal ({totalItems} items):</span>
                    <span className="text-3xl font-black text-brand-dark ml-2">₹{subtotal}</span>
                 </div>
              </div>
            )}
          </div>

          {/* Checkout Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
               <div className="flex items-start gap-3 bg-green-50 p-4 rounded-2xl text-green-800">
                  <Truck className="shrink-0 mt-1" size={18} />
                  <div>
                    <h4 className="text-sm font-black italic uppercase italic">Your order is eligible for FREE Delivery.</h4>
                    <p className="text-[10px] font-medium leading-tight opacity-75 mt-1">Select this option at checkout for standard delivery times.</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between font-bold text-gray-500">
                     <span>Estimated Subtotal</span>
                     <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-600">
                     <span>Shipping</span>
                     <span className="text-green-700">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-baseline">
                     <span className="text-xl font-black text-brand-dark">Total</span>
                     <span className="text-3xl font-black text-brand-dark">₹{subtotal}</span>
                  </div>
               </div>

               <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-4 rounded-full font-black text-sm shadow-xl shadow-brand-primary/50 transition-all disabled:bg-gray-200 disabled:shadow-none uppercase tracking-tighter flex items-center justify-center gap-2 group"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 duration-300" />
                </motion.button>

                <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-3 text-xs text-gray-500 font-bold justify-center">
                      <ShieldCheck size={16} /> 100% Secure Checkout
                   </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-brand-dark to-brand-light p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="font-black text-brand-primary uppercase italic tracking-widest text-xs mb-2">VIP Member Deal</h4>
                 <p className="text-sm font-bold leading-tight mb-4">Get 5% Back with Luxe Platinum Credit Card.</p>
                 <button className="text-[10px] uppercase font-black px-4 py-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition">Learn More</button>
               </div>
               <ShoppingBasket size={80} className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
