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
  Moon,
  Mail,
  Sliders,
  FileText,
  Briefcase,
  Heart,
  Grid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, activeTab, setActiveTab, activeSubTab, setActiveSubTab, stats }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('bg-slate-900', 'text-slate-100');
  }, []);

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
      badge: 'Hot',
      badgeColor: 'bg-rose-500'
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
      badge: stats?.lowStockCount > 0 ? stats.lowStockCount : '100+',
      badgeColor: stats?.lowStockCount > 0 ? 'bg-orange-500' : 'bg-orange-500'
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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-r border-slate-200/80 dark:border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 bg-[#2D3748] text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white font-black text-sm">
            E
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-white">Empire</h1>
            <p className="text-[9px] font-bold text-slate-300 tracking-widest uppercase">Admin System</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="hidden lg:block text-slate-300 hover:text-white transition-colors">
          <ChevronRight className={`h-4.5 w-4.5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-6 space-y-1 custom-scrollbar text-xs font-semibold">
        {menuItems.map((item) => {
          const isTabActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => handleTabClick(item.id, item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  isTabActive && !item.hasSubmenu
                    ? 'bg-orange-50 dark:bg-[#2D3748] text-orange-600 dark:text-orange-400 font-bold border-l-4 border-orange-500 rounded-l-none'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 ${isTabActive && !item.hasSubmenu ? 'text-orange-500' : 'text-slate-400'}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
                {sidebarOpen && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black text-white ${item.badgeColor || 'bg-blue-500'}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.hasSubmenu && (
                      item.openState ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu rendering */}
              {item.hasSubmenu && item.openState && sidebarOpen && (
                <div className="pl-8 space-y-0.5 border-l border-slate-100 ml-5">
                  {item.submenus.map((sub) => {
                    const isSubActive = activeTab === item.id && activeSubTab === sub.id;
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubTabClick(item.id, sub.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[11px] transition-all ${
                          isSubActive
                            ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-50/50'
                            : 'hover:bg-slate-50/50 text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        <SubIcon className="h-3.5 w-3.5 text-slate-450" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Collapsible Headers */}
        {sidebarOpen && (
          <div className="pt-6 space-y-3">
            <h3 className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Admin Panels</h3>
            {['Hospital', 'Membership', 'Helpdesk', 'School', 'SIS', 'Crypto'].map(menu => (
              <div key={menu} className="flex items-center justify-between px-3 py-1 text-slate-550 hover:text-slate-800 cursor-pointer">
                <span className="text-[11px] font-semibold">{menu}</span>
                <ChevronRight className="h-3 w-3 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[11px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
        >
          <LogOut className="h-4.5 w-4.5" />
          {sidebarOpen && <span>Logout Panel</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block h-screen sticky top-0 shadow-sm transition-all duration-300 z-30 flex-shrink-0 ${
          sidebarOpen ? 'w-60' : 'w-20'
        }`}
      >
        <SidebarContent />
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
              className="lg:hidden fixed inset-y-0 left-0 w-60 bg-white shadow-2xl z-50 overflow-hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-[#2D3748] z-20 px-6 py-4 flex items-center justify-between text-white border-b border-[#1A202C]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-9 pr-4 py-1.5 text-xs bg-[#1A202C]/60 rounded border border-[#4A5568] focus:outline-none focus:border-orange-500 focus:bg-[#1A202C] transition-all text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4.5">


            {/* Mail Icon */}
            <button className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50 transition-all relative">
              <Mail className="h-4.5 w-4.5" />
            </button>

            {/* Bell Notification */}
            <button className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50 transition-all relative">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-orange-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700">
              <span className="text-xs font-semibold text-slate-200 hidden sm:block">
                Cindy Deitch
              </span>
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                className="h-8 w-8 rounded-full border border-slate-500 object-cover" 
                alt="Cindy Deitch Profile"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto bg-[#F8FAFC]">
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
