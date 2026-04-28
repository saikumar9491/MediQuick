import React from 'react';
import { 
  Package, 
  Users, 
  Image as ImageIcon, 
  Award, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Zap,
  Briefcase,
  Trophy,
  ShoppingBag
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'products', label: 'Products', icon: Package, color: 'text-blue-500' },
    { id: 'users', label: 'User Base', icon: Users, color: 'text-purple-500' },
    { id: 'banners', label: 'Banners', icon: ImageIcon, color: 'text-green-500' },
    { id: 'flash', label: 'Flash Deals', icon: Zap, color: 'text-orange-500' },
    { id: 'services', label: 'Quick Services', icon: Briefcase, color: 'text-teal-500' },
    { id: 'brands', label: 'Featured Brands', icon: Award, color: 'text-rose-500' },
    { id: 'bestsellers', label: 'Bestsellers', icon: Trophy, color: 'text-amber-500' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, color: 'text-indigo-500' },
  ];

  return (
    <div className="fixed left-0 top-0 z-[60] h-full w-20 flex flex-col border-r border-gray-100 bg-white/90 backdrop-blur-xl transition-all hover:w-64 group">
      <div className="flex h-20 items-center justify-center border-b border-gray-50 px-6">
        <LayoutDashboard className="h-8 w-8 text-[#2874f0] animate-pulse" />
        <span className="ml-4 overflow-hidden whitespace-nowrap text-lg font-black uppercase italic tracking-tighter text-gray-800 opacity-0 transition-opacity group-hover:opacity-100">
          Amritsar Hub
        </span>
      </div>

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center rounded-xl p-3 transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-[#2874f0] text-white shadow-lg shadow-blue-500/30 transform scale-105' 
              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <item.icon className={`h-6 w-6 min-w-[24px] ${activeTab === item.id ? 'text-white' : item.color}`} />
            <span className="ml-4 overflow-hidden whitespace-nowrap text-xs font-black uppercase italic tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
            {activeTab === item.id && (
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-50 p-4">
        <button className="flex w-full items-center rounded-xl p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
          <LogOut className="h-6 w-6 min-w-[24px]" />
          <span className="ml-4 overflow-hidden whitespace-nowrap text-xs font-black uppercase italic tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
            System Logout
          </span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
