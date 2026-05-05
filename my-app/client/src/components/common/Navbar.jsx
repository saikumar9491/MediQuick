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
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
        const data = await res.json();
        
        // Enhanced extraction for maximum specificity
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.state_district || addr.city_district || addr.county || "Current Location";
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

  const initialCategories = [
    { 
      name: 'Health Resource Center', 
      iconName: 'BookOpen', 
      path: '/all-medicines',
      subOptions: [
        { name: 'All Medicines', path: '/all-medicines' },
        { name: 'Lab Tests', path: '/lab-tests' },
        { name: 'Consult Top Doctors', path: '/consult' },
        { name: 'Care Plan', path: '/care-plan' }
      ]
    },
    { 
      name: 'Hair Care', 
      iconName: 'Scissors', 
      path: '/medicines?filter=hair-care',
      subOptions: ['Hair Oils', 'Shampoos & Conditioners', 'Hair Serums', 'Hair Creams & Masks', 'Hair Colour', 'Hair Growth Products', 'Essential Oils']
    },
    { 
      name: 'Fitness & Health', 
      iconName: 'Dumbbell', 
      path: '/medicines?filter=fitness',
      subOptions: ['Vitamins', 'Proteins', 'Health Drinks', 'Gym Accessories']
    },
    { 
      name: 'Sexual Wellness', 
      iconName: 'HeartPulse', 
      path: '/medicines?filter=sexual-wellness',
      subOptions: ['Condoms', 'Lubricants', 'Personal Wash', 'Performance']
    },
    { 
      name: 'Vitamins & Nutrition', 
      iconName: 'Sparkles', 
      path: '/medicines?filter=vitamins',
      subOptions: ['Multivitamins', 'Minerals', 'Omega & Fish Oil', 'Biotin']
    },
    { 
      name: 'Supports & Braces', 
      iconName: 'Activity', 
      path: '/medicines?filter=supports',
      subOptions: ['Knee Supports', 'Back Supports', 'Ankle Supports', 'Wrist Supports']
    },
    { 
      name: 'Immunity Boosters', 
      iconName: 'Shield', 
      path: '/medicines?filter=immunity',
      subOptions: ['Chyawanprash', 'Herbal Juices', 'Vitamin C', 'Zinc']
    },
    { 
      name: 'Homeopathy', 
      iconName: 'Leaf', 
      path: '/medicines?filter=homeopathy',
      subOptions: ['Cough & Cold', 'Digestion', 'Skin Care', 'Hair Care']
    },
    { 
      name: 'Pet Care', 
      iconName: 'Dog', 
      path: '/medicines?filter=pet-care',
      subOptions: ['Dog Food', 'Cat Food', 'Pet Grooming', 'Pet Medicines']
    },
  ];

  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="h-4 w-4" />;
      case 'Scissors': return <Scissors className="h-4 w-4" />;
      case 'Dumbbell': return <Dumbbell className="h-4 w-4" />;
      case 'HeartPulse': return <HeartPulse className="h-4 w-4" />;
      case 'Sparkles': return <Sparkles className="h-4 w-4" />;
      case 'Activity': return <Activity className="h-4 w-4" />;
      case 'Shield': return <Shield className="h-4 w-4" />;
      case 'Leaf': return <Leaf className="h-4 w-4" />;
      case 'Dog': return <Dog className="h-4 w-4" />;
      default: return <LayoutGrid className="h-4 w-4" />;
    }
  };

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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Menu size={24} className="text-slate-900" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <span className="text-lg font-black italic">M+</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              MEDI<span className="text-blue-600">QUICK</span>
            </span>
          </Link>
        </div>

        {/* Right: Search & Cart */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/all-medicines')}
            className="p-2.5 hover:bg-slate-50 rounded-full transition-colors text-slate-600"
          >
            <Search size={22} />
          </button>
          
          <Link to="/cart" className="relative p-2.5 hover:bg-slate-50 rounded-full transition-colors text-slate-600">
            <ShoppingBag size={22} />
            {cartItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6f61] text-[9px] font-bold text-white shadow-sm">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-[110] w-[280px] bg-white shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome</p>
                      <p className="text-sm font-black text-slate-900">{user ? user.name : 'Guest User'}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.name} className="border-b border-slate-50 last:border-0">
                      <button
                        onClick={() => setMobileOpenCategory(mobileOpenCategory === cat.name ? null : cat.name)}
                        className="flex w-full items-center justify-between p-4 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(cat.iconName)}
                          <span>{cat.name}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${mobileOpenCategory === cat.name ? 'rotate-180 text-blue-600' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {mobileOpenCategory === cat.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50/50"
                          >
                            <div className="grid grid-cols-1 gap-1 px-4 pb-4 pt-2">
                              {cat.subOptions.map((option) => {
                                const name = typeof option === 'object' ? option.name : option;
                                return (
                                  <Link
                                    key={name}
                                    to={typeof option === 'object' ? option.path : `${cat.path}${cat.path.includes('?') ? '&' : '?'}sub=${option.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-4 py-3 text-[12px] font-bold text-slate-500 hover:bg-white hover:text-blue-600 transition-all"
                                  >
                                    {name}
                                    <ChevronRight size={14} className="opacity-40" />
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  {user ? (
                    <button onClick={logout} className="w-full rounded-xl bg-red-500 py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                      LOGOUT
                    </button>
                  ) : (
                    <button onClick={() => navigate('/login')} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                      LOGIN / SIGNUP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation (Tata 1mg Style with Center Button) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-100 bg-white/95 pb-6 pt-3 backdrop-blur-xl lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center gap-1">
          <Home size={22} className={location.pathname === '/' ? 'text-blue-600' : 'text-slate-400'} />
          <span className={`text-[10px] font-black uppercase ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400'}`}>Home</span>
        </Link>
        <Link to="/all-medicines" className="flex flex-col items-center gap-1">
          <Shield size={22} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase text-slate-400">Plan</span>
        </Link>
        
        {/* Elevated Center Button */}
        <div className="relative -mt-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fcead2] border-4 border-white shadow-xl">
            <span className="text-[11px] font-black text-[#9a6a38] uppercase">Extra</span>
          </div>
        </div>

        <Link to="/lab-tests" className="flex flex-col items-center gap-1">
          <FlaskConical size={22} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase text-slate-400">Lab Tests</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1">
          <User size={22} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase text-slate-400">Profile</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;