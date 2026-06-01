import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, FlaskConical, Stethoscope, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'HOME', icon: Home, exact: true },
    { path: '/medicines', label: 'MEDICINES', icon: ShoppingBag },
    { path: '/lab-tests', label: 'LAB TESTS', icon: FlaskConical },
    { path: '/consult', label: 'CONSULT', icon: Stethoscope },
    { path: '/profile', label: 'ACCOUNT', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 px-2 py-2 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact 
          ? currentPath === item.path 
          : currentPath === item.path || currentPath.startsWith(item.path + '/');
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 gap-1 ${
              isActive ? 'text-[#00a2a4]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-center">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
