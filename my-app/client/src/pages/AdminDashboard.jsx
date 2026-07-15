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
  Image as ImageIcon,
  User as UserIcon,
  Download,
  Database,
  Cpu,
  Lock,
  Globe
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
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + r * chartHeight;
          const val = Math.round(maxY - r * (maxY - minY));
          return (
            <g key={idx} className="opacity-5">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#000" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[8px] font-bold fill-slate-800 dark:fill-slate-200">{val}</text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill="url(#lineChartGradient)" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth;
          const y = padding + chartHeight - ((d.value - minY) / (maxY - minY)) * chartHeight;
          return (
            <g key={i} className="group cursor-pointer">
              <circle cx={x} cy={y} r="3.5" className="fill-white dark:fill-slate-900 stroke-[2.5px] transition-all hover:r-5" stroke={color} />
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
        {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
          const y = padding + r * chartHeight;
          const val = Math.round(maxY - r * (maxY - minY));
          return (
            <g key={idx} className="opacity-5">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#000" strokeWidth="1" />
              <text x={padding - 8} y={y + 3} textAnchor="end" className="text-[8px] font-bold fill-slate-800 dark:fill-slate-200">{val}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
          const barHeight = ((d.value - minY) / (maxY - minY)) * chartHeight;
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={i} className="group cursor-pointer">
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="2" fill={color} className="opacity-90 hover:opacity-100 transition-opacity" />
              <text x={x + barWidth / 2} y={height - padding + 12} textAnchor="middle" className="text-[8px] font-bold fill-slate-400 dark:text-slate-500">{d.label}</text>
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

  // Advanced Widgets
  const [liveVisitors, setLiveVisitors] = useState(24);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Fields
  const [profilePass, setProfilePass] = useState({ oldPass: '', newPass: '' });
  const [profileLang, setProfileLang] = useState('en');

  // Form Fields
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Vitamins',
    brand: '',
    price: '',
    discountPrice: '',
    countInStock: '',
    image: '',
    sku: '',
    tags: '',
    isTrending: false,
    isFlashDeal: false,
    variants: []
  });

  // Variant helper states
  const [variantInput, setVariantInput] = useState({ size: '', weight: '', price: '', countInStock: '' });

  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiryDate: '' });
  const [settingsForm, setSettingsForm] = useState({
    storeName: '', logo: '', banner: '', shippingCharges: '', tax: '', paymentGateway: '', smtpServer: '', smtpPort: '', senderEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('All');
  const { user, token } = useAuth();
  const printAreaRef = useRef();

  // Pulse Live Visitors Count
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const nextVal = prev + delta;
        return nextVal > 5 ? nextVal : 10;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data Callback
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
        console.error(err);
        toast.error('Sync failed. Running local simulation mode.');
      })
      .finally(() => setLoading(false));
  }, [API_BASE, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // AI Product Description Generator
  const generateAIDescription = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      toast.error('Fill Name, Brand, and Category first!');
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await fetch(`${API_BASE}/api/medicines/ai-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNewProduct(prev => ({ ...prev, description: data.description }));
        toast.success('AI description generated!');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error('AI Generator offline. Used local generator template.');
      // Local fallback
      setNewProduct(prev => ({
        ...prev,
        description: `Premium grade ${prev.name} brought to you by ${prev.brand}. Specially formulated for ${prev.category} protocols to ensure safety and biological effectiveness.`
      }));
    } finally {
      setGeneratingAI(false);
    }
  };

  // SKU Generator
  const triggerSKU = () => {
    if (!newProduct.name || !newProduct.brand) {
      toast.error('Specify Name and Brand to generate SKU');
      return;
    }
    const pre = newProduct.name.slice(0, 3).toUpperCase();
    const br = newProduct.brand.slice(0, 2).toUpperCase();
    const sku = `SKU-${pre}-${br}-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewProduct(prev => ({ ...prev, sku }));
    toast.success(`SKU Generated: ${sku}`);
  };

  // Variant addition helpers
  const handleAddVariant = () => {
    if (!variantInput.price) {
      toast.error('Variant Price is required');
      return;
    }
    setNewProduct(prev => ({
      ...prev,
      variants: [...prev.variants, {
        size: variantInput.size,
        weight: variantInput.weight,
        price: Number(variantInput.price),
        countInStock: Number(variantInput.countInStock || 0)
      }]
    }));
    setVariantInput({ size: '', weight: '', price: '', countInStock: '' });
    toast.success('Variant appended');
  };

  const handleRemoveVariant = (index) => {
    setNewProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  // Export reports to CSV
  const handleExportCSV = (type) => {
    let data = [];
    let filename = `${type}_report`;

    if (type === 'products') {
      data = inventory.map(p => ({
        SKU: p.sku || 'N/A',
        Name: p.name,
        Brand: p.brand,
        Category: p.category,
        Price: p.price,
        Stock: p.countInStock
      }));
    } else if (type === 'orders') {
      data = orders.map(o => ({
        OrderID: o._id,
        Customer: o.userId?.name || 'Guest',
        TotalAmount: o.totalAmount,
        Status: o.status,
        Payment: o.paymentMethod,
        Date: new Date(o.createdAt).toDateString()
      }));
    } else if (type === 'customers') {
      data = users.map(u => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phone,
        Role: u.role || 'Admin',
        WalletBalance: u.walletBalance || 0,
        LoyaltyPoints: u.loyaltyPoints || 0
      }));
    }

    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully!');
  };

  // Product Operations
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
      
      toast.success('Inventory Catalog Saved!');
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleCreateProductForm = async (e) => {
    e.preventDefault();
    try {
      // Split tags comma strings to array
      const tagsArray = newProduct.tags ? newProduct.tags.split(',').map(t => t.trim()) : [];
      const submitData = { ...newProduct, tags: tagsArray };

      const res = await fetch(`${API_BASE}/api/medicines/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      
      toast.success('Product created successfully!');
      setNewProduct({
        name: '', description: '', category: 'Vitamins', brand: '', price: '', discountPrice: '', countInStock: '', image: '', sku: '', tags: '', isTrending: false, isFlashDeal: false, variants: []
      });
      fetchData();
      setActiveSubTab('all-products');
    } catch (err) {
      toast.error(`Error listing product: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Purged');
        setInventory(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) { toast.error('Purge error'); }
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

  // Order Operations
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
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleAssignAgent = async (orderId, agentName) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/assign-agent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ agentName }),
      });
      if (res.ok) {
        toast.success(`Delivery agent assigned: ${agentName}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, assignedAgent: agentName } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, assignedAgent: agentName }));
        }
      }
    } catch (err) { toast.error('Assignment failed'); }
  };

  const handleProcessRefund = async (orderId, action) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/refund`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        toast.success(action === 'approve' ? 'Refund approved and credited to wallet!' : 'Return request rejected');
        fetchData();
        setSelectedOrder(null);
      }
    } catch (err) { toast.error('Refund processing error'); }
  };

  // Coupon Operations
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        toast.success('Promo Code Created!');
        setNewCoupon({ code: '', discount: '', expiryDate: '' });
        fetchData();
      }
    } catch (err) { toast.error('Coupon listing failed'); }
  };

  const handleToggleCouponActive = async (id, currentState) => {
    try {
      const res = await fetch(`${API_BASE}/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentState }),
      });
      if (res.ok) {
        toast.success('Status toggled');
        setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: !currentState } : c));
      }
    } catch (err) { toast.error('State toggle failed'); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
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

  // Settings
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
        toast.success('Store settings saved!');
        fetchData();
      }
    } catch (err) { toast.error('Settings update failed'); }
  };

  // Customers
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

  const handleUpdateUserRole = async (userId, role) => {
    if (user.role !== 'Super Admin') {
      toast.error('Super Admin clearance required to modify roles');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        toast.success('User role updated successfully');
        setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      }
    } catch (err) { toast.error('Role update failed'); }
  };

  // Reviews
  const handleApproveReview = async (medId, revId) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${medId}/${revId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Approved');
        setReviews(prev => prev.map(r => r._id === revId ? { ...r, isApproved: true } : r));
      }
    } catch (err) { toast.error('Approval failed'); }
  };

  const handleDeleteReview = async (medId, revId) => {
    if (!window.confirm('Delete review?')) return;
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

  // Invoice Print
  const handlePrintInvoice = () => {
    const printContent = printAreaRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    window.location.reload();
  };

  // Calculations
  const completedOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProfit = Math.round(totalRevenue * 0.25);
  const customersList = users.filter(u => !u.isAdmin);
  const lowStockProducts = inventory.filter(m => m.countInStock < 15);

  const getTimelineData = () => {
    const chartData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const dailyOrders = completedOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getDate() === date.getDate() && 
               orderDate.getMonth() === date.getMonth();
      });
      const value = dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      chartData.push({ label, value });
    }
    return chartData;
  };

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

  const getFilteredOrders = () => {
    if (activeSubTab === 'pending-orders') return orders.filter(o => o.status === 'Confirmed' && !o.isReturnRequested);
    if (activeSubTab === 'processing-orders') return orders.filter(o => o.status === 'Shipped'); 
    if (activeSubTab === 'shipped-orders') return orders.filter(o => o.status === 'Out for Delivery');
    if (activeSubTab === 'delivered-orders') return orders.filter(o => o.status === 'Delivered');
    if (activeSubTab === 'return-requests') return orders.filter(o => o.isReturnRequested);
    return orders;
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      activeSubTab={activeSubTab} 
      setActiveSubTab={setActiveSubTab} 
      stats={{ lowStockCount: lowStockProducts.length }}
    >
      <AnimatePresence mode="wait">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Overview Dashboard</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Diagnose catalog entries, transactions, and store diagnostics</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Live Visitors Widget */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm select-none">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                  <span>{liveVisitors} Live Visitors</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-bold shadow-sm">
                  <span>Conv. Rate: 2.4%</span>
                </div>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Revenue */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Revenue</span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 leading-none mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <span className="block text-[8px] font-semibold text-slate-400 mt-2">Completed Orders</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-slate-700/50">
                  <DollarSign className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Profit */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Profit</span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 leading-none mt-2">₹{totalProfit.toLocaleString('en-IN')}</h3>
                  <span className="block text-[8px] font-bold text-blue-500 mt-2">25% margin calculated</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100/50 dark:border-slate-700/50">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Orders */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Orders</span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 leading-none mt-2">{orders.length}</h3>
                  <span className="block text-[8px] font-semibold text-slate-400 mt-2">Active + Pending</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/50 dark:border-slate-700/50">
                  <ShoppingCart className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Customers */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Customers</span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 leading-none mt-2">{customersList.length}</h3>
                  <span className="block text-[8px] font-semibold text-slate-400 mt-2">Registrations</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100/50 dark:border-slate-700/50">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Today's Sales */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Today's Sales</span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 leading-none mt-2">₹8,240</h3>
                  <span className="block text-[8px] font-bold text-emerald-500 mt-2">Daily target 82%</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100/50 dark:border-slate-700/50">
                  <Activity className="h-4.5 w-4.5" />
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Store Sales Timeline</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">30 day diagnostic revenue metrics</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleExportCSV('products')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100">
                    <Download className="h-3.5 w-3.5" /> Export Catalog CSV
                  </button>
                  <button onClick={() => handleExportCSV('orders')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100">
                    <Download className="h-3.5 w-3.5" /> Export Orders CSV
                  </button>
                </div>
              </div>
              <div className="h-52 w-full">
                <SVGLineChart data={getTimelineData()} />
              </div>
            </div>

            {/* Down section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Orders Log</h4>
                  <button onClick={() => { setActiveTab('orders'); setActiveSubTab('all-orders'); }} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Agent</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-700 dark:text-slate-300">#{o._id.slice(-6).toUpperCase()}</td>
                          <td className="py-3 font-medium text-slate-600 dark:text-slate-400">{o.userId?.name || 'Walkin Customer'}</td>
                          <td className="py-3 font-bold text-slate-850 dark:text-slate-100">₹{o.totalAmount}</td>
                          <td className="py-3 font-medium text-blue-500">{o.assignedAgent || 'Unassigned'}</td>
                          <td className="py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              o.status === 'Cancelled' ? 'bg-rose-50 text-red-500 border-red-100' :
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

              {/* Alerts and Sellers */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Low Stock Alarms</span>
                  </h4>
                  {lowStockProducts.length > 0 ? (
                    <div className="space-y-3">
                      {lowStockProducts.slice(0, 3).map(p => (
                        <div key={p._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="h-8 w-8 object-contain rounded bg-white border border-slate-100 p-0.5" alt="" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate w-32">{p.name}</p>
                              <p className="text-[9px] text-slate-400">{p.sku || 'N/A'}</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/50">
                            {p.countInStock} Left
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-2">Catalog stocks are green.</p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span>Top Selling Catalog</span>
                  </h4>
                  <div className="space-y-3.5">
                    {getBestSellers().map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.image} className="h-8 w-8 object-contain rounded bg-white border border-slate-100 p-0.5" alt="" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{item.brand}</p>
                        </div>
                        <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                          {item.qty} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 2: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Products Catalog</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Control items, variants, SKUs, and categories</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 gap-6">
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

            {/* All Products */}
            {activeSubTab === 'all-products' && (
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-wrap gap-2.5">
                  {['All', 'Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProductFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        productFilter === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">SKU / Item Info</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price / Variants</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Tags</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {inventory
                        .filter(item => productFilter === 'All' || item.category === productFilter)
                        .map(item => (
                          <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 flex items-center gap-4">
                              <img src={item.image} className="h-10 w-10 object-contain rounded-lg border border-slate-100 dark:border-slate-800 bg-white p-1" alt="" />
                              <div>
                                <span className="block text-[9px] font-black text-blue-600 dark:text-blue-400">{item.sku || 'MQ-GEN-100'}</span>
                                <span className="block font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.brand}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-350">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-800 dark:text-slate-200">₹{item.price}</span>
                              {item.variants && item.variants.length > 0 && (
                                <span className="block text-[9px] text-blue-500 font-bold">{item.variants.length} Variants</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${item.countInStock < 15 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                {item.countInStock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[120px]">
                                {item.tags?.map((t, idx) => (
                                  <span key={idx} className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 px-1 py-0.2 rounded text-[8px] uppercase font-bold">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                                  <Edit3 className="h-4.5 w-4.5" />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors">
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

            {/* Add Product Form */}
            {activeSubTab === 'add-product' && (
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">List New Inventory Catalog</h4>
                  
                  <form onSubmit={handleCreateProductForm} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Name</label>
                      <input
                        type="text" required
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Brand</label>
                      <input
                        type="text" required
                        value={newProduct.brand}
                        onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      >
                        {['Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care', 'Fitness & Health'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* SKU Generator */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product SKU / Barcode</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                          className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                        />
                        <button type="button" onClick={triggerSKU} className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border dark:border-slate-700 rounded-xl hover:bg-slate-200 font-bold uppercase tracking-wider text-[9px]">Gen SKU</button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={newProduct.tags}
                        onChange={e => setNewProduct({ ...newProduct, tags: e.target.value })}
                        placeholder="e.g. tablet, fever, healthcare"
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Stock */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Base Stock</label>
                      <input
                        type="number" required
                        value={newProduct.countInStock}
                        onChange={e => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Base Price (₹)</label>
                      <input
                        type="number" required
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Image URL</label>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* AI Description Widget */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Description</label>
                        <button
                          type="button"
                          onClick={generateAIDescription}
                          disabled={generatingAI}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-purple-100 disabled:opacity-50"
                        >
                          <Cpu className="h-3.5 w-3.5 animate-pulse" />
                          {generatingAI ? 'AI Writing...' : 'Write with AI'}
                        </button>
                      </div>
                      <textarea
                        value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 resize-none text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="flex gap-6 md:col-span-2">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-650 dark:text-slate-350">
                        <input
                          type="checkbox"
                          checked={newProduct.isTrending}
                          onChange={e => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                        />
                        <span>Featured Product</span>
                      </label>
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-650 dark:text-slate-350">
                        <input
                          type="checkbox"
                          checked={newProduct.isFlashDeal}
                          onChange={e => setNewProduct({ ...newProduct, isFlashDeal: e.target.checked })}
                        />
                        <span>Flash Deal</span>
                      </label>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">
                      Save Listed Product
                    </button>
                  </form>
                </div>

                {/* Right Column: Variants Creator */}
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border dark:border-slate-800 text-xs flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-slate-800 dark:text-slate-100 mb-4 border-b dark:border-slate-850 pb-2">Product Variants Options</h5>
                    <div className="space-y-4">
                      {/* Size */}
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Size Option</label>
                        <input
                          type="text" value={variantInput.size}
                          onChange={e => setVariantInput({ ...variantInput, size: e.target.value })}
                          placeholder="e.g. 10 Tablets / Small"
                          className="border dark:border-slate-700 bg-white dark:bg-slate-850 rounded px-2 py-1 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      {/* Weight */}
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Weight Option</label>
                        <input
                          type="text" value={variantInput.weight}
                          onChange={e => setVariantInput({ ...variantInput, weight: e.target.value })}
                          placeholder="e.g. 30g"
                          className="border dark:border-slate-700 bg-white dark:bg-slate-850 rounded px-2 py-1 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      {/* Variant Price */}
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Variant Price (₹)</label>
                        <input
                          type="number" value={variantInput.price}
                          onChange={e => setVariantInput({ ...variantInput, price: e.target.value })}
                          className="border dark:border-slate-700 bg-white dark:bg-slate-850 rounded px-2 py-1 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      {/* Variant Stock */}
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Variant Stock</label>
                        <input
                          type="number" value={variantInput.countInStock}
                          onChange={e => setVariantInput({ ...variantInput, countInStock: e.target.value })}
                          className="border dark:border-slate-700 bg-white dark:bg-slate-850 rounded px-2 py-1 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <button type="button" onClick={handleAddVariant} className="w-full py-2 bg-slate-800 dark:bg-slate-750 text-white rounded font-bold hover:bg-slate-700 uppercase text-[10px] tracking-wide shadow-sm">
                        Append Option Variant
                      </button>
                    </div>
                  </div>

                  {/* Added list */}
                  <div className="mt-6 border-t dark:border-slate-850 pt-4 flex-1">
                    <h6 className="font-bold text-slate-700 dark:text-slate-300 text-[10px] uppercase mb-2">Configured Options ({newProduct.variants.length})</h6>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      {newProduct.variants.map((v, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-850 border dark:border-slate-800 p-2.5 rounded-lg">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{v.size || v.weight || 'Default'}</span>
                            <span className="block text-[9px] text-slate-400">₹{v.price} / Stock: {v.countInStock}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-rose-500 font-bold hover:underline text-[10px]">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {activeSubTab === 'categories' && (
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <AdminCategoryManager token={token} API_BASE={API_BASE} />
              </div>
            )}

            {/* Inventory Stock Adjuster */}
            {activeSubTab === 'inventory' && (
              <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Item Catalog</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Stock Index</th>
                      <th className="px-6 py-4">Stock Level</th>
                      <th className="px-6 py-4">Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {inventory.map(item => {
                      const isLow = item.countInStock < 15;
                      const isOut = item.countInStock === 0;
                      return (
                        <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-350">{item.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-450 font-bold uppercase">{item.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              isOut ? 'bg-red-50 text-red-500 border-red-100' :
                              isLow ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                              'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Secure'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-850 dark:text-slate-200">{item.countInStock}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number" defaultValue={item.countInStock} id={`inv-${item._id}`}
                                className="w-16 border dark:border-slate-750 bg-white dark:bg-slate-800 rounded px-2 py-1 text-center font-bold"
                              />
                              <button
                                onClick={() => {
                                  const val = document.getElementById(`inv-${item._id}`).value;
                                  handleUpdateStock(item._id, val);
                                }}
                                className="p-1 px-2.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 3: ORDERS ================= */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Order Logs</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Moderate deliveries, agent assignments, and customer returns</p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 gap-6">
              {[
                { id: 'all-orders', label: 'All Orders' },
                { id: 'pending-orders', label: 'Pending' },
                { id: 'processing-orders', label: 'Processing' },
                { id: 'shipped-orders', label: 'Shipped' },
                { id: 'delivered-orders', label: 'Delivered' },
                { id: 'return-requests', label: 'Return & Refunds' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`pb-3.5 border-b-2 transition-all relative ${
                    activeSubTab === sub.id 
                      ? 'border-blue-600 text-blue-600 font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>{sub.label}</span>
                  {sub.id === 'return-requests' && orders.filter(o => o.isReturnRequested).length > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 bg-red-500 rounded-full text-[7px] font-black text-white w-4 h-4 flex items-center justify-center animate-bounce">
                      {orders.filter(o => o.isReturnRequested).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Assigned Agent</th>
                      {activeSubTab === 'return-requests' ? (
                        <th className="px-6 py-4">Return Reason</th>
                      ) : (
                        <th className="px-6 py-4">Delivery Status</th>
                      )}
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {getFilteredOrders().map(o => (
                      <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-200">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <span className="block font-bold text-slate-700 dark:text-slate-350">{o.userId?.name || 'Walkin'}</span>
                          <span className="text-[10px] text-slate-400">{o.userId?.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-100">₹{o.totalAmount}</td>
                        <td className="px-6 py-4">
                          {o.status === 'Cancelled' ? (
                            <span className="text-slate-400">N/A</span>
                          ) : (
                            <select
                              value={o.assignedAgent || ''}
                              onChange={e => handleAssignAgent(o._id, e.target.value)}
                              className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-1 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                            >
                              <option value="">Unassigned</option>
                              <option value="Amit Sharma">Amit Sharma</option>
                              <option value="Rohan Verma">Rohan Verma</option>
                              <option value="Simran Kaur">Simran Kaur</option>
                            </select>
                          )}
                        </td>
                        {activeSubTab === 'return-requests' ? (
                          <td className="px-6 py-4 font-semibold text-rose-500">{o.returnReason || 'Product Return requested'}</td>
                        ) : (
                          <td className="px-6 py-4">
                            <select
                              value={o.status}
                              onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-1 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                            >
                              {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => setSelectedOrder(o)} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-[10px] font-bold border dark:border-slate-700">
                            Details
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

        {/* ================= TAB 4: CUSTOMERS ================= */}
        {activeTab === 'customers' && (
          <motion.div key="customers" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Customer Database</h2>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Audit customer spendings, modify role rights, block users</p>
              </div>
              <button onClick={() => handleExportCSV('customers')} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-600 rounded-lg border">
                <Download className="h-3.5 w-3.5" /> Export Customers CSV
              </button>
            </div>

            {/* Customers list */}
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Wallet Balance</th>
                      <th className="px-6 py-4 text-center">Loyalty Points</th>
                      <th className="px-6 py-4">Active Role Permission</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map(cust => {
                      return (
                        <tr key={cust._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-650 font-black border flex items-center justify-center uppercase">
                              {cust.name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{cust.name}</span>
                              <span className="text-[10px] text-slate-450">{cust.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-850 dark:text-slate-250">₹{cust.walletBalance || 0}</td>
                          <td className="px-6 py-4 text-center font-bold text-emerald-500">{cust.loyaltyPoints || 0} XP</td>
                          <td className="px-6 py-4">
                            <select
                              value={cust.role || 'Admin'}
                              disabled={user.role !== 'Super Admin'}
                              onChange={e => handleUpdateUserRole(cust._id, e.target.value)}
                              className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded p-1 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Admin">Admin</option>
                              <option value="Manager">Manager</option>
                              <option value="Warehouse Staff">Warehouse Staff</option>
                            </select>
                          </td>
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
                              <button onClick={() => { setSelectedUser(cust); setIsEmailModalOpen(true); }} className="p-1.5 text-slate-450 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors rounded-lg">
                                <Mail className="h-4.5 w-4.5" />
                              </button>
                              <button onClick={() => handleBlockUser(cust._id)} className={`p-1.5 rounded-lg ${cust.isBlocked ? 'text-emerald-500' : 'text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800'}`}>
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

        {/* ================= TAB 5: PAYMENTS ================= */}
        {activeTab === 'payments' && (
          <motion.div key="payments" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Payments Log</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Audit transaction invoices, gateway status, and total sales payout</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Settled</span>
                <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h4>
              </div>
              <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Refunded Outflow</span>
                <h4 className="text-xl font-black text-rose-500 mt-2">
                  ₹{orders.filter(o => o.isRefunded).reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Provider Status</span>
                <h4 className="text-xl font-black text-emerald-500 mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-5 w-5" /> Online
                </h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-350">TXN_{o._id.slice(4, 12).toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{o.userId?.name || 'Guest'}</td>
                        <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-100">₹{o.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            o.isRefunded ? 'bg-rose-50 text-rose-500 border-rose-100' :
                            o.status === 'Delivered' || o.paymentMethod === 'Razorpay'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {o.isRefunded ? 'Refunded' : o.status === 'Delivered' || o.paymentMethod === 'Razorpay' ? 'Paid' : 'Pending'}
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

        {/* ================= TAB 6: DELIVERY ================= */}
        {activeTab === 'delivery' && (
          <motion.div key="delivery" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Delivery Manifest</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Coordinate dispatches, courier logs, and shipping zones</p>
            </div>
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Shipment Order</th>
                      <th className="px-6 py-4">Shipping Destination</th>
                      <th className="px-6 py-4">Carrier Assigned</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.filter(o => o.status !== 'Cancelled').map(o => (
                      <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                          <span className="block font-bold text-slate-800 dark:text-slate-200">#{o._id.slice(-6).toUpperCase()}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{o.userId?.name || 'Walkin'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="block font-medium text-slate-700 dark:text-slate-450">{o.shippingAddress?.building}, {o.shippingAddress?.area}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{o.assignedAgent || 'Courier Dispatch'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse'
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

        {/* ================= TAB 7: COUPONS ================= */}
        {activeTab === 'coupons' && (
          <motion.div key="coupons" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm self-start">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6">Create Discount Coupon</h4>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-medium">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Coupon Code</label>
                  <input
                    type="text" required value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="border dark:border-slate-750 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Discount Value (%)</label>
                  <input
                    type="number" required value={newCoupon.discount}
                    onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    className="border dark:border-slate-750 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Expiry Date</label>
                  <input
                    type="date" required value={newCoupon.expiryDate}
                    onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="border dark:border-slate-750 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700">Save Coupon</button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm lg:col-span-2">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Listed Coupon Codes</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Promo Code</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {coupons.map(c => (
                      <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400 tracking-wider">{c.code}</td>
                        <td className="px-6 py-4 font-bold">{c.discount}% Off</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            c.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-450 border-slate-250'
                          }`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleToggleCouponActive(c._id, c.isActive)} className="px-2 py-1 text-[10px] bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 text-slate-650 rounded-lg hover:bg-slate-100">
                              Toggle State
                            </button>
                            <button onClick={() => handleDeleteCoupon(c._id)} className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-slate-800">
                              <Trash2 className="h-4 w-4" />
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

        {/* ================= TAB 8: REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <motion.div key="reviews" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Review Moderation</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Approve patient comments, analyze rating metrics, remove spam</p>
            </div>
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-200 dark:border-slate-850 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Comment</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reviews.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{r.customerName}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <img src={r.productImage} className="h-8 w-8 object-contain bg-white rounded border p-0.5" alt="" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{r.productName}</span>
                        </td>
                        <td className="px-6 py-4 text-yellow-500 font-bold">{"⭐".repeat(r.rating)}</td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{r.comment}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {!r.isApproved && (
                              <button onClick={() => handleApproveReview(r.medicineId, r._id)} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-lg text-[10px] font-bold">
                                Approve
                              </button>
                            )}
                            <button onClick={() => handleDeleteReview(r.medicineId, r._id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
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

        {/* ================= TAB 9: ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Analytics Suite</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Analyze category distribution, revenue timelines, and customer growth trends</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Revenue Trend (30 Days)</h4>
                <div className="h-48 w-full">
                  <SVGLineChart data={getTimelineData()} />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Category Sales Distribution</h4>
                <div className="h-48 w-full">
                  <SVGBarChart data={getCategorySalesData()} color="#10B981" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 10: NOTIFICATIONS ================= */}
        {activeTab === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">System Alerts</h2>
            </div>
            <div className="bg-white dark:bg-slate-850 border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              {lowStockProducts.map(p => (
                <div key={p._id} className="flex gap-4 items-start p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl text-xs">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">Critical Stock Warning</h5>
                    <p className="text-slate-500 mt-1">{p.name} is running low ({p.countInStock} units left).</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 11: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-4xl">
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 mb-6">Store Global Configuration</h4>
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase">Store Name</label>
                <input
                  type="text" required value={settingsForm.storeName}
                  onChange={e => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="border dark:border-slate-755 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5 font-bold text-slate-850 dark:text-slate-100"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase">Gateway Provider</label>
                <select
                  value={settingsForm.paymentGateway}
                  onChange={e => setSettingsForm({ ...settingsForm, paymentGateway: e.target.value })}
                  className="border dark:border-slate-755 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5"
                >
                  <option value="Razorpay">Razorpay Checkout</option>
                  <option value="Stripe">Stripe API</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase">Shipping Fees (₹)</label>
                <input
                  type="number" required value={settingsForm.shippingCharges}
                  onChange={e => setSettingsForm({ ...settingsForm, shippingCharges: e.target.value })}
                  className="border dark:border-slate-755 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase">Tax Rate (%)</label>
                <input
                  type="number" required value={settingsForm.tax}
                  onChange={e => setSettingsForm({ ...settingsForm, tax: e.target.value })}
                  className="border dark:border-slate-755 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5"
                />
              </div>
              <button type="submit" className="md:col-span-2 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md">
                Save Configurations
              </button>
            </form>
          </motion.div>
        )}

        {/* ================= TAB 12: ADMIN PROFILE ================= */}
        {activeTab === 'settings' && activeSubTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-2xl">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6">Administrator Settings</h4>
            <div className="space-y-6 text-xs font-semibold">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-2xl border">
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user.name}</h5>
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 text-[10px] font-black uppercase mt-1">{user.role || 'Super Admin'}</span>
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> Language Selection
                </label>
                <select
                  value={profileLang}
                  onChange={e => { setProfileLang(e.target.value); toast.success('Language adjusted'); }}
                  className="border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2.5"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddMedicineModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onAdd={handleSaveProduct} initialData={editingProduct}
      />
      <AddBrandModal
        isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}
        onAdd={(newBrand) => setBrands([...brands, newBrand])} token={token}
      />
      <EmailUserModal
        isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)}
        user={selectedUser} token={token}
      />

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="fixed inset-x-4 top-10 bottom-10 md:inset-x-20 md:top-20 md:bottom-20 bg-white dark:bg-slate-850 rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col max-w-4xl mx-auto text-xs">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Order Invoice Summary</h4>
                  <p className="text-[10px] text-slate-400">ID: #{selectedOrder._id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrintInvoice} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 bg-slate-200 rounded-full"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase text-[9px]">Billing Profile</h5>
                    <p className="font-bold">{selectedOrder.userId?.name || 'Walkin Customer'}</p>
                    <p className="text-slate-450 mt-1">{selectedOrder.userId?.email || 'N/A'}</p>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30">
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 mb-3 uppercase text-[9px]">Purchased Items</h5>
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30">
                    <h5 className="font-bold text-slate-850 dark:text-slate-200 mb-2 uppercase text-[9px]">Destination</h5>
                    <p>{selectedOrder.shippingAddress?.building}, {selectedOrder.shippingAddress?.area}</p>
                    <span className="text-[10px] font-bold text-blue-500">PIN: {selectedOrder.shippingAddress?.pincode}</span>
                  </div>
                  
                  {/* Refund Actions */}
                  {selectedOrder.isReturnRequested && (
                    <div className="border border-red-100 dark:border-rose-950/50 bg-red-50/30 dark:bg-rose-950/10 rounded-xl p-4 space-y-3">
                      <h6 className="font-bold text-red-700 dark:text-red-400">Return Refund Request</h6>
                      <p className="text-slate-500">Customer requested a refund stating: <strong className="italic">"{selectedOrder.returnReason}"</strong></p>
                      <div className="flex gap-2">
                        <button onClick={() => handleProcessRefund(selectedOrder._id, 'approve')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase text-[9px]">Approve & Credit Wallet</button>
                        <button onClick={() => handleProcessRefund(selectedOrder._id, 'reject')} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold uppercase text-[9px]">Reject</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Printable Ref */}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .dark .bg-white {
          background-color: #1E293B !important;
          color: #F8FAFC !important;
        }
        .dark .bg-slate-50 {
          background-color: #0F172A !important;
        }
        .dark .border-slate-200 {
          border-color: #334155 !important;
        }
        .dark .text-slate-800 {
          color: #F8FAFC !important;
        }
        .dark .text-slate-700 {
          color: #E2E8F0 !important;
        }
        .dark .text-slate-600 {
          color: #CBD5E1 !important;
        }
        .dark .text-slate-500 {
          color: #94A3B8 !important;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;