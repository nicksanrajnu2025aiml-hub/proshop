import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, ShoppingBag, Search } from 'lucide-react';

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductsQuery({ 
    keyword, 
    pageNumber 
  });

  return (
    <>
      {!keyword && (
        <section className="relative h-[480px] w-full bg-[#0a0a0a] text-white overflow-hidden shadow-2xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 z-0 scale-105 pointer-events-none">
            <video 
               autoPlay 
               loop 
               muted 
               playsInline
               className="w-full h-full object-cover brightness-50 contrast-125 saturate-50"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-[#0a0a0a]/50" />
          </div>

          <div className="relative z-10 container mx-auto px-10 h-full flex flex-col justify-center pt-24 items-start max-w-7xl">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="max-w-2xl bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-accent rounded-full text-brand-dark text-xs font-black tracking-widest uppercase mb-6 shadow-xl shadow-brand-accent/20 border border-white/20">
                <ShoppingBag size={14} strokeWidth={3} /> Exclusive Launch
              </div>
              <h1 className="text-6xl font-black mb-6 leading-none tracking-tight">
                Unlock the <span className="text-brand-primary drop-shadow-lg underline decoration-white/20 underline-offset-8">Future</span> Of Style.
              </h1>
              <p className="text-xl text-gray-300 font-medium mb-10 max-w-lg leading-relaxed antialiased">
                Experience high-performance technology meets premium craftsmanship. Explore our new season collectibles with express 2-day delivery.
              </p>
              
              <div className="flex items-center gap-6">
                 <button className="px-10 py-5 bg-brand-primary text-brand-dark text-lg font-black rounded-2xl shadow-2xl hover:bg-brand-accent transition-all hover:scale-105 active:scale-95 group flex items-center gap-3">
                   Shop the Collection <ArrowRight className="group-hover:translate-x-1 duration-300" strokeWidth={3} />
                 </button>
                 <button className="flex items-center gap-3 text-white font-black hover:text-brand-primary transition group">
                   <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:bg-white/10 group-hover:border-brand-primary transition">
                     <Play size={18} fill="currentColor" strokeWidth={0} />
                   </div>
                   Watch Trailer
                 </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <main className="bg-gray-50 min-h-screen py-8 -mt-24 relative z-20">
        <div className="container mx-auto px-6 max-w-[1400px]">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='red'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="space-y-10">
               {/* Categories Strip */}
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {['Trending', 'Computers', 'Smart Homes', 'Mobiles', 'Fashion', 'Gaming', 'Fitness'].map((cat) => (
                   <button 
                     key={cat} 
                     onClick={() => navigate(cat === 'Trending' ? '/' : `/search/${cat}`)}
                     className={`px-6 py-2.5 border rounded-full text-xs font-black shadow-sm transition whitespace-nowrap ${
                       (keyword === cat) || (!keyword && cat === 'Trending')
                         ? 'bg-brand-primary border-brand-primary text-brand-dark' 
                         : 'bg-white border-gray-200 text-brand-dark hover:border-brand-accent hover:text-brand-accent'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>

              {keyword ? (
                <div className="flex items-center gap-2 text-2xl font-black text-brand-dark">
                   <ArrowLeft strokeWidth={3} />
                   <span>Showing results for "{keyword}"</span>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b-4 border-brand-accent/10 pb-4">
                  <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase px-1">
                     Today's Recommended <span className="text-brand-accent">Deals</span>
                  </h2>
                  <Link to="/" className="text-sm font-bold text-blue-600 hover:text-brand-accent hover:underline">
                    View All Explore More
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {data?.products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

              {data?.products?.length === 0 && (
                <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Search className="text-gray-300" size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2 uppercase italic tracking-tight">Zero Matches Found</h3>
                  <p className="text-gray-500 font-medium text-lg max-w-sm">We couldn't find what you were looking for. Try different keywords or browse our current trending deals.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HomeScreen;
