import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Package, PlusCircle, ShoppingCart, Monitor,
  Truck, MapPin, AlertTriangle, RefreshCw, Briefcase,
  Tag, Zap, Megaphone, ShoppingBag, Cpu, Bell, SplitSquareHorizontal,
  Users, MessageSquare, Star, Search, LifeBuoy,
  AlertOctagon, Radio, Eye, BarChart2, Settings,
  LogOut, Menu, ChevronRight, Home, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const SidebarContent = ({ sidebarOpen, toggleSidebar, activeTab, handleTabClick, handleLogout, menuGroups }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  // Initialize expanded groups based on active tab
  useEffect(() => {
    const initialExpanded = {};
    menuGroups.forEach(group => {
      // Default to expanded if it contains the active tab, or if it's the Core Commerce (first group)
      const hasActiveTab = group.items.some(item => item.id === activeTab);
      initialExpanded[group.title] = hasActiveTab || group.title === 'Core Commerce';
    });
    setExpandedGroups(initialExpanded);
  }, [activeTab, menuGroups]);

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-700 border-r border-slate-200/80">
    {/* Brand Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 bg-[#065F60] text-white">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500 text-white font-black text-sm flex-shrink-0">
          M
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-white">Midiquick</h1>
            <p className="text-[9px] font-bold text-teal-200 tracking-widest uppercase">Admin Control Hub</p>
          </div>
        )}
      </div>
      {sidebarOpen && (
        <button onClick={toggleSidebar} className="hidden lg:block text-teal-200 hover:text-white transition-colors">
          <ChevronRight className={`h-4.5 w-4.5 transform transition-transform rotate-180`} />
        </button>
      )}
    </div>

    {/* Navigation Links */}
    <div className="flex-1 overflow-y-auto px-3.5 py-6 space-y-2 custom-scrollbar text-xs font-semibold">
      {menuGroups.map((group, groupIndex) => {
        const isExpanded = expandedGroups[group.title];
        
        return (
          <div key={groupIndex} className="space-y-1">
            {sidebarOpen && group.title !== 'Footer' && (
              <button 
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                <span>{group.title}</span>
                <ChevronDown className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            
            <div className={`space-y-1 ${!isExpanded && sidebarOpen && group.title !== 'Footer' ? 'hidden' : 'block'}`}>
              {group.items.map((item) => {
                const isTabActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      isTabActive
                        ? 'bg-teal-50 text-teal-700 font-bold border-l-4 border-teal-500 rounded-l-none'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${isTabActive ? 'text-teal-600' : 'text-slate-400'}`} />
                      {sidebarOpen && <span>{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>

    {/* Footer Profile & Logout */}
    <div className="p-4 border-t border-slate-200/80 bg-slate-50/30">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[11px] font-semibold text-rose-500 hover:bg-rose-50 transition-all"
      >
        <LogOut className="h-4.5 w-4.5" />
        {sidebarOpen && <span>Sign Out</span>}
      </button>
    </div>
  </div>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract active tab from URL path (e.g. /admin/orders -> orders)
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] === 'admin' ? 'overview' : pathParts[pathParts.length - 1];

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-slate-900', 'text-slate-100');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const newState = !prev;
      localStorage.setItem('adminSidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const menuGroups = [
    {
      title: 'Core Commerce',
      items: [
        { id: 'overview', label: 'Command Center', icon: Activity },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'add-product', label: 'Add Product', icon: PlusCircle },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'pos-terminal', label: 'POS Terminal', icon: Monitor },
      ]
    },
    {
      title: 'Operations & Logistics',
      items: [
        { id: 'logistics', label: 'Logistics', icon: Truck },
        { id: 'live-radar', label: 'Live Radar', icon: MapPin },
        { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
        { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
        { id: 'fleet', label: 'Fleet Console', icon: Briefcase },
      ]
    },
    {
      title: 'Marketing & Growth',
      items: [
        { id: 'coupons', label: 'Coupons', icon: Tag },
        { id: 'flash-sales', label: 'Flash Sales', icon: Zap },
        { id: 'marketing', label: 'Marketing', icon: Megaphone },
        { id: 'abandoned-cart', label: 'Abandoned Cart', icon: ShoppingBag },
        { id: 'ai-pricing', label: 'AI Pricing Engine', icon: Cpu },
        { id: 'notifications-composer', label: 'Notification Composer', icon: Bell },
        { id: 'ab-testing', label: 'A/B Testing', icon: SplitSquareHorizontal },
      ]
    },
    {
      title: 'Engagement & Support',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'search-discovery', label: 'Search Discovery', icon: Search },
        { id: 'support-console', label: 'Support Console', icon: LifeBuoy },
      ]
    },
    {
      title: 'Business Intelligence',
      items: [
        { id: 'inventory-alerts', label: 'Inventory Alerts', icon: AlertOctagon },
      ]
    },
    {
      title: 'Security & Intelligence',
      items: [
        { id: 'live-ops', label: 'Live Ops', icon: Radio },
        { id: 'xray-monitor', label: 'X-Ray Monitor', icon: Eye },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      ]
    },
    {
      title: 'Footer',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleTabClick = (tabId) => {
    navigate(`/admin/${tabId}`);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex text-slate-800 antialiased font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:block h-screen sticky top-0 shadow-sm transition-all duration-300 z-30 flex-shrink-0 ${
          (sidebarOpen || isHovered) ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent 
          sidebarOpen={sidebarOpen || isHovered}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          handleLogout={handleLogout}
          menuGroups={menuGroups}
        />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 overflow-hidden"
            >
              <SidebarContent 
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activeTab={activeTab}
                handleTabClick={handleTabClick}
                handleLogout={handleLogout}
                menuGroups={menuGroups}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <div id="main-content-scroll" className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white z-20 px-6 py-4 flex items-center justify-between border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  toggleSidebar();
                } else {
                  setMobileSidebarOpen(true);
                }
              }}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search hub..."
                className="w-64 pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4.5">
            {/* Go back to Home */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer mr-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden md:inline">View Live Store</span>
            </button>

            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all relative">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700">Admin Profile</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-teal-600">Superadmin</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                className="h-9 w-9 rounded-full border-2 border-slate-100 shadow-sm object-cover" 
                alt="Admin Profile"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
