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
  Zap,
  Sparkles,
  BookOpen,
  Scissors,
  Dumbbell,
  HeartPulse,
  Activity,
  Shield,
  Leaf,
  Dog,
  Crosshair
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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [locationName, setLocationName] = useState('New Delhi');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        // Extract city, town, or village
        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Current Location";
        setLocationName(city);
      } catch (error) {
        console.error("Error detecting location:", error);
      } finally {
        setIsDetecting(false);
      }
    }, (error) => {
      console.error(error);
      setIsDetecting(false);
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 0) {
        try {
          const res = await fetch(`${API_BASE}/api/medicines?search=${searchQuery}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setSearchResults(data.slice(0, 6)); // Show top 6 results
            setShowSearchSuggestions(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSearchResults([]);
        setShowSearchSuggestions(false);
      }
    }, 150); // Faster response

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSearchSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const categories = [
    { name: 'Health Resource Center', icon: <BookOpen className="h-4 w-4" />, path: '/medicines' },
    { name: 'Hair Care', icon: <Scissors className="h-4 w-4" />, path: '/medicines?filter=hair-care' },
    { name: 'Fitness & Health', icon: <Dumbbell className="h-4 w-4" />, path: '/medicines?filter=fitness' },
    { name: 'Sexual Wellness', icon: <HeartPulse className="h-4 w-4" />, path: '/medicines?filter=sexual-wellness' },
    { name: 'Vitamins & Nutrition', icon: <Sparkles className="h-4 w-4" />, path: '/medicines?filter=vitamins' },
    { name: 'Supports & Braces', icon: <Activity className="h-4 w-4" />, path: '/medicines?filter=supports' },
    { name: 'Immunity Boosters', icon: <Shield className="h-4 w-4" />, path: '/medicines?filter=immunity' },
    { name: 'Homeopathy', icon: <Leaf className="h-4 w-4" />, path: '/medicines?filter=homeopathy' },
    { name: 'Pet Care', icon: <Dog className="h-4 w-4" />, path: '/medicines?filter=pet-care' },
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
      <div className="border-b border-slate-100 bg-white px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00a2a4] text-white">
              <ShoppingBag size={16} strokeWidth={3} />
            </div>
            <span className="hidden text-lg font-black tracking-tighter text-slate-900 lg:block uppercase">
              MEDI<span className="text-[#00a2a4]">QUICK</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div 
            onClick={handleDetectLocation}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer group shrink-0 border-r border-slate-100 pr-6"
          >
            <MapPin size={18} className="text-slate-400 group-hover:text-[#00a2a4]" />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-800">
                {isDetecting ? 'Detecting...' : locationName}
              </span>
            </div>
            <Crosshair size={14} className={`text-slate-400 ml-1 ${isDetecting ? 'animate-spin text-[#00a2a4]' : ''}`} />
          </div>

          {/* Search Bar (Centered) */}
          <div className="relative flex-1 group min-w-[300px]">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for Medicines and Health Products"
                className="w-full rounded bg-slate-50 border border-slate-100 px-4 py-2 text-[13px] font-medium outline-none transition-all focus:border-slate-300 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600" size={18} />
            </form>

            {/* Live Suggestions Dropdown */}
            <AnimatePresence>
              {showSearchSuggestions && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full z-[80] mt-1 overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Products</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={() => {
                          setShowSearchSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <div className="h-10 w-10 shrink-0 rounded bg-white border border-slate-100 p-1">
                          <img src={product.image} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-slate-800 group-hover:text-[#00a2a4] truncate">{product.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-black text-[#00a2a4]">₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="w-full bg-slate-900 py-2.5 text-[11px] font-bold text-white hover:bg-[#00a2a4] transition-colors uppercase tracking-widest"
                  >
                    View All Results
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Promotion & Actions */}
          <div className="hidden items-center gap-6 xl:flex shrink-0 relative">
            <div 
              onMouseEnter={() => setShowFlashDeals(true)}
              onMouseLeave={() => setShowFlashDeals(false)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 cursor-pointer group py-2"
            >
              <Zap size={14} className="text-red-500 fill-red-500" />
              <span className="group-hover:text-[#00a2a4] transition-colors">QUICK BUY! Get 25% off on medicines</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showFlashDeals ? 'rotate-180' : ''}`} />
            </div>

            {/* Daily Deals Dropdown */}
            <AnimatePresence>
              {showFlashDeals && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseEnter={() => setShowFlashDeals(true)}
                  onMouseLeave={() => setShowFlashDeals(false)}
                  className="absolute left-0 top-full z-[70] mt-1 w-72 rounded-xl bg-white p-4 shadow-2xl border border-slate-100"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Today's Flash Deals</span>
                    <span className="rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white animate-pulse">LIVE</span>
                  </div>
                  <div className="space-y-3">
                    {flashDeals.length > 0 ? flashDeals.map((deal) => (
                      <Link 
                        key={deal._id} 
                        to={`/product/${deal._id}`}
                        className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="h-10 w-10 shrink-0 rounded bg-white border border-slate-100 p-1">
                          <img src={deal.image} className="h-full w-full object-contain" alt="" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-[11px] font-bold text-slate-700 group-hover:text-[#00a2a4]">{deal.name}</p>
                          <p className="text-[10px] font-black text-red-500">₹{deal.discountPrice || deal.price}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </Link>
                    )) : (
                      <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase">Fetching deals...</p>
                    )}
                  </div>
                  <Link to="/medicines?filter=flash" className="mt-3 block rounded bg-slate-900 py-2 text-center text-[10px] font-bold text-white hover:bg-[#00a2a4] transition-colors uppercase tracking-widest">
                    View All Offers
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User & Cart */}
            <div className="flex items-center gap-5 border-l border-slate-100 pl-6">
              {user ? (
                <div 
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden group-hover:border-teal-400 transition-colors">
                      {user.image ? <img src={user.image} className="h-full w-full object-cover" alt="" /> : <User size={16} className="text-slate-400" />}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full z-[70] mt-2 w-52 rounded-xl bg-white p-2 shadow-2xl border border-slate-100"
                      >
                        <div className="px-3 py-2 border-b border-slate-50 mb-1">
                          <p className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                        </div>
                        {user.isAdmin && (
                          <Link to="/admin-dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-[#00a2a4] hover:bg-teal-50 transition-colors">
                            <ShieldCheck size={14} /> Admin Dashboard
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          <User size={14} /> My Profile
                        </Link>
                        <Link to="/my-orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          <ClipboardList size={14} /> My Orders
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50 mt-1">
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="text-[13px] font-bold text-slate-700 hover:text-[#00a2a4] whitespace-nowrap">
                  Login | Signup
                </Link>
              )}
              
              <Link to="/cart" className="relative text-slate-700 hover:text-[#00a2a4] transition-colors">
                <ShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6f61] text-[9px] font-bold text-white shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-lg p-2 text-slate-900 xl:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sub Row: Categories (Centered) */}
      <nav className="hidden border-b border-slate-100 bg-white sm:block px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-8 py-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group flex items-center gap-1 text-[13px] font-normal text-slate-700 transition-all hover:text-[#00a2a4] whitespace-nowrap"
            >
              <span>{cat.name}</span>
              <ChevronDown size={12} className="text-slate-400 transition-transform group-hover:translate-y-0.5 group-hover:text-[#00a2a4]" />
            </Link>
          ))}
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
                    <p className="text-sm font-black text-slate-900">{user ? user.name : 'Guest User'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl p-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#00a2a4] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  {user ? (
                    <button onClick={logout} className="w-full rounded-xl bg-red-500 py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                      LOGOUT
                    </button>
                  ) : (
                    <button onClick={() => navigate('/login')} className="w-full rounded-xl bg-[#00a2a4] py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                      LOGIN / SIGNUP
                    </button>
                  )}
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
              location.pathname === item.path ? 'text-[#00a2a4]' : 'text-slate-400 hover:text-slate-900'
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