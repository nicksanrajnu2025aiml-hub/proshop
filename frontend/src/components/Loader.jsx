import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="relative">
        {/* Circular spinner */}
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full" />
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 w-16 h-16 border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-lg"
        />
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-brand-dark animate-pulse">
         Loading ProShop...
      </p>
    </div>
  );
};
export default Loader;
