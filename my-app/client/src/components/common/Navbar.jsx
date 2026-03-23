import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);
  const [forceOpenMobileSearch, setForceOpenMobileSearch] = useState(false);

  const desktopDropdownRef = useRef(null);
  const mobileStickySearchRef = useRef(null);
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
    const handleClickOutside = (e) => {
      const insideDesktopSearch =
        desktopDropdownRef.current && desktopDropdownRef.current.contains(e.target);
      const insideMobileStickySearch =
        mobileStickySearchRef.current && mobileStickySearchRef.current.contains(e.target);
      const insideUserMenu =
        userMenuRef.current && userMenuRef.current.contains(e.target);

      if (!insideDesktopSearch && !insideMobileStickySearch) {
        setShowSearchDropdown(false);
      }

      if (!insideUserMenu) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        if (!forceOpenMobileSearch) {
          setShowMobileSearchBar(window.scrollY > 140);
        }
      } else {
        setShowMobileSearchBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [forceOpenMobileSearch]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#daily-deals') {
      setTimeout(() => {
        const dealsSection = document.getElementById('daily-deals');
        if (dealsSection) {
          dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  const handleLogoutAction = () => {
    setMobileMenuOpen(false);
    logout();
    toast.success('Securely Logged Out');
    navigate('/login');
  };

  const handleSearchSelect = (id) => {
    navigate(`/product/${id}`);
    setSearchTerm('');
    setShowSearchDropdown(false);
    setMobileMenuOpen(false);
    setForceOpenMobileSearch(false);
  };

  const handleOffersClick = () => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);

    if (location.pathname === '/') {
      const dealsSection = document.getElementById('daily-deals');
      if (dealsSection) {
        dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/#daily-deals');
    }
  };

  const isActive = (path) => location.pathname === path;

  const openMobileSearch = () => {
    setMobileMenuOpen(false);
    setForceOpenMobileSearch(true);
    setShowMobileSearchBar(true);
    setShowSearchDropdown(false);

    setTimeout(() => {
      const searchInput = document.getElementById('mobile-sticky-search-input');
      searchInput?.focus();
    }, 120);
  };

  const closeMobileSearch = () => {
    setForceOpenMobileSearch(false);
    setShowSearchDropdown(false);
    if (window.scrollY <= 140) {
      setShowMobileSearchBar(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex min-h-[64px] w-full max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-[72px] sm:px-4 md:gap-3 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm md:hidden"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-[3px]">
                <span className="block h-[2.5px] w-5 rounded-full bg-gray-900"></span>
                <span className="block h-[2.5px] w-5 rounded-full bg-gray-900"></span>
                <span className="block h-[2.5px] w-5 rounded-full bg-gray-900"></span>
              </div>
            </button>

            <Link to="/" className="group flex min-w-0 shrink items-center">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:rotate-[10deg] sm:h-10 sm:w-10 md:h-11 md:w-11">
                  <span className="text-base font-black italic tracking-tighter sm:text-lg md:text-xl">M</span>
                  <span className="text-sm font-bold leading-none text-green-400 sm:text-base md:text-lg">+</span>
                </div>
                <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500"></div>
              </div>

              <div className="ml-2 min-w-0 sm:ml-3">
                <h1 className="truncate text-sm font-black uppercase italic leading-none tracking-tight text-gray-900 sm:text-base md:text-xl">
                  Medi<span className="text-blue-600">Quick</span>
                </h1>
                <div className="mt-1 hidden h-1 w-full origin-left scale-x-0 rounded-full bg-blue-600 transition-transform group-hover:scale-x-100 sm:block"></div>
              </div>
            </Link>
          </div>

          <div className="relative hidden max-w-xl flex-1 md:block" ref={desktopDropdownRef}>
            <div className="group relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full rounded-full border-2 border-transparent bg-gray-50 px-6 py-3 pr-12 text-sm font-medium outline-none shadow-inner transition-all focus:border-blue-500 focus:bg-white"
                placeholder="Search medicines, brands, or categories..."
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-1.5 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {showSearchDropdown && searchTerm && (
              <div className="absolute left-0 right-0 top-full z-[100] mt-3 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
                {results.length > 0 ? (
                  <>
                    <div className="bg-gray-50 px-4 py-2 text-[10px] font-black uppercase italic tracking-widest text-gray-400">
                      Search Results
                    </div>
                    {results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSearchSelect(product._id)}
                        className="group/item flex cursor-pointer items-center justify-between px-4 py-4 transition-colors hover:bg-blue-50"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <img
                            src={product.image}
                            className="h-10 w-10 rounded-md border bg-white p-1 object-contain shadow-sm"
                            alt={product.name}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-black uppercase leading-none tracking-tighter text-gray-800 transition-colors group-hover/item:text-blue-600">
                              {product.name}
                            </p>
                            <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-widest text-gray-400">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                        <div className="ml-3 text-right">
                          <p className="text-sm font-black italic tracking-tighter text-blue-600">₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-[10px] font-black uppercase italic tracking-[3px] text-gray-300">
                    No Inventory Matches
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
            <button
              type="button"
              onClick={openMobileSearch}
              className="rounded-full bg-gray-50 p-2 transition-colors hover:bg-blue-50 md:hidden"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-700 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user ? (
              <div
                className="relative hidden md:block"
                ref={userMenuRef}
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <button className="group flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-black uppercase text-white shadow-lg transition-colors group-hover:bg-blue-600">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden text-left lg:block">
                    <p className="text-[10px] font-black uppercase italic leading-none tracking-tighter text-gray-900">
                      {user.name?.split(' ')[0]}
                    </p>
                    <p className="mt-0.5 text-[8px] font-black uppercase tracking-widest text-blue-600">
                      Verified
                    </p>
                  </div>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full z-[110] mt-0 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-2xl">
                    {user.isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        className="group flex items-center gap-3 bg-gray-900 px-5 py-4 text-[10px] font-black uppercase text-white transition-all hover:bg-blue-600"
                      >
                        <span className="text-lg transition-transform group-hover:rotate-12">⚙️</span>
                        Command Console
                      </Link>
                    )}

                    <Link to="/profile" className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 text-[10px] font-black  text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600">👤 User Profile</Link>
                    <Link to="/my-orders" className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 text-[10px] font-black  text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600">📦 MyOrders</Link>
                    <Link to="/wishlist" className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 text-[10px] font-black  text-gray-600 transition-all hover:bg-blue-50 hover:text-blue-600">❤️ Wishlist</Link>
                    <button onClick={handleLogoutAction} className="flex w-full items-center gap-3 px-5 py-3.5 text-[10px] font-black  text-red-500 transition-all hover:bg-red-50">🔌 Secure Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden rounded-full bg-gray-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-[2px] text-white shadow-md transition-all hover:bg-blue-600 md:inline-block lg:px-7">
                Login
              </Link>
            )}

            <Link to="/cart" className="group relative">
              <div className="rounded-full bg-gray-50 p-2 sm:p-2.5 transition-colors group-hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700 transition-transform group-hover:scale-110 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              {user && cartItems?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#fb641b] text-[9px] font-black text-white shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-[80] bg-white border-b border-gray-100 px-3 py-2 shadow-sm transition-all duration-300 ${
          showMobileSearchBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative" ref={mobileStickySearchRef}>
          <div className="flex items-center gap-2">
            <button
              onClick={closeMobileSearch}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white"
              aria-label="Close search"
            >
              <span className="text-xl leading-none text-gray-700">←</span>
            </button>

            <div className="relative flex-1">
              <input
                id="mobile-sticky-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Search medicines, brands, or categories..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-1.5 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {showSearchDropdown && searchTerm && (
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
              {results.length > 0 ? (
                results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSearchSelect(product._id)}
                    className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-blue-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={product.image}
                        className="h-9 w-9 rounded-md border bg-white p-1 object-contain"
                        alt={product.name}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-black uppercase leading-none tracking-tight text-gray-800">
                          {product.name}
                        </p>
                        <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-widest text-gray-400">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-xs font-black italic text-blue-600">₹{product.price}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[10px] font-black uppercase tracking-[2px] text-gray-300">
                  No Inventory Matches
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
                <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">
                  Menu
                </h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 px-4 py-5">
                <div className="flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-2xl bg-blue-50 px-4 py-4 text-sm font-black  text-blue-700"
                      >
                        👤 Profile
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-2xl px-4 py-4 text-sm font-black  text-gray-700 hover:bg-gray-50"
                      >
                        📦 MyOrders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-2xl px-4 py-4 text-sm font-black  text-gray-700 hover:bg-gray-50"
                      >
                        ❤️ Wishlist
                      </Link>

                      <button
                        onClick={handleLogoutAction}
                        className="rounded-2xl px-4 py-4 text-left text-sm font-black  text-red-500 hover:bg-red-50"
                      >
                        🔌 Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-gray-900 px-4 py-4 text-center text-sm font-black uppercase text-white"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>

              {user && (
                <div className="border-t border-gray-100 p-4">
                  <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg">
                    <p className="text-lg font-black">
                      {user.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blue-100">
                      Verified User
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] border-t border-gray-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold ${
              isActive('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span>Home</span>
          </Link>

          <Link
            to="/care-plan"
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold ${
              isActive('/care-plan') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🛡️</span>
            <span>Health Plan</span>
          </Link>

          <button
            type="button"
            onClick={handleOffersClick}
            className="flex flex-col items-center justify-center py-2 text-[10px] font-bold text-[#b66a1e]"
          >
            <div className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-[#f7e3c5] text-center text-[11px] font-black leading-tight shadow-md">
              Extra
            </div>
          </button>

          <Link
            to="/lab-tests"
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold ${
              isActive('/lab-tests') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🧪</span>
            <span>Lab Tests</span>
          </Link>

          <Link
            to={user ? '/profile' : '/login'}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold ${
              isActive('/profile') || isActive('/login') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">👤</span>
            <span>Profile</span>
          </Link>
        </div>
      </div>

      <div className="h-16 md:hidden" />
    </>
  );
};

export default Navbar;