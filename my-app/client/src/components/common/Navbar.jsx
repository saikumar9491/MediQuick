import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X,
  Home,
  LayoutGrid,
  ClipboardList,
  Heart,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../../utils/apiConfig';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Medicines', icon: <ShoppingBag className="h-4 w-4" />, path: '/medicines' },
    { name: 'Lab Tests', icon: <FlaskConical className="h-4 w-4" />, path: '/lab-tests' },
    { name: 'Consult', icon: <Stethoscope className="h-4 w-4" />, path: '/consult' },
    { name: 'Ayurveda', icon: <LayoutGrid className="h-4 w-4" />, path: '/ayurveda' },
    { name: 'Care Plan', icon: <ShieldCheck className="h-4 w-4" />, path: '/care-plan' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const [showFlashDeals, setShowFlashDeals] = useState(false);
  const [flashDeals, setFlashDeals] = useState([]);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/medicines`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFlashDeals(data.filter(m => m.isFlashDeal).slice(0, 4));
        }
      } catch (err) {
        console.error("Flash deals fetch failed", err);
      }
    };
    fetchFlashDeals();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar: Location & Primary Actions */}
      <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00a2a4] text-white shadow-lg shadow-teal-100">
              <ShoppingBag size={20} strokeWidth={3} />
            </div>
            <span className="hidden text-xl font-black tracking-tighter text-slate-900 sm:block">
              MEDI<span className="text-[#00a2a4]">QUICK</span>
            </span>
          </Link>

          {/* Location Selector (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
            <MapPin size={14} className="text-[#00a2a4]" />
            <span>Amritsar, 143001</span>
            <ChevronDown size={14} />
          </div>

          {/* Search Bar (Star of the Nav) */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search for medicines, health products..."
              className="w-full rounded-xl bg-slate-50 border border-slate-100 px-10 py-2.5 text-sm font-medium outline-none transition-all focus:border-teal-300 focus:bg-white focus:shadow-lg focus:shadow-teal-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#00a2a4] px-3 py-1 text-[10px] font-bold text-white transition-all hover:bg-slate-900">
              SEARCH
            </button>
          </form>

          {/* Auth & Cart (Desktop) */}
          <div className="hidden items-center gap-6 sm:flex">
            {user ? (
              <div className="relative group cursor-pointer py-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" alt="" /> : <User size={16} />}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-xs font-bold text-slate-900 hover:text-[#00a2a4]">
                Login / Signup
              </Link>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95">
              <ShoppingCart size={16} />
              <span>BAG</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6f61] text-[10px] font-black text-white shadow-md border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-lg p-2 text-slate-900 sm:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sub Row: Categories (Desktop Only) */}
      <nav className="hidden border-b border-slate-50 bg-white sm:block px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-8 py-2.5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-[#00a2a4]"
            >
              <span className="text-[#00a2a4]/50">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
          <div className="relative ml-auto flex items-center gap-4">
            <button 
              onMouseEnter={() => setShowFlashDeals(true)}
              onMouseLeave={() => setShowFlashDeals(false)}
              className="flex items-center gap-1.5 text-[10px] font-black text-[#ff6f61] uppercase tracking-[0.2em] transition-all hover:scale-105"
            >
              <Zap size={14} className="fill-[#ff6f61]" /> 
              <span>Flash Offers</span>
              <ChevronDown size={12} className={`transition-transform ${showFlashDeals ? 'rotate-180' : ''}`} />
            </button>

            {/* Flash Deals Dropdown */}
            <AnimatePresence>
              {showFlashDeals && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseEnter={() => setShowFlashDeals(true)}
                  onMouseLeave={() => setShowFlashDeals(false)}
                  className="absolute right-0 top-full z-[60] mt-2 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-slate-100"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Trending Deals</span>
                    <span className="rounded bg-[#ff6f61] px-2 py-0.5 text-[8px] font-black text-white animate-pulse">LIVE NOW</span>
                  </div>
                  
                  <div className="space-y-3">
                    {flashDeals.length > 0 ? flashDeals.map((deal) => (
                      <Link 
                        key={deal._id} 
                        to={`/product/${deal._id}`}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-white border border-slate-100 p-1">
                          <img src={deal.image} className="h-full w-full object-contain" alt="" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-[11px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{deal.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#ff6f61]">₹{deal.discountPrice || deal.price}</span>
                            <span className="text-[9px] text-slate-400 line-through">₹{Math.round(deal.price * 1.3)}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </Link>
                    )) : (
                      <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checking for deals...</p>
                    )}
                  </div>
                  
                  <Link to="/medicines?filter=flash" className="mt-4 block rounded-xl bg-slate-900 py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-white hover:bg-teal-600 transition-colors">
                    VIEW ALL OFFERS
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl sm:hidden"
            >
              <div className="p-6">
                <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome</p>
                    <p className="text-sm font-black text-slate-900">Guest User</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl p-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  <button onClick={() => navigate('/login')} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                    LOGIN / SIGNUP
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation (Native App Feel) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-100 bg-white/80 px-2 py-3 backdrop-blur-xl sm:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {[
          { icon: <Home size={20} />, label: 'Home', path: '/' },
          { icon: <LayoutGrid size={20} />, label: 'Categories', path: '/medicines' },
          { icon: <ClipboardList size={20} />, label: 'Orders', path: '/my-orders' },
          { icon: <Heart size={20} />, label: 'Wishlist', path: '/wishlist' },
          { icon: <User size={20} />, label: 'Profile', path: '/profile' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;