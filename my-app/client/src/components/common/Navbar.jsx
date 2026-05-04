import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Heart, 
  Package, 
  LogOut, 
  Settings,
  Home as HomeIcon,
  Stethoscope,
  FlaskConical,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ medicines = [] }) => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const results = Array.isArray(medicines)
    ? medicines
        .filter((m) => {
          if (!searchTerm) return false;
          const q = searchTerm.toLowerCase();
          return (
            m.name?.toLowerCase().includes(q) ||
            m.brand?.toLowerCase().includes(q) ||
            m.category?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserDropdown(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutAction = () => {
    setMobileMenuOpen(false);
    logout();
    toast.success('Successfully logged out');
    navigate('/login');
  };

  const handleSearchSelect = (id) => {
    navigate(`/product/${id}`);
    setSearchTerm('');
    setShowSearchDropdown(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav 
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2' 
            : 'bg-white py-4'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Medi<span className="text-blue-600">Quick</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Amritsar Hub</p>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="relative hidden flex-1 max-w-2xl md:block" ref={searchRef}>
              <div className="group relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full rounded-full border border-slate-100 bg-slate-50 px-11 py-2.5 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-md"
                  placeholder="Search medicines, health products..."
                />
              </div>

              <AnimatePresence>
                {showSearchDropdown && searchTerm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl z-50"
                  >
                    {results.length > 0 ? (
                      <div className="p-2">
                        {results.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleSearchSelect(product._id)}
                            className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                          >
                            <img src={product.image} className="h-10 w-10 rounded-lg object-contain bg-slate-50 p-1" alt="" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{product.brand}</p>
                            </div>
                            <p className="text-sm font-bold text-blue-600">₹{product.price}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Search className="mx-auto mb-2 h-8 w-8 opacity-20" />
                        <p className="text-xs font-medium uppercase tracking-widest">No results found</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle (Mobile) */}
              <button className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* User Dropdown */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-full p-1.5 transition-colors hover:bg-slate-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">
                    {user ? user.name?.charAt(0) : <User className="h-4 w-4" />}
                  </div>
                  {user && <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>}
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl z-[110]"
                    >
                      <div className="p-2">
                        {user ? (
                          <>
                            {user.isAdmin && (
                              <Link to="/admin-dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50">
                                <Settings className="h-4 w-4" /> Admin Console
                              </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                              <User className="h-4 w-4" /> My Profile
                            </Link>
                            <Link to="/my-orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                              <Package className="h-4 w-4" /> Orders
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                              <Heart className="h-4 w-4" /> Wishlist
                            </Link>
                            <div className="my-1 border-t border-slate-100" />
                            <button onClick={handleLogoutAction} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50">
                              <LogOut className="h-4 w-4" /> Logout
                            </button>
                          </>
                        ) : (
                          <Link to="/login" className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-blue-700">
                            Login / Signup
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
                <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
                {cartItems?.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-full"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold">MediQuick</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-10">
                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="rounded-2xl bg-slate-50 p-6">
                      {user ? (
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white uppercase">
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs font-medium text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="mb-4 text-sm font-medium text-slate-600">Login to unlock best offers</p>
                          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="inline-block w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">
                            Login / Signup
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Pharmacy</p>
                      <MobileNavLink icon={<HomeIcon className="h-5 w-5" />} label="Home" to="/" onClick={() => setMobileMenuOpen(false)} active={isActive('/')} />
                      <MobileNavLink icon={<Percent className="h-5 w-5" />} label="Offers" to="/offers" onClick={() => setMobileMenuOpen(false)} active={isActive('/offers')} />
                      <MobileNavLink icon={<FlaskConical className="h-5 w-5" />} label="Lab Tests" to="/lab-tests" onClick={() => setMobileMenuOpen(false)} active={isActive('/lab-tests')} />
                      <MobileNavLink icon={<ShieldCheck className="h-5 w-5" />} label="Care Plan" to="/care-plan" onClick={() => setMobileMenuOpen(false)} active={isActive('/care-plan')} />
                    </div>

                    <div className="space-y-1">
                      <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">My Account</p>
                      <MobileNavLink icon={<User className="h-5 w-5" />} label="Profile" to="/profile" onClick={() => setMobileMenuOpen(false)} active={isActive('/profile')} />
                      <MobileNavLink icon={<Package className="h-5 w-5" />} label="My Orders" to="/my-orders" onClick={() => setMobileMenuOpen(false)} active={isActive('/my-orders')} />
                      <MobileNavLink icon={<Heart className="h-5 w-5" />} label="Wishlist" to="/wishlist" onClick={() => setMobileMenuOpen(false)} active={isActive('/wishlist')} />
                    </div>
                  </div>
                </div>

                {user && (
                  <div className="border-t border-slate-100 p-4">
                    <button onClick={handleLogoutAction} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar (Very Premium Look) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/80 backdrop-blur-xl border-t border-slate-100 px-2 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 items-center">
          <BottomTab to="/" icon={<HomeIcon className="h-5 w-5" />} label="Home" active={isActive('/')} />
          <BottomTab to="/medicines" icon={<ShoppingBag className="h-5 w-5" />} label="Shop" active={isActive('/medicines')} />
          <div className="flex flex-col items-center justify-center -translate-y-6">
            <Link to="/consult" className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-90 transition-transform">
              <Stethoscope className="h-7 w-7" />
            </Link>
          </div>
          <BottomTab to="/lab-tests" icon={<FlaskConical className="h-5 w-5" />} label="Tests" active={isActive('/lab-tests')} />
          <BottomTab to={user ? '/profile' : '/login'} icon={<User className="h-5 w-5" />} label="Account" active={isActive('/profile') || isActive('/login')} />
        </div>
      </div>
    </>
  );
};

const MobileNavLink = ({ icon, label, to, onClick, active }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </div>
    <ChevronRight className={`h-4 w-4 ${active ? 'text-blue-400' : 'text-slate-300'}`} />
  </Link>
);

const BottomTab = ({ to, icon, label, active }) => (
  <Link to={to} className="flex flex-col items-center justify-center gap-1 transition-all">
    <div className={`p-1 rounded-lg ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight ${active ? 'text-blue-600' : 'text-slate-400'}`}>
      {label}
    </span>
  </Link>
);

export default Navbar;