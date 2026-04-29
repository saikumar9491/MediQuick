import React from 'react';
import { 
  LayoutDashboard,
  TrendingUp,
  Users,
  Bell,
  Activity,
  Zap,
  Package,
  Award,
  ShieldCheck,
  Settings,
  History,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'flash', label: 'Flash Deals', icon: Zap },
    { id: 'brands', label: 'Brands', icon: Award },
    { id: 'orders', label: 'Orders', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'Logs', icon: History },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 mt-4">
      <div className="flex items-center px-2 py-2 overflow-x-auto custom-scrollbar">
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === item.id 
                ? 'bg-[#10b981] text-white shadow-md shadow-emerald-500/20' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
