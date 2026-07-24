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
import ShiftingCategoryNav from './ShiftingCategoryNav';

const Navbar = ({ medicines = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, setShowAuthModal, setAuthModalView } = useAuth();
  const { cartItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [locationName, setLocationName] = useState(() => localStorage.getItem('locationName') || 'New Delhi');
  const [userPincode, setUserPincode] = useState(() => localStorage.getItem('userPincode') || '110001');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
        const data = await res.json();
        
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.state_district || addr.city_district || addr.county || "Current Location";
        
        // Save to localStorage
        const detectedPincode = addr.postcode || '110001';
        localStorage.setItem('locationName', city);
        localStorage.setItem('userPincode', detectedPincode);
        
        setLocationName(city);
        setUserPincode(detectedPincode);
        window.dispatchEvent(new Event('locationChanged'));
        setShowLocationModal(false);
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

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }

    // For simplicity, map some common pincodes to area names
    let area = 'Delhi Area';
    if (pincodeInput.startsWith('11')) area = 'New Delhi';
    else if (pincodeInput.startsWith('40')) area = 'Mumbai';
    else if (pincodeInput.startsWith('56')) area = 'Bengaluru';
    else if (pincodeInput.startsWith('60')) area = 'Chennai';
    else area = `Pincode ${pincodeInput}`;

    localStorage.setItem('locationName', area);
    localStorage.setItem('userPincode', pincodeInput);
    
    setLocationName(area);
    setUserPincode(pincodeInput);
    window.dispatchEvent(new Event('locationChanged'));
    setShowLocationModal(false);
    toast.success(`Location set to ${area} (${pincodeInput})`);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && !sessionStorage.getItem('locationPrompted')) {
      sessionStorage.setItem('locationPrompted', 'true');
      handleDetectLocation();
    }
  }, [user]);

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = searchQuery.trim().toLowerCase();
      if (q.length > 0) {
        let results = [];
        try {
          const res = await fetch(`${API_BASE}/api/medicines?search=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          results = Array.isArray(data) ? data : (data?.medicines || []);
        } catch (error) {
          console.error("Search API error:", error);
        }

        // If API search returned 0 items, fallback to client-side filtering on medicines prop
        if (results.length === 0 && Array.isArray(medicines) && medicines.length > 0) {
          results = medicines.filter(m => 
            m.name?.toLowerCase().includes(q) || 
            m.brand?.toLowerCase().includes(q) ||
            m.category?.toLowerCase().includes(q) ||
            m.salt?.toLowerCase().includes(q)
          );
        }

        setSearchResults(results.slice(0, 6)); // Show top 6 results
        setShowSearchSuggestions(results.length > 0);
      } else {
        setSearchResults([]);
        setShowSearchSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, medicines]);

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
      path: '/categories',
      subOptions: [
        { name: 'All Medicines', path: '/categories' },
        { name: 'Lab Tests', path: '/lab-tests' },
        { name: 'Ayurveda', path: '/ayurveda' },
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
      name: 'Skin Care', 
      iconName: 'Smile', 
      path: '/skin-care',
      subOptions: ['Face Wash & Cleansers', 'Sunscreen & SPF', 'Moisturizers & Lotions', 'Serums & Treatments', 'Anti-Aging Creams', 'Lip Care', 'Acne Care']
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-white px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto hidden lg:flex max-w-[1440px] items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo (Desktop) */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00a2a4] text-white">
              <ShoppingBag size={16} strokeWidth={3} />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
              MEDI<span className="text-[#00a2a4]">QUICK</span>
            </span>
          </Link>

          {/* Location Selector (Desktop) */}
          <div 
            onClick={() => handleDetectLocation()}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer group shrink-0 border-r border-slate-100 pr-6"
          >
            <MapPin size={18} className="text-slate-400 group-hover:text-[#00a2a4]" />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-slate-800">
                {isDetecting ? 'Detecting...' : `${locationName} (${userPincode})`}
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-[#00a2a4]" />
          </div>

          {/* Search Bar (Desktop) */}
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
                        to={`/medicines/${product._id}`}
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

          {/* Desktop Actions */}
          <div className="flex items-center gap-6 shrink-0 relative">
            <div 
              onMouseEnter={() => setShowFlashDeals(true)}
              onMouseLeave={() => setShowFlashDeals(false)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 cursor-pointer group py-2"
            >
              <Zap size={14} className="text-red-500 fill-red-500" />
              <span className="group-hover:text-[#00a2a4] transition-colors">QUICK BUY! Get 25% off on medicines</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showFlashDeals ? 'rotate-180' : ''}`} />
            </div>

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
          </div>

          {/* User & Cart (Desktop) */}
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
                        <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-[#00a2a4] hover:bg-teal-50 transition-colors">
                          <ShieldCheck size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <User size={14} /> My Profile
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <ClipboardList size={14} /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Heart size={14} /> My Wishlist
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50 mt-1">
                        <LogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthModalView('login');
                  setShowAuthModal(true);
                }}
                className="text-[13px] font-bold text-slate-700 hover:text-[#00a2a4] whitespace-nowrap"
              >
                Login | Signup
              </button>
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

        {/* Mobile Header (Optimized for Mobile Viewports) */}
        <div className="flex flex-col lg:hidden w-full pt-1 pb-1">
           {/* Top bar with Hamburger, Logo, Search Toggle, and Cart */}
           <div className="flex justify-between items-center w-full mb-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-800 focus:outline-none transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Menu"
                >
                  <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#00a2a4] text-white">
                    <ShoppingBag size={14} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
                    MEDI<span className="text-[#00a2a4]">QUICK</span>
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-750 transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Search"
                >
                  <Search size={22} />
                </button>
                
                {/* Cart Icon with badge */}
                <Link 
                  to="/cart" 
                  className="relative p-1.5 hover:bg-slate-100 rounded-lg text-slate-750 transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#ff6f61] text-[9px] font-black text-white shadow-sm ring-2 ring-white">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </div>
           </div>

           {/* Location Selector Pill Bar */}
           <div className="flex items-center justify-between gap-2 border-t border-b border-slate-100 py-1.5 mb-1.5">
             <div 
               onClick={() => handleDetectLocation()}
               className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-250 rounded-full text-xs font-bold text-slate-650 cursor-pointer shadow-xs active:scale-95 transition-all"
             >
               <MapPin size={12} className="text-[#00a2a4]" />
               <span className="truncate max-w-[200px]">Near, {isDetecting ? 'Detecting...' : `${locationName} (${userPincode})`}</span>
               <ChevronDown size={10} className="text-slate-450" />
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Fast Delivery</span>
           </div>
           
            {/* Collapsible Mobile Search Input */}
            {isMobileSearchExpanded && (
              <div className="relative w-full mb-2 animate-in slide-in-from-top duration-200">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for medicines..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-10 py-3 text-[14px] font-medium outline-none transition-all focus:border-[#00a2a4] focus:bg-white focus:ring-2 focus:ring-teal-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <button 
                    type="button" 
                    onClick={() => setIsMobileSearchExpanded(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 p-1"
                  >
                    <X size={16} />
                  </button>
                </form>

                {/* Mobile Suggestions Dropdown */}
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
                      <div className="max-h-[300px] overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            to={`/medicines/${product._id}`}
                            onClick={() => {
                              setShowSearchSuggestions(false);
                              setIsMobileSearchExpanded(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                          >
                            <div className="h-9 w-9 shrink-0 rounded bg-white border border-slate-100 p-1">
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
                        onClick={(e) => {
                          setIsMobileSearchExpanded(false);
                          handleSearch(e);
                        }}
                        className="w-full bg-slate-900 py-2.5 text-[11px] font-bold text-white hover:bg-[#00a2a4] transition-colors uppercase tracking-widest"
                      >
                        View All Results
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
        </div>
      </div>

      {/* Sub Row: Shifting Dropdown Categories (Desktop Only) */}
      <ShiftingCategoryNav categories={categories} />

      {/* Mobile Drawer */}
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
                    <div key={cat.name} className="border-b border-slate-50 last:border-0">
                      <button
                        onClick={() => setMobileOpenCategory(mobileOpenCategory === cat.name ? null : cat.name)}
                        className="flex w-full items-center justify-between p-4 text-sm font-bold text-slate-600 hover:text-[#00a2a4] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(cat.iconName)}
                          <span>{cat.name}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${mobileOpenCategory === cat.name ? 'rotate-180 text-[#00a2a4]' : ''}`} 
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
                                const isObject = typeof option === 'object';
                                const name = isObject ? option.name : option;
                                const linkTo = isObject 
                                  ? option.path 
                                  : `${cat.path}${cat.path.includes('?') ? '&' : '?'}sub=${encodeURIComponent(option.toLowerCase().replace(/ /g, '-'))}`;
                                
                                return (
                                  <Link
                                    key={name}
                                    to={linkTo}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-4 py-3 text-[12px] font-bold text-slate-500 hover:bg-white hover:text-[#00a2a4] transition-all"
                                  >
                                    {name}
                                    <ChevronRight size={14} className="opacity-40" />
                                  </Link>
                                );
                              })}
                              <Link
                                to={cat.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="mt-2 flex items-center justify-center rounded-lg bg-[#00a2a4] py-3 text-[11px] font-bold text-white shadow-sm"
                              >
                                View All {cat.name}
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                  {user ? (
                    <>
                      {user.isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full mb-3 flex items-center justify-center gap-2 rounded-xl bg-teal-50 py-3 text-sm font-bold text-[#00a2a4] shadow-sm active:scale-95"
                        >
                          <ShieldCheck size={18} /> Admin Dashboard
                        </Link>
                      )}
                      <button onClick={logout} className="w-full rounded-xl bg-red-500 py-4 text-sm font-bold text-white shadow-xl active:scale-95">
                        LOGOUT
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        setAuthModalView('login');
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      }} 
                      className="w-full rounded-xl bg-[#00a2a4] py-4 text-sm font-bold text-white shadow-xl active:scale-95"
                    >
                      LOGIN / SIGNUP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation (Exact Mockup Style) */}
      <nav className="fixed bottom-4 left-5 right-5 z-50 flex items-center justify-around bg-[#181d28] h-14 rounded-full lg:hidden shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-white/10 px-4">
        {[
          { icon: <Home size={20} />, path: '/' },
          { icon: <LayoutGrid size={20} />, path: '/medicines' },
          { icon: <ShoppingBag size={20} />, path: '/cart' },
          { icon: <User size={20} />, path: '/profile' },
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center justify-center p-2 transition-all ${
              location.pathname === item.path ? 'text-white scale-110' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>

    </header>
  );
};

export default Navbar;
