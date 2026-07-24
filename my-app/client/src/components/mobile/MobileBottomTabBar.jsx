import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MobileBottomTabBar = ({ onSearchTabClick }) => {
  const location = useLocation();
  const { cartItems } = useCart();
  const currentPath = location.pathname;

  const totalCartQty = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const tabs = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Categories', icon: LayoutGrid, path: '/categories' },
    { label: 'Search', icon: Search, path: '/search', isSearch: true },
    { label: 'Account', icon: User, path: '/profile' },
    { label: 'Cart', icon: ShoppingCart, path: '/cart', isCart: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] flex items-center justify-around pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.isSearch 
          ? currentPath === '/search'
          : tab.path === '/' 
            ? currentPath === '/' 
            : currentPath.startsWith(tab.path);

        const activeColor = 'text-[#00a2a4]';
        const inactiveColor = 'text-slate-500';

        if (tab.isSearch && onSearchTabClick) {
          return (
            <button
              key={tab.label}
              onClick={onSearchTabClick}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? activeColor : inactiveColor
              }`}
            >
              <div className="relative flex items-center justify-center h-6 w-6">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-black tracking-wider mt-1 uppercase">{tab.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={tab.label}
            to={tab.isSearch ? '#' : tab.path}
            onClick={tab.isSearch && onSearchTabClick ? onSearchTabClick : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? activeColor : inactiveColor
            }`}
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {tab.isCart && totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-extrabold text-[9px] h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalCartQty}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black tracking-wider mt-1 uppercase">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomTabBar;
