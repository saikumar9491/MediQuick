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
    <div className="fixed left-0 top-0 z-[60] h-full w-20 flex flex-col border-r border-slate-100 bg-white/80 backdrop-blur-2xl transition-all hover:w-64 group">
      <div className="flex h-20 items-center justify-center border-b border-slate-100 px-6">
        <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 shadow-lg shadow-blue-500/20">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <span className="ml-4 overflow-hidden whitespace-nowrap text-xl font-bold tracking-tight text-slate-800 opacity-0 transition-opacity group-hover:opacity-100">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center rounded-xl p-3 transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 translate-x-1' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 hover:translate-x-1'
            }`}
          >
            <item.icon className={`h-5 w-5 min-w-[20px] ${activeTab === item.id ? 'text-white' : item.color}`} />
            <span className="ml-4 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
            {activeTab === item.id && (
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button className="flex w-full items-center rounded-xl p-3 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 hover:translate-x-1">
          <LogOut className="h-5 w-5 min-w-[20px]" />
          <span className="ml-4 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
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
