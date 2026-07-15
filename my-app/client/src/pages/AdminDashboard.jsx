import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Users, 
  Activity, 
  Plus, 
  Zap,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Edit3,
  Eye,
  FileText,
  Bell,
  TrendingUp,
  AlertTriangle,
  Printer,
  ChevronRight,
  Sparkles,
  DollarSign,
  ShoppingCart,
  Percent,
  CheckCircle,
  Clock,
  RefreshCw,
  Truck,
  CreditCard,
  Settings as SettingsIcon,
  Tag,
  Star,
  MapPin,
  Save,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import AdminBannerManager from '../components/admin/AdminBannerManager';
import AddBrandModal from '../components/admin/AddBrandModal';
import EmailUserModal from '../components/admin/EmailUserModal';
import AdminCategoryManager from '../components/admin/AdminCategoryManager';
import InvoiceTemplate from '../components/admin/InvoiceTemplate';
import AdminLayout from '../components/admin/AdminLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';

// ================= CUSTOM SVG GRAPHICS (ZERO DEPENDENCY RESPONSIVE CHARTS) =================
const SVGLineChart = ({ data, color = "#2563EB" }) => {
  if (!data || data.length === 0) return (
    <div className="flex h-48 items-center justify-center text-xs font-semibold text-slate-400">No chart data available</div>
  );
  
  const width = 500;
  const height = 200;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const yValues = data.map(d => d.value);
  const maxY = Math.max(...yValues, 100);
  const minY = 0;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.value - minY) / (maxY - minY)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `${padding},${padding + chartHeight}`,
    ...data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - minY) / (maxY - minY)) * chartHeight;
      return `${x},${y}`;
    }),
    `${padding + chartWidth},${padding + chartHeight}`
  ].join(' ');

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + r * chartHeight;
          const val = Math.round(maxY - r * (maxY - minY));
          return (
            <g key={idx} className="opacity-5">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#000" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[8px] font-bold fill-slate-800">{val}</text>
            </g>
          );
        })}
        {/* Fill Area */}
        <polygon points={areaPoints} fill="url(#lineChartGradient)" />
        {/* Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Interactive Circles */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth;
          const y = padding + chartHeight - ((d.value - minY) / (maxY - minY)) * chartHeight;
          return (
            <g key={i} className="group cursor-pointer">
              <circle cx={x} cy={y} r="3.5" className="fill-white stroke-[2.5px] transition-all hover:r-5" stroke={color} />
              <title>{`${d.label}: ₹${d.value}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SVGBarChart = ({ data, color = "#2563EB" }) => {
  if (!data || data.length === 0) return (
    <div className="flex h-48 items-center justify-center text-xs font-semibold text-slate-400">No chart data available</div>
  );

  const width = 500;
  const height = 200;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const yValues = data.map(d => d.value);
  const maxY = Math.max(...yValues, 10);
  const minY = 0;

  const barWidth = (chartWidth / data.length) * 0.6;
  const barSpacing = (chartWidth / data.length) * 0.4;

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + r * chartHeight;
          const val = Math.round(maxY - r * (maxY - minY));
          return (
            <g key={idx} className="opacity-5">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#000" strokeWidth="1" />
              <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[8px] font-bold fill-slate-800">{val}</text>
            </g>
          );
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
          const barHeight = ((d.value - minY) / (maxY - minY)) * chartHeight;
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={i} className="group cursor-pointer">
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="2" fill={color} className="opacity-90 hover:opacity-100 transition-opacity" />
              <text x={x + barWidth / 2} y={height - padding + 12} textAnchor="middle" className="text-[8px] font-bold fill-slate-400">{d.label}</text>
              <title>{`${d.label}: ${d.value}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('');
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'MediQuick+',
    shippingCharges: 40,
    tax: 18,
    paymentGateway: 'Razorpay',
    emailSettings: { smtpServer: 'smtp-brevo.com', smtpPort: 587, senderEmail: 'admin@mediquick.com' }
  });

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Inline/Quick Add form fields for nested tab: Add Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Vitamins',
    brand: '',
    price: '',
    discountPrice: '',
    countInStock: '',
    image: '',
    isTrending: false,
    isFlashDeal: false
  });

  // Inline Add Coupon form fields
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    expiryDate: ''
  });

  // Inline Settings form fields
  const [settingsForm, setSettingsForm] = useState({
    storeName: '',
    logo: '',
    banner: '',
    shippingCharges: '',
    tax: '',
    paymentGateway: '',
    smtpServer: '',
    smtpPort: '',
    senderEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('All');
  const { user, token } = useAuth();

  const printAreaRef = useRef();

  // Load Data
  const fetchData = useCallback(() => {
    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE}/api/medicines`).then(res => res.json()),
      fetch(`${API_BASE}/api/users`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/api/orders`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/api/coupons`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/api/reviews`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/api/banners`).then(res => res.json()),
      fetch(`${API_BASE}/api/brands`).then(res => res.json()),
      fetch(`${API_BASE}/api/settings`).then(res => res.json())
    ])
      .then(([meds, usr, ord, cpn, rev, ban, brd, set]) => {
        setInventory(Array.isArray(meds) ? meds : []);
        setUsers(Array.isArray(usr) ? usr : []);
        setOrders(Array.isArray(ord) ? ord : []);
        setCoupons(Array.isArray(cpn) ? cpn : []);
        setReviews(Array.isArray(rev) ? rev : []);
        setBanners(Array.isArray(ban) ? ban : []);
        setBrands(Array.isArray(brd) ? brd : []);
        if (set && !set.message) {
          setSettings(set);
          setSettingsForm({
            storeName: set.storeName || '',
            logo: set.logo || '',
            banner: set.banner || '',
            shippingCharges: set.shippingCharges || '',
            tax: set.tax || '',
            paymentGateway: set.paymentGateway || '',
            smtpServer: set.emailSettings?.smtpServer || '',
            smtpPort: set.emailSettings?.smtpPort || '',
            senderEmail: set.emailSettings?.senderEmail || ''
          });
        }
      })
      .catch(err => {
        console.error('Error fetching admin dashboard data', err);
        toast.error('Failed to sync database. Rendering offline models.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Operations for Products
  const handleAddNew = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setIsModalOpen(true); };

  const handleSaveProduct = async (productData) => {
    const isEdit = !!editingProduct;
    const url = isEdit ? `${API_BASE}/api/medicines/${editingProduct._id}` : `${API_BASE}/api/medicines/add`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      
      toast.success(isEdit ? 'Product updated successfully!' : 'New product listed!');
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleCreateProductForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/medicines/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      
      toast.success('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        category: 'Vitamins',
        brand: '',
        price: '',
        discountPrice: '',
        countInStock: '',
        image: '',
        isTrending: false,
        isFlashDeal: false
      });
      fetchData();
      setActiveSubTab('all-products');
    } catch (err) {
      toast.error(`Error listing product: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Product purged from store');
        setInventory(prev => prev.filter(m => m._id !== id));
      } else {
        toast.error('Deletion failed');
      }
    } catch (err) { toast.error('Connection failed'); }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ countInStock: Number(newStock) }),
      });
      if (res.ok) {
        toast.success('Stock adjusted');
        setInventory(prev => prev.map(m => m._id === id ? { ...m, countInStock: Number(newStock) } : m));
      }
    } catch (err) { toast.error('Stock adjustment failed'); }
  };

  // Operations for Orders
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        const d = await res.json();
        throw new Error(d.message);
      }
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  // Operations for Coupons
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Coupon listing failed');
      
      toast.success('Promo Coupon Created!');
      setNewCoupon({ code: '', discount: '', expiryDate: '' });
      fetchData();
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleToggleCouponActive = async (id, currentState) => {
    try {
      const res = await fetch(`${API_BASE}/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        toast.success('Coupon status updated');
        setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: !currentState } : c));
      }
    } catch (err) { toast.error('State toggle failed'); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Coupon removed');
        setCoupons(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) { toast.error('Coupon deletion failed'); }
  };

  // Operations for Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          storeName: settingsForm.storeName,
          logo: settingsForm.logo,
          banner: settingsForm.banner,
          shippingCharges: Number(settingsForm.shippingCharges),
          tax: Number(settingsForm.tax),
          paymentGateway: settingsForm.paymentGateway,
          emailSettings: {
            smtpServer: settingsForm.smtpServer,
            smtpPort: Number(settingsForm.smtpPort),
            senderEmail: settingsForm.senderEmail
          }
        }),
      });
      if (res.ok) {
        toast.success('Store configuration saved successfully!');
        fetchData();
      } else {
        throw new Error('Config failed');
      }
    } catch (err) {
      toast.error('Settings update failed');
    }
  };

  // Operations for Customers (Users)
  const handleBlockUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/block`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: data.isBlocked } : u));
      }
    } catch (err) { toast.error('Operation failed'); }
  };

  // Operations for Reviews
  const handleApproveReview = async (medId, revId) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${medId}/${revId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Review approved and visible');
        setReviews(prev => prev.map(r => r._id === revId ? { ...r, isApproved: true } : r));
      }
    } catch (err) { toast.error('Approval failed'); }
  };

  const handleDeleteReview = async (medId, revId) => {
    if (!window.confirm('Permanently delete this review?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${medId}/${revId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Review removed');
        setReviews(prev => prev.filter(r => r._id !== revId));
      }
    } catch (err) { toast.error('Deletion failed'); }
  };

  // Print Invoice Method
  const handlePrintInvoice = () => {
    const printContent = printAreaRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    // Restore page reload to reset react context safely
    window.location.reload();
  };

  // Dynamic calculations for Dashboard metrics
  const completedOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const customersList = users.filter(u => !u.isAdmin);
  const lowStockProducts = inventory.filter(m => m.countInStock < 15);

  // Stats summary object to feed layout
  const statsSummary = {
    lowStockCount: lowStockProducts.length
  };

  // 30 Days timeline calculations for Sales Chart
  const getTimelineData = () => {
    const chartData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      // Filter orders placed on this date
      const dailyOrders = completedOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getDate() === date.getDate() && 
               orderDate.getMonth() === date.getMonth() &&
               orderDate.getFullYear() === date.getFullYear();
      });

      const value = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      chartData.push({ label, value });
    }
    return chartData;
  };

  // Category wise sales calculations
  const getCategorySalesData = () => {
    const categoriesMap = {};
    completedOrders.forEach(o => {
      o.items.forEach(item => {
        const cat = item.productId?.category || 'Standard';
        categoriesMap[cat] = (categoriesMap[cat] || 0) + item.price * item.quantity;
      });
    });
    return Object.keys(categoriesMap).map(k => ({ label: k, value: categoriesMap[k] }));
  };

  // Best Selling Products calculations
  const getBestSellers = () => {
    const productsMap = {};
    completedOrders.forEach(o => {
      o.items.forEach(item => {
        const pid = item.productId?._id;
        if (!pid) return;
        if (!productsMap[pid]) {
          productsMap[pid] = { name: item.name, brand: item.brand, qty: 0, image: item.image };
        }
        productsMap[pid].qty += item.quantity;
      });
    });
    return Object.values(productsMap).sort((a, b) => b.qty - a.qty).slice(0, 4);
  };

  // Dynamic filter lists for Orders
  const getFilteredOrders = () => {
    if (activeSubTab === 'pending-orders') return orders.filter(o => o.status === 'Confirmed');
    if (activeSubTab === 'processing-orders') return orders.filter(o => o.status === 'Shipped'); // shippped/in-transit acting as processing
    if (activeSubTab === 'shipped-orders') return orders.filter(o => o.status === 'Out for Delivery');
    if (activeSubTab === 'delivered-orders') return orders.filter(o => o.status === 'Delivered');
    return orders;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600"
          />
          <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Store Satellite...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      activeSubTab={activeSubTab} 
      setActiveSubTab={setActiveSubTab} 
      stats={statsSummary}
    >
      <AnimatePresence mode="wait">
        {/* ================= TAB 1: DASHBOARD HOME (OVERVIEW) ================= */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Overview Dashboard</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Real-time statistics & store health diagnostics</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Revenue */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</span>
                  <h3 className="text-2xl font-black text-slate-800 leading-none mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" /> +12.4% vs last month
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              {/* Card 2: Orders */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders</span>
                  <h3 className="text-2xl font-black text-slate-800 leading-none mt-2">{orders.length}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" /> +8.3% increase
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>

              {/* Card 3: Customers */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Customers</span>
                  <h3 className="text-2xl font-black text-slate-800 leading-none mt-2">{customersList.length}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" /> +15.2% signup rate
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/50">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {/* Card 4: Products */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products Listed</span>
                  <h3 className="text-2xl font-black text-slate-800 leading-none mt-2">{inventory.length}</h3>
                  <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1 mt-2">
                    Active Catalog
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50">
                  <Package className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sales Trend (Last 30 Days)</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Timeline revenue diagnostics</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg uppercase">Daily Metrics</span>
              </div>
              <div className="h-52 w-full">
                <SVGLineChart data={getTimelineData()} />
              </div>
            </div>

            {/* Bottom Row Layout: Recent Orders + (Best Sellers & Alerts) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side: Recent Orders Table */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-slate-800">Recent Orders</h4>
                  <button onClick={() => { setActiveTab('orders'); setActiveSubTab('all-orders'); }} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-bold text-slate-700">#{o._id.slice(-6).toUpperCase()}</td>
                          <td className="py-3.5 font-medium text-slate-600">{o.userId?.name || 'Walkin Customer'}</td>
                          <td className="py-3.5 font-bold text-slate-800">₹{o.totalAmount}</td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              o.status === 'Cancelled' ? 'bg-red-50 text-red-500 border-red-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-center">
                            <button onClick={() => setSelectedOrder(o)} className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Best Sellers & Low Stock Alerts */}
              <div className="space-y-6">
                {/* Low Stock Alerts */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Low Stock Alarms</span>
                  </h4>
                  {lowStockProducts.length > 0 ? (
                    <div className="space-y-3">
                      {lowStockProducts.slice(0, 3).map(p => (
                        <div key={p._id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="h-8 w-8 object-contain rounded-lg border border-slate-100 bg-white p-1" alt="" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-700 truncate w-32">{p.name}</p>
                              <p className="text-[9px] font-semibold text-slate-400">{p.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                              {p.countInStock} Left
                            </span>
                            <button 
                              onClick={() => { setActiveTab('products'); setActiveSubTab('inventory'); }} 
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              Restock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-medium py-2">All product stock channels are green.</p>
                  )}
                </div>

                {/* Best Selling Products */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Top Sellers</span>
                  </h4>
                  <div className="space-y-3.5">
                    {getBestSellers().map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-1 font-bold text-xs">
                          {item.image ? <img src={item.image} className="h-full w-full object-contain" alt="" /> : (idx + 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{item.brand}</p>
                        </div>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100/50 px-2 py-0.5 rounded-lg">
                          {item.qty} units sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 2: PRODUCTS PAGE ================= */}
        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Products Catalog</h2>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Manage details, categories, and stock flows</p>
              </div>
              {activeSubTab === 'all-products' && (
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              )}
            </div>

            {/* Submenu tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-6">
              {[
                { id: 'all-products', label: 'All Products' },
                { id: 'add-product', label: 'Add Product Form' },
                { id: 'categories', label: 'Categories' },
                { id: 'inventory', label: 'Inventory' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`pb-3.5 border-b-2 transition-all ${
                    activeSubTab === sub.id 
                      ? 'border-blue-600 text-blue-600 font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Submenu 1: All Products */}
            {activeSubTab === 'all-products' && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Filters */}
                <div className="bg-slate-50/50 border-b border-slate-200 px-6 py-4 flex flex-wrap gap-2.5">
                  {['All', 'Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProductFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        productFilter === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Product Info</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {inventory
                        .filter(item => productFilter === 'All' || item.category === productFilter)
                        .map(item => (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 flex items-center gap-4">
                              <img src={item.image} className="h-10 w-10 object-contain rounded-lg border border-slate-100 bg-white p-1" alt="" />
                              <div>
                                <span className="block font-bold text-slate-800">{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">{item.brand}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-800">₹{item.price}</span>
                              {item.discountPrice && (
                                <span className="block text-[9px] text-slate-400 line-through">₹{item.discountPrice}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${item.countInStock < 15 ? 'text-rose-500' : 'text-slate-700'}`}>
                                {item.countInStock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                item.countInStock > 0 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-rose-50 text-rose-500 border-rose-100'
                              }`}>
                                {item.countInStock > 0 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                  <Edit3 className="h-4.5 w-4.5" />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submenu 2: Add Product Form */}
            {activeSubTab === 'add-product' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl">
                <h4 className="text-sm font-bold text-slate-800 mb-6">List a New Product</h4>
                <form onSubmit={handleCreateProductForm} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Dolo 650 Tablets"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Brand */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Brand</label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="e.g. Micro Labs"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    >
                      {['Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care', 'Fitness & Health'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Initial Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={newProduct.countInStock}
                      onChange={e => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                      placeholder="e.g. 100"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Standard Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g. 35"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.discountPrice}
                      onChange={e => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                      placeholder="e.g. 29"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Image URL</label>
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-bold text-slate-500 uppercase tracking-wide">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows="3"
                      placeholder="Write details about the product ingredients, use cases, etc."
                      className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 resize-none"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6 md:col-span-2 py-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={newProduct.isTrending}
                        onChange={e => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Featured Product</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={newProduct.isFlashDeal}
                        onChange={e => setNewProduct({ ...newProduct, isFlashDeal: e.target.checked })}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Active Flash Deal</span>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                    >
                      <Save className="h-4 w-4" /> Save listed product
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Submenu 3: Categories */}
            {activeSubTab === 'categories' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <AdminCategoryManager token={token} API_BASE={API_BASE} />
              </div>
            )}

            {/* Submenu 4: Inventory Quick Editor */}
            {activeSubTab === 'inventory' && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Stock Status</th>
                        <th className="px-6 py-4">Current Stock</th>
                        <th className="px-6 py-4">Quick Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {inventory.map(item => {
                        const isLow = item.countInStock < 15;
                        const isOut = item.countInStock === 0;
                        return (
                          <tr key={item._id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-[10px] text-slate-500 font-bold uppercase">{item.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                isOut ? 'bg-red-50 text-red-500 border-red-100' :
                                isLow ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                {isOut ? 'Out of stock' : isLow ? 'Low Stock' : 'Good Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-black text-slate-800">{item.countInStock}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  defaultValue={item.countInStock}
                                  id={`stock-${item._id}`}
                                  className="w-16 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 text-center font-bold"
                                />
                                <button
                                  onClick={() => {
                                    const val = document.getElementById(`stock-${item._id}`).value;
                                    handleUpdateStock(item._id, val);
                                  }}
                                  className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors rounded-lg"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 3: ORDERS PAGE ================= */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Order Logs</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Track shipment states, update deliveries, print invoices</p>
            </div>

            {/* Submenu filters */}
            <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-6">
              {[
                { id: 'all-orders', label: 'All Orders' },
                { id: 'pending-orders', label: 'Pending' },
                { id: 'processing-orders', label: 'Processing' }, // acting as Shipped
                { id: 'shipped-orders', label: 'Shipped' }, // acting as Out for Delivery
                { id: 'delivered-orders', label: 'Delivered' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`pb-3.5 border-b-2 transition-all ${
                    activeSubTab === sub.id 
                      ? 'border-blue-600 text-blue-600 font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {getFilteredOrders().map(o => (
                      <tr key={o._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-800">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <span className="block font-bold text-slate-700">{o.userId?.name || 'Customer'}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{o.userId?.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-850">₹{o.totalAmount}</td>
                        <td className="px-6 py-4 font-semibold text-slate-500">{o.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white font-bold text-[11px] text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
                          >
                            {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 transition-colors mx-auto"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: CUSTOMERS PAGE ================= */}
        {activeTab === 'customers' && (
          <motion.div
            key="customers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer Database</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Moderate customer permissions, block access, and broadcast communications</p>
            </div>

            {/* Customers list */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4 text-center">Orders Placed</th>
                      <th className="px-6 py-4 text-center">Total Spending</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {customersList.map(cust => {
                      const userOrders = orders.filter(o => o.userId?._id === cust._id);
                      const totalSpending = userOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

                      return (
                        <tr key={cust._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold border flex items-center justify-center">
                              {cust.name[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-800">{cust.name}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{cust.email}</td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{cust.phone || 'N/A'}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700">{userOrders.length}</td>
                          <td className="px-6 py-4 text-center font-black text-slate-800">₹{totalSpending.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              cust.isBlocked 
                                ? 'bg-red-50 text-red-500 border-red-100' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {cust.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              {/* Email button */}
                              <button
                                onClick={() => { setSelectedUser(cust); setIsEmailModalOpen(true); }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                                title="Broadcast Mail"
                              >
                                <Mail className="h-4.5 w-4.5" />
                              </button>
                              {/* Block button */}
                              <button
                                onClick={() => handleBlockUser(cust._id)}
                                className={`p-1.5 transition-colors rounded-lg ${
                                  cust.isBlocked 
                                    ? 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50' 
                                    : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                                title={cust.isBlocked ? "Unblock" : "Block Customer"}
                              >
                                <ShieldAlert className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 5: PAYMENTS PAGE ================= */}
        {activeTab === 'payments' && (
          <motion.div
            key="payments"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Payments Log</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Audit transaction invoices, gateway status, and total sales payout</p>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Settled</span>
                <h4 className="text-xl font-black text-slate-800 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h4>
                <p className="text-[9px] font-semibold text-slate-400 mt-1">Processed from Delivered shipments</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Payouts (COD)</span>
                <h4 className="text-xl font-black text-slate-800 mt-2">
                  ₹{orders
                    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.paymentMethod === 'Cash on Delivery')
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString('en-IN')}
                </h4>
                <p className="text-[9px] font-semibold text-slate-400 mt-1">Cash collections in transit</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Health</span>
                <h4 className="text-xl font-black text-emerald-500 mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-5 w-5" /> Online
                </h4>
                <p className="text-[9px] font-semibold text-slate-400 mt-1">{settings.paymentGateway} Integration active</p>
              </div>
            </div>

            {/* Transactions list */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Gateway</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-800">TXN_{o._id.slice(4, 12).toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{o.userId?.name || 'Guest'}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">₹{o.totalAmount}</td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{o.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            o.status === 'Delivered' || o.paymentMethod === 'Razorpay'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : o.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-500 border-rose-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {o.status === 'Delivered' || o.paymentMethod === 'Razorpay' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 6: DELIVERY PAGE ================= */}
        {activeTab === 'delivery' && (
          <motion.div
            key="delivery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Delivery Manifest</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Coordinate dispatches, courier logs, and shipping zones</p>
            </div>

            {/* Courier Log */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Shipment Order</th>
                      <th className="px-6 py-4">Shipping Destination</th>
                      <th className="px-6 py-4">Payment Method</th>
                      <th className="px-6 py-4">Carrier</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {orders
                      .filter(o => o.status !== 'Cancelled')
                      .map(o => (
                        <tr key={o._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <span className="block font-bold text-slate-800">#{o._id.slice(-6).toUpperCase()}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{o.userId?.name || 'Walkin'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="block font-medium text-slate-700">{o.shippingAddress?.building}, {o.shippingAddress?.area}</span>
                            <span className="text-[9px] text-slate-400 font-bold">PIN: {o.shippingAddress?.pincode}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-500">{o.paymentMethod}</td>
                          <td className="px-6 py-4 font-bold text-blue-600">MediQuick Courier</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              o.status === 'Shipped' || o.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 7: COUPONS PAGE ================= */}
        {activeTab === 'coupons' && (
          <motion.div
            key="coupons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Form to create coupon */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm self-start">
              <h4 className="text-sm font-bold text-slate-800 mb-6">Create Discount Coupon</h4>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                {/* Coupon Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. MEGA50"
                    className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 uppercase font-bold"
                  />
                </div>

                {/* Discount % */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Discount Value (%)</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discount}
                    onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    placeholder="e.g. 15"
                    min="1"
                    max="100"
                    className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                {/* Expiry Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newCoupon.expiryDate}
                    onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <Tag className="h-4 w-4" /> Save Coupon Code
                </button>
              </form>
            </div>

            {/* Right Columns: Coupons Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm lg:col-span-2">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                <h4 className="text-sm font-bold text-slate-800">Listed Coupon Codes</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Promo Code</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {coupons.map(c => {
                      const isExpired = new Date(c.expiryDate) < new Date();
                      return (
                        <tr key={c._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-black text-blue-600 tracking-wider uppercase">{c.code}</td>
                          <td className="px-6 py-4 font-bold text-slate-700">{c.discount}% Off</td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              isExpired 
                                ? 'bg-red-50 text-red-500 border-red-100' 
                                : c.isActive 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}>
                              {isExpired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              {!isExpired && (
                                <button
                                  onClick={() => handleToggleCouponActive(c._id, c.isActive)}
                                  className={`p-1 px-2.5 rounded-lg border text-[10px] font-bold ${
                                    c.isActive 
                                      ? 'text-slate-500 border-slate-200 hover:bg-slate-50' 
                                      : 'text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100'
                                  }`}
                                >
                                  {c.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteCoupon(c._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-lg"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 8: REVIEWS PAGE ================= */}
        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Review Moderation</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Approve patient comments, analyze rating metrics, remove spam</p>
            </div>

            {/* Reviews List */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Review comment</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviews.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-700">{r.customerName}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={r.productImage} className="h-8 w-8 object-contain bg-white rounded border p-0.5" alt="" />
                          <div>
                            <span className="block font-bold text-slate-800">{r.productName}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{r.productBrand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-yellow-500 font-black">
                          {"⭐".repeat(r.rating)}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium max-w-xs truncate">{r.comment}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            r.isApproved 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                          }`}>
                            {r.isApproved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {!r.isApproved && (
                              <button
                                onClick={() => handleApproveReview(r.medicineId, r._id)}
                                className="px-2.5 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(r.medicineId, r._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-lg"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 9: ANALYTICS PAGE ================= */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Analytics Suite</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Analyze category distribution, revenue timelines, and customer growth trends</p>
            </div>

            {/* 2x2 grid of analytics charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Revenue Timeline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Revenue Trend (30 Days)</h4>
                <div className="h-48 w-full">
                  <SVGLineChart data={getTimelineData()} color="#2563EB" />
                </div>
              </div>

              {/* Chart 2: Category Distribution */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Category Sales Distribution</h4>
                <div className="h-48 w-full">
                  <SVGBarChart data={getCategorySalesData()} color="#10B981" />
                </div>
              </div>

              {/* Chart 3: Order Velocity */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Daily Order Velocity</h4>
                <div className="h-48 w-full">
                  <SVGBarChart 
                    data={getTimelineData().map(d => ({ 
                      label: d.label, 
                      // convert revenue into simulated order count for representation
                      value: Math.round(d.value / 150) 
                    }))} 
                    color="#F59E0B" 
                  />
                </div>
              </div>

              {/* Chart 4: Customer growth trend */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Customer Signup Growth</h4>
                <div className="h-48 w-full">
                  <SVGLineChart 
                    data={getTimelineData().map((d, i) => ({ 
                      label: d.label, 
                      // cumulative growth curve representation
                      value: Math.round(customersList.length * (i + 1) / 30) 
                    }))} 
                    color="#8B5CF6" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 10: NOTIFICATIONS PAGE ================= */}
        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Audit Notifications</h2>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Review administrative alerts and log trails</p>
            </div>

            {/* Notification logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              {/* Alert 1 */}
              {lowStockProducts.map(p => (
                <div key={p._id} className="flex gap-4 items-start p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-800">Critical Stock Alert: {p.name}</h5>
                    <p className="text-slate-500 font-medium mt-1">Item stock level is at {p.countInStock} units. Please coordinate restock immediately to avoid catalog listing downtime.</p>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase mt-2">Active Alarm</span>
                  </div>
                </div>
              ))}

              {/* Alert 2 */}
              {orders.slice(0, 3).map(o => (
                <div key={o._id} className="flex gap-4 items-start p-4 bg-blue-50/40 border border-blue-100 rounded-xl text-xs">
                  <Bell className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-800">New Order Confirmation: #{o._id.slice(-6).toUpperCase()}</h5>
                    <p className="text-slate-500 font-medium mt-1">Order worth ₹{o.totalAmount} was placed by {o.userId?.name || 'Customer'} using {o.paymentMethod}.</p>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase mt-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 11: SETTINGS PAGE ================= */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl"
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-md font-bold text-slate-800">Store Configurations</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Control pricing margins, shipping rules, and payment integrations</p>
            </div>

            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
              {/* Store Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Store Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={e => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 font-bold text-slate-800"
                />
              </div>

              {/* Payment Gateway */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Payment Provider</label>
                <select
                  value={settingsForm.paymentGateway}
                  onChange={e => setSettingsForm({ ...settingsForm, paymentGateway: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                >
                  <option value="Razorpay">Razorpay Checkout</option>
                  <option value="Stripe">Stripe Payments</option>
                  <option value="PayPal">PayPal Business</option>
                </select>
              </div>

              {/* Shipping Charges */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Shipping Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={settingsForm.shippingCharges}
                  onChange={e => setSettingsForm({ ...settingsForm, shippingCharges: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Tax GST */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Standard Tax rate (%)</label>
                <input
                  type="number"
                  required
                  value={settingsForm.tax}
                  onChange={e => setSettingsForm({ ...settingsForm, tax: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Logo URL */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Logo Brand Image URL</label>
                <input
                  type="text"
                  value={settingsForm.logo}
                  onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Banner URL */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Promo Banner Image URL</label>
                <input
                  type="text"
                  value={settingsForm.banner}
                  onChange={e => setSettingsForm({ ...settingsForm, banner: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* SMTP Settings Heading */}
              <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <h5 className="font-bold text-slate-700 text-sm">SMTP Dispatch Mail Settings</h5>
                <p className="text-[10px] text-slate-400">Configure mail servers for order invoice emails</p>
              </div>

              {/* SMTP Server */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">SMTP Host Server</label>
                <input
                  type="text"
                  value={settingsForm.smtpServer}
                  onChange={e => setSettingsForm({ ...settingsForm, smtpServer: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* SMTP Port */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">SMTP Port</label>
                <input
                  type="number"
                  value={settingsForm.smtpPort}
                  onChange={e => setSettingsForm({ ...settingsForm, smtpPort: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Sender Email */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Sender Email Address</label>
                <input
                  type="email"
                  value={settingsForm.senderEmail}
                  onChange={e => setSettingsForm({ ...settingsForm, senderEmail: e.target.value })}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <Save className="h-4 w-4" /> Save Store Configuration
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SUB-MODALS ================= */}
      {/* 1. Add/Edit Product Modal */}
      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleSaveProduct}
        initialData={editingProduct}
      />

      {/* 2. Add Brand Modal */}
      <AddBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onAdd={(newBrand) => setBrands([...brands, newBrand])}
        token={token}
      />

      {/* 3. Email Broadcast Modal */}
      <EmailUserModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        user={selectedUser}
        token={token}
      />

      {/* 4. Order Details & Printable Invoice Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-x-4 top-10 bottom-10 md:inset-x-20 md:top-20 md:bottom-20 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col max-w-4xl mx-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Order Shipment Details</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">#{selectedOrder._id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrintInvoice}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-[10px] uppercase shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Tax Invoice
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {/* 2 columns layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Customer details & Items */}
                  <div className="space-y-4">
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                      <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[10px]">Customer profile</h5>
                      <p className="font-bold text-slate-700">{selectedOrder.userId?.name || 'Walk-in Customer'}</p>
                      <p className="text-slate-500 mt-1">{selectedOrder.userId?.email || 'N/A'}</p>
                      <p className="text-slate-500">{selectedOrder.userId?.phone || 'N/A'}</p>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                      <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wide text-[10px]">Purchased Items</h5>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img src={item.image} className="h-8 w-8 object-contain rounded border p-0.5 bg-white" alt="" />
                              <div>
                                <span className="block font-bold text-slate-700">{item.name}</span>
                                <span className="text-[9px] text-slate-400 font-semibold uppercase">{item.brand}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="block font-bold text-slate-800">₹{item.price * item.quantity}</span>
                              <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Address and summary */}
                  <div className="space-y-4">
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                      <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[10px]">Shipping Destination</h5>
                      <p className="font-medium text-slate-700">{selectedOrder.shippingAddress?.building}</p>
                      <p className="font-medium text-slate-700">{selectedOrder.shippingAddress?.area}</p>
                      <p className="text-[10px] font-bold text-blue-600 mt-1">PINCODE: {selectedOrder.shippingAddress?.pincode}</p>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                      <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wide text-[10px]">Payment Summary</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Payment method</span>
                          <span>{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Estimated Tax (GST 18%)</span>
                          <span>Included</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-black text-slate-800 text-sm">
                          <span>Grand Total</span>
                          <span>₹{selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Printable Ref Area (Hidden on screen, styled for print only) */}
                <div className="hidden">
                  <div ref={printAreaRef} id="printable-invoice">
                    <InvoiceTemplate 
                      order={{
                        id: selectedOrder._id,
                        customer: selectedOrder.userId?.name || 'Walkin Customer',
                        location: `${selectedOrder.shippingAddress?.building}, ${selectedOrder.shippingAddress?.area} - PIN: ${selectedOrder.shippingAddress?.pincode}`,
                        items: selectedOrder.items?.map(it => `${it.name} (${it.brand}) x${it.quantity}`),
                        total: selectedOrder.totalAmount
                      }} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Print Styles */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;