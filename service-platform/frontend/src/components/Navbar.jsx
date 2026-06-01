import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ShoppingBag, Search } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">S</div>
          <span className={isScrolled ? 'text-slate-900' : 'text-slate-900'}>ServeIt</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">Services</Link>
          <Link to="/dashboard" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">My Bookings</Link>
          <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
            <Link to="/login" className="font-medium text-slate-600 hover:text-primary-600">Login</Link>
            <Link to="/signup" className="btn-primary py-2 px-6">Sign Up</Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold">Services</Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold">My Bookings</Link>
              <hr />
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold">Login</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
