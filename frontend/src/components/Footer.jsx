import { Link } from 'react-router-dom';
import { Globe, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-brand-dark text-white overflow-hidden mt-20">
      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] transition py-4 text-xs font-black tracking-widest flex items-center justify-center gap-2 group"
      >
        <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" /> BACK TO TOP
      </button>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 max-w-7xl py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tight">Get to Know Us</h3>
          <ul className="space-y-2 text-xs font-bold text-gray-300">
            <li><Link to="/" className="hover:underline">About Us</Link></li>
            <li><Link to="/" className="hover:underline">Careers</Link></li>
            <li><Link to="/" className="hover:underline">Press Releases</Link></li>
            <li><Link to="/" className="hover:underline">Tech Science</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tight">Connect with Us</h3>
          <ul className="space-y-2 text-xs font-bold text-gray-300">
            <li><Link to="/" className="hover:underline">Facebook</Link></li>
            <li><Link to="/" className="hover:underline">Twitter</Link></li>
            <li><Link to="/" className="hover:underline">Instagram</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tight">Make Money with Us</h3>
          <ul className="space-y-2 text-xs font-bold text-gray-300">
            <li><Link to="/" className="hover:underline">Sell on ProShop</Link></li>
            <li><Link to="/" className="hover:underline">Sell under ProShop Accelerator</Link></li>
            <li><Link to="/" className="hover:underline">Protect and Build Your Brand</Link></li>
            <li><Link to="/" className="hover:underline">Become an Affiliate</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-tight">Let Us Help You</h3>
          <ul className="space-y-2 text-xs font-bold text-gray-300">
            <li><Link to="/" className="hover:underline">COVID-19 and Us</Link></li>
            <li><Link to="/" className="hover:underline">Your Account</Link></li>
            <li><Link to="/" className="hover:underline">Returns Centre</Link></li>
            <li><Link to="/" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      {/* Language & Logo */}
      <div className="border-t border-gray-700 py-10 flex flex-col items-center gap-6">
        <Link to="/" className="flex items-center gap-1 p-1">
             <span className="text-3xl font-black tracking-tight italic">PROSHOP</span>
             <span className="text-brand-primary text-sm font-medium mt-1">.in</span>
        </Link>
        <div className="flex flex-wrap justify-center gap-4">
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded text-xs font-bold hover:border-brand-primary transition">
             <Globe size={14} /> English
           </button>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded text-xs font-bold hover:border-brand-primary transition">
             $ USD - U.S. Dollar
           </button>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded text-xs font-bold hover:border-brand-primary transition">
             🇺🇸 United States
           </button>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="bg-[#131a22] py-8 border-t border-black/50 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase text-gray-400 mb-4 tracking-tighter">
               <Link to="/" className="hover:underline">Conditions of Use & Sale</Link>
               <Link to="/" className="hover:underline">Privacy Notice</Link>
               <Link to="/" className="hover:underline">Interest-Based Ads</Link>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              © 1996-{currentYear}, ProShop.in, Inc. or its affiliates
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
