import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Truck, 
  Tag, 
  Star, 
  BarChart2, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Shield,
  Search,
  User,
  Activity,
  Layers,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, activeTab, setActiveTab, activeSubTab, setActiveSubTab, stats }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    const cached = localStorage.getItem('mq_admin_theme');
    return cached || 'light';
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-900', 'text-slate-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-900', 'text-slate-100');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('mq_admin_theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      hasSubmenu: true,
      openState: productsOpen,
      setOpenState: setProductsOpen,
      submenus: [
        { id: 'all-products', label: 'All Products', icon: Layers },
        { id: 'add-product', label: 'Add Product', icon: ChevronRight },
        { id: 'categories', label: 'Categories', icon: Activity },
        { id: 'inventory', label: 'Inventory', icon: ChevronRight },
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      hasSubmenu: true,
      openState: ordersOpen,
      setOpenState: setOrdersOpen,
      submenus: [
        { id: 'all-orders', label: 'All Orders', icon: ChevronRight },
        { id: 'pending-orders', label: 'Pending', icon: Clock },
        { id: 'processing-orders', label: 'Processing', icon: RefreshCw },
        { id: 'shipped-orders', label: 'Shipped', icon: Truck },
        { id: 'delivered-orders', label: 'Delivered', icon: CheckCircle2 },
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: Truck,
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: Tag,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: stats?.lowStockCount || 0
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const handleTabClick = (tabId, item) => {
    if (item.hasSubmenu) {
      item.setOpenState(!item.openState);
    } else {
      setActiveTab(tabId);
      setActiveSubTab('');
      setMobileSidebarOpen(false);
    }
  };

  const handleSubTabClick = (tabId, subId) => {
    setActiveTab(tabId);
    setActiveSubTab(subId);
    setMobileSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1E293B] text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 bg-[#0F172A]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-md font-black tracking-tight text-white">MediQuick<span className="text-blue-500"> Admin</span></h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Store Management</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="hidden lg:block text-slate-400 hover:text-white transition-colors">
          <ChevronRight className={`h-5 w-5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
        {menuItems.map((item) => {
          const isTabActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => handleTabClick(item.id, item)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isTabActive && !item.hasSubmenu
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`h-4.5 w-4.5 ${isTabActive && !item.hasSubmenu ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
                {sidebarOpen && (
                  <div className="flex items-center gap-2">
                    {item.badge > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-[#1E293B] animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.hasSubmenu && (
                      item.openState ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu rendering */}
              {item.hasSubmenu && item.openState && sidebarOpen && (
                <div className="pl-8 space-y-1">
                  {item.submenus.map((sub) => {
                    const isSubActive = activeTab === item.id && activeSubTab === sub.id;
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubTabClick(item.id, sub.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isSubActive
                            ? 'bg-slate-700/60 text-white font-bold'
                            : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                        }`}
                      >
                        <SubIcon className="h-3.5 w-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-700/50 bg-[#0F172A]/40">
        {sidebarOpen && user && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-blue-500 font-bold border border-slate-600 shadow-sm flex-shrink-0">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name || 'Admin User'}</p>
              <span className="inline-block px-1.5 py-0.5 rounded-md bg-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-wider mt-0.5">
                {user.role || 'Super Admin'}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all`}
        >
          <LogOut className="h-4.5 w-4.5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex text-slate-850 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block h-screen sticky top-0 border-r border-slate-200/50 dark:border-slate-800 shadow-sm transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
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
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-[#1E293B] shadow-2xl z-50 overflow-hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-200 transition-all active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search orders, products, audits..."
                className="w-80 pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm/5 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Low stock notice shortcut */}
            {stats?.lowStockCount > 0 && (
              <div 
                onClick={() => handleTabClick('notifications', {})}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-amber-100 transition-all select-none"
              >
                <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
                <span>{stats.lowStockCount} Low Stock Alert(s)</span>
              </div>
            )}

            {/* Profile Dropdown Simulation */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-slate-700">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:block">
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
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
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
