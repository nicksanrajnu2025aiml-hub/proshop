import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group"
    >
      <Link to={`/product/${product._id}`} className="relative overflow-hidden block aspect-square bg-gray-50">
        <motion.img 
          initial={{ scale: 1.1 }}
          whileHover={{ scale: 1.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply" 
        />
        {product.countInStock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
            Out of Stock
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent mb-1">
          {product.category}
        </span>
        
        <Link to={`/product/${product._id}`} className="block group-hover:text-brand-accent transition-colors">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] mb-2 leading-relaxed tracking-tight group-hover:underline decoration-brand-accent/40 underline-offset-4">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Rating value={product.rating} />
          <span className="text-xs font-semibold text-gray-500 hover:text-brand-accent hover:underline cursor-pointer border-l pl-2 border-gray-200">
            {product.numReviews}
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-1">
          <span className="text-[10px] text-gray-600 font-medium mb-1 shrink-0">₹</span>
          <span className="text-2xl font-black text-brand-dark tracking-tighter shrink-0">{product.price.toString().split('.')[0]}</span>
          <span className="text-xs text-gray-600 font-bold -mb-0.5 shrink-0">{product.price.toString().split('.')[1] || '00'}</span>
        </div>

        <div className="mt-3 py-1 text-[11px] font-bold text-green-700 flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           Get it by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <p className="text-[10px] font-medium text-gray-500 mt-0.5">FREE Premium Delivery</p>
      </div>
    </motion.div>
  );
};

export default Product;
