import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ShoppingCart, Truck, ShieldCheck, RefreshCcw, Star, Send } from 'lucide-react';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty }));
      navigate('/cart');
    }
  };

  const buyNowHandler = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty }));
      navigate('/login?redirect=/shipping');
    }
  };

  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="red">{error?.data?.message || error.error}</Message>;
  if (!product) return <Message variant="red">Product not found</Message>;

  const priceStr = (product.price || 0).toString();
  const priceParts = priceStr.includes('.') ? priceStr.split('.') : [priceStr, '00'];

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <Link 
           className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-accent transition mb-6 group" 
           to="/"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to results
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 flex items-center justify-center bg-gray-50 rounded-2xl p-6 group cursor-zoom-in"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" 
            />
          </motion.div>

          {/* Details Section */}
          <div className="lg:col-span-4 space-y-6">
            <nav className="text-xs uppercase tracking-widest font-black text-brand-accent/80 mb-2">
               {product.brand} &bull; {product.category}
            </nav>
            <h1 className="text-4xl font-black text-brand-dark leading-tight tracking-tighter">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 py-2 border-y border-gray-100">
               <Rating value={product.rating} />
               <span className="text-sm font-bold text-blue-600 hover:text-brand-accent cursor-pointer hover:underline">
                 {product.numReviews} Global Ratings
               </span>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">About this item</h3>
               <p className="text-gray-600 text-lg leading-relaxed font-medium">
                 {product.description}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <Truck className="text-brand-accent mb-2" />
                   <span className="text-[10px] font-bold uppercase text-gray-400">Fast Delivery</span>
                   <span className="text-xs font-black">2-Day Shipping</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <ShieldCheck className="text-green-600 mb-2" />
                   <span className="text-[10px] font-bold uppercase text-gray-400">Secure</span>
                   <span className="text-xs font-black">Official Warranty</span>
                </div>
            </div>
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-3">
             <div className="sticky top-24 p-6 bg-white border-2 border-gray-100 rounded-3xl shadow-2xl">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[14px] text-brand-dark font-bold tracking-tighter">₹</span>
                  <span className="text-5xl font-black text-brand-dark tracking-tighter">{priceParts[0]}</span>
                  <span className="text-lg text-brand-dark font-bold -mb-1">{priceParts[1]}</span>
                </div>

                <div className="space-y-4">
                   <div className={`flex items-center gap-2 font-black ${product.countInStock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                      <Check size={18} strokeWidth={3} /> {product.countInStock > 0 ? 'In Stock' : 'Currently Unavailable'}
                   </div>

                   {product.countInStock > 0 && (
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Quantity</label>
                        <select 
                          value={qty} 
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="w-full bg-gray-50 border-2 border-gray-100 py-3 px-4 rounded-xl font-bold focus:border-brand-primary transition-colors outline-none cursor-pointer"
                        >
                          {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1} Unit{x > 0 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                     </div>
                   )}

                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     disabled={product.countInStock === 0}
                     onClick={addToCartHandler}
                     className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3.5 rounded-full font-black text-sm shadow-xl shadow-brand-primary/50 transition-all disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-2"
                   >
                     <ShoppingCart size={20} strokeWidth={3} /> Add to Cart
                   </motion.button>
                   
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     disabled={product.countInStock === 0}
                     onClick={buyNowHandler}
                     className="w-full bg-[#ffa41c] hover:bg-[#fa8914] text-white py-3.5 rounded-full font-black text-sm shadow-xl shadow-orange-200 transition-all disabled:bg-gray-200 disabled:shadow-none"
                   >
                     Buy Now
                   </motion.button>

                   <div className="pt-4 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                         <Truck size={14} /> Ships from ProShop.in
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                         <RefreshCcw size={14} /> 30-Day Replacement
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Existing Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">Customer Reviews</h2>
            {product.reviews.length === 0 ? (
              <Message variant="blue">No reviews yet. Be the first to review!</Message>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-brand-dark">{review.name}</p>
                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Rating value={review.rating} />
                    <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">Write a Review</h2>
            {!userInfo ? (
              <Message variant="blue">
                Please <Link to="/login" className="text-blue-600 hover:underline font-bold">sign in</Link> to write a review.
              </Message>
            ) : (
              <form onSubmit={reviewHandler} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          fill={star <= rating ? '#ffa41c' : 'none'}
                          className={star <= rating ? 'text-[#ffa41c]' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingReview || rating === 0}
                  className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> {loadingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
