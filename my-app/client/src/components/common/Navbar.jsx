import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ medicines = [] }) => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // 1. Search Logic: Filters by Name, Brand, or Category
  const results = Array.isArray(medicines) ? medicines.filter(m => {
    if (!searchTerm) return false;
    const nameMatch = m.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const brandMatch = m.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = m.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || brandMatch || categoryMatch;
  }).slice(0, 6) : [];

  // 2. Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSearchDropdown(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutAction = () => {
    logout(); 
    toast.success("Securely Logged Out");
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-gray-50 sticky top-0 z-50 shadow-sm h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-8">
        
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center group relative">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-[10deg] transition-all duration-300">
               <span className="text-xl font-black tracking-tighter italic">M</span>
               <span className="text-green-400 font-bold text-lg leading-none">+</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          <div className="ml-3">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Medi<span className="text-blue-600">Quick</span>
            </h1>
            <div className="h-1 w-full bg-blue-600 rounded-full mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        </Link>

        {/* SEARCH ENGINE */}
        <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { 
                setSearchTerm(e.target.value); 
                setShowSearchDropdown(true); 
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-gray-50 rounded-full px-6 py-3 outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white text-sm transition-all font-medium pr-12 shadow-inner"
              placeholder="Search medicines, brands, or categories..."
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* SEARCH DROPDOWN */}
          {showSearchDropdown && searchTerm && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl mt-3 shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
              {results.length > 0 ? (
                <>
                  <div className="p-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 italic">Hub Analysis Results</div>
                  {results.map(product => (
                    <div 
                      key={product._id} 
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        setSearchTerm("");
                        setShowSearchDropdown(false);
                      }}
                      className="px-4 py-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors group/item"
                    >
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-10 h-10 object-contain bg-white rounded-md p-1 border shadow-sm" alt="" />
                        <div>
                          <p className="font-black text-gray-800 text-xs uppercase tracking-tighter leading-none group-hover/item:text-blue-600 transition-colors">{product.name}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-black text-sm italic tracking-tighter">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-6 text-center text-gray-300 text-[10px] font-black uppercase italic tracking-[3px]">
                  No Inventory Matches
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-8">
          {user ? (
            <div 
              className="relative" 
              ref={userMenuRef} 
              onMouseEnter={() => setShowUserDropdown(true)} 
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-xs uppercase shadow-lg group-hover:bg-blue-600 transition-colors">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-none italic">{user.name.split(' ')[0]}</p>
                  <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest mt-0.5 animate-pulse">Verified</p>
                </div>
              </button>

              {/* USER / ADMIN DROPDOWN */}
              {showUserDropdown && (
                <div className="absolute top-full right-0 w-60 bg-white border border-gray-100 rounded-xl mt-0 shadow-2xl overflow-hidden py-2 z-[110] animate-in zoom-in-95 duration-150">
                   
                   {/* ADMIN CONSOLE LINK (Conditional) */}
                   {user.isAdmin && (
                      <Link to="/admin-dashboard" className="flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase text-white bg-gray-900 hover:bg-blue-600 transition-all border-b border-white/10 group">
                        <span className="text-lg group-hover:rotate-12 transition-transform">⚙️</span> Command Console
                      </Link>
                   )}

                   <Link to="/profile" className="flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all border-b border-gray-50">👤 User Profile</Link>
                   <Link to="/my-orders" className="flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all border-b border-gray-50">📦 My Logistics</Link>
                   <Link to="/wishlist" className="flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all border-b border-gray-50">❤️ Wishlist</Link>
                   <button onClick={handleLogoutAction} className="w-full flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-all">🔌 Secure Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-gray-900 text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[2px] hover:bg-blue-600 shadow-md transition-all active:scale-95">Login</Link>
          )}
          
          {/* CART BUTTON */}
          <Link to="/cart" className="relative group">
            <div className="bg-gray-50 p-3 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            {/* Show badge only for logged-in users with items */}
            {user && cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#fb641b] text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;