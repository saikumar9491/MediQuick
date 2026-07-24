import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Search, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomTabBar = ({ onSearchTabClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useAuth();
  
  const currentPath = location.pathname;
  const totalCartQty = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const tabs = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Categories', icon: LayoutGrid, path: '/categories' },
    { label: 'Search', icon: Search, path: '/search', isSearch: true },
    { label: 'Account', icon: User, path: user ? '/profile' : '/login', isAccount: true },
    { label: 'Cart', icon: ShoppingCart, path: '/cart', isCart: true },
  ];

  const handleTabClick = (tab, e) => {
    e.preventDefault();
    if (tab.isSearch) {
      if (onSearchTabClick) {
        onSearchTabClick();
      } else {
        navigate('/medicines');
      }
      return;
    }

    if (tab.isAccount) {
      navigate(user ? '/profile' : '/login');
      return;
    }

    navigate(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex items-center justify-around pb-safe select-none touch-manipulation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.isSearch 
          ? currentPath === '/search'
          : tab.isAccount
            ? (currentPath === '/profile' || currentPath === '/login' || currentPath === '/signup')
            : tab.path === '/' 
              ? currentPath === '/' 
              : currentPath.startsWith(tab.path);

        const activeColor = 'text-[#0057FF]';
        const inactiveColor = 'text-slate-500';

        return (
          <button
            key={tab.label}
            type="button"
            onClick={(e) => handleTabClick(tab, e)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all active:scale-95 cursor-pointer touch-manipulation ${
              isActive ? activeColor : inactiveColor
            }`}
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {tab.isCart && totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#EF4444] text-white font-extrabold text-[9px] h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalCartQty}
                </span>
              )}
            </div>
            <span className={`text-[9.5px] tracking-wider mt-1 uppercase ${isActive ? 'font-black' : 'font-bold'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomTabBar;
