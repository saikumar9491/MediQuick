import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  Image as ImageIcon, 
  Award, 
  LayoutDashboard,
  LogOut,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'text-blue-500' },
    { id: 'users', label: 'User Base', icon: Users, color: 'text-purple-500' },
    { id: 'banners', label: 'Banners', icon: ImageIcon, color: 'text-green-500' },
    { id: 'brands', label: 'Featured Brands', icon: Award, color: 'text-orange-500' },
  ];

  return (
    <div className="fixed left-0 top-0 z-[60] h-full w-20 flex-col border-r border-white/10 bg-white/80 backdrop-blur-xl transition-all hover:w-64 group sm:flex hidden">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
        <LayoutDashboard className="h-8 w-8 text-[#2874f0]" />
        <span className="ml-4 overflow-hidden whitespace-nowrap text-lg font-black uppercase italic tracking-tighter text-gray-800 opacity-0 transition-opacity group-hover:opacity-100">
          Amritsar Hub
        </span>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center rounded-xl p-3 transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-[#2874f0] text-white shadow-lg shadow-blue-500/30' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            <item.icon className="h-6 w-6 min-w-[24px]" />
            <span className="ml-4 overflow-hidden whitespace-nowrap text-xs font-black uppercase italic tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
            {activeTab === item.id && (
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center rounded-xl p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
          <LogOut className="h-6 w-6 min-w-[24px]" />
          <span className="ml-4 overflow-hidden whitespace-nowrap text-xs font-black uppercase italic tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
            System Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
