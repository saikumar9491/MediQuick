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
  Cpu,
  Globe,
  Leaf,
  Calendar,
  Layers,
  Award,
  ArrowDown,
  ArrowUp,
  Briefcase
} from 'lucide-react';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import AddBrandModal from '../components/admin/AddBrandModal';
import EmailUserModal from '../components/admin/EmailUserModal';
import AdminCategoryManager from '../components/admin/AdminCategoryManager';
import InvoiceTemplate from '../components/admin/InvoiceTemplate';
import AdminLayout from '../components/admin/AdminLayout';
import AdminBannerManager from '../components/admin/AdminBannerManager';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';

// ================= SPLINE CHART (2010 - 2016) =================
const SplineChart = () => {
  const data = [
    { label: "2010", val: 50 },
    { label: "2011", val: 30 },
    { label: "2012", val: 100 },
    { label: "2013", val: 75 },
    { label: "2014", val: 175 },
    { label: "2015", val: 60 },
    { label: "2016", val: 95 }
  ];

  const width = 500;
  const height = 180;
  const points = data.map((d, i) => {
    const x = 40 + (i / 6) * 420;
    const y = 140 - (d.val / 200) * 110;
    return { x, y };
  });
  
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = 30 + r * 100;
        const val = Math.round(200 - r * 200);
        return (
          <g key={i}>
            <line x1="40" y1={y} x2="480" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <text x="32" y={y + 3.5} textAnchor="end" className="text-[10px] font-bold fill-slate-500">{val}</text>
          </g>
        );
      })}
      <path d={dPath} fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-[#F97316] stroke-[2px] transition-all hover:r-5 cursor-pointer" />
          <title>{`${data[i].label}: ${data[i].val}`}</title>
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={40 + (i / 6) * 420} y="162" textAnchor="middle" className="text-[10.5px] font-bold fill-slate-500">{d.label}</text>
      ))}
    </svg>
  );
};

// ================= SPARKLINE CHARTS =================
const SparklineOrange = () => (
  <svg viewBox="0 0 100 30" className="w-full h-9 overflow-visible">
    <path d="M0,25 Q15,5 30,22 T60,2 T90,20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="90" cy="20" r="2.5" fill="#FFFFFF" />
  </svg>
);

const SparklineBlue = () => (
  <svg viewBox="0 0 100 30" className="w-full h-9 overflow-visible">
    <path d="M0,15 Q15,28 30,5 T60,22 T90,12" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
    <circle cx="90" cy="12" r="2.5" fill="#F97316" />
  </svg>
);

const SVGBarChart = ({ data, color = "#1E3A8A" }) => {
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

  // Tasks checklist state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy products", done: false, time: "8 mins left" },
    { id: 2, text: "Reply to emails", done: false, time: "" },
    { id: 3, text: "Write blog post", done: false, time: "20 hours left" },
    { id: 4, text: "Wash my car", done: true, time: "" },
    { id: 5, text: "Buy antivirus", done: false, time: "" },
    { id: 6, text: "Jane's Happy Birthday", done: false, time: "" }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, done: false, time: "" }]);
    setNewTaskText("");
    toast.success("Task added to manifest!");
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Modals & triggers
  const [generatingAI, setGeneratingAI] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [profilePass, setProfilePass] = useState({ oldPass: '', newPass: '' });
  const [profileLang, setProfileLang] = useState('en');

  // Form Fields
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', category: 'Vitamins', brand: '', price: '', discountPrice: '', countInStock: '', image: '', sku: '', tags: '', isTrending: false, isFlashDeal: false, variants: []
  });
  const [variantInput, setVariantInput] = useState({ size: '', weight: '', price: '', countInStock: '' });

  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiryDate: '' });
  const [settingsForm, setSettingsForm] = useState({
    storeName: '', logo: '', banner: '', shippingCharges: '', tax: '', paymentGateway: '', smtpServer: '', smtpPort: '', senderEmail: ''
  });

  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('All');
  const { user, token } = useAuth();
  const printAreaRef = useRef();

  // Fetch Data
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
        toast.error('Sync error');
      })
      .finally(() => setLoading(false));
  }, [API_BASE, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // AI Descriptor
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
      setNewProduct(prev => ({
        ...prev,
        description: `Premium grade ${prev.name} by ${prev.brand}. Formulated specifically under compliance rules for ${prev.category} therapies.`
      }));
      toast.success('Generated offline placeholder description');
    } finally {
      setGeneratingAI(false);
    }
  };

  // SKU Gen
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

  // Product helper states
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

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

  const handleExportCSV = (type) => {
    let data = [];
    let filename = `${type}_report`;

    if (type === 'products') {
      data = inventory.map(p => ({
        SKU: p.sku || 'N/A', Name: p.name, Brand: p.brand, Category: p.category, Price: p.price, Stock: p.countInStock
      }));
    } else if (type === 'orders') {
      data = orders.map(o => ({
        OrderID: o._id, Customer: o.userId?.name || 'Guest', TotalAmount: o.totalAmount, Status: o.status, Payment: o.paymentMethod, Date: new Date(o.createdAt).toDateString()
      }));
    } else if (type === 'customers') {
      data = users.map(u => ({
        Name: u.name, Email: u.email, Phone: u.phone, Role: u.role || 'Admin', WalletBalance: u.walletBalance || 0, LoyaltyPoints: u.loyaltyPoints || 0
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

  // Orders
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
    } catch (err) { toast.error('Status update failed'); }
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

  // Coupons
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
          <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6 text-xs text-[#1F2937]">
            {/* Header info */}
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Dashboard</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Dashboard / Main</p>
              </div>
            </div>

            {/* Group 1: 4 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Card 1: Revenue Today */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-none">256</h3>
                  <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-orange-500 text-[8px] font-black text-white uppercase tracking-wider">Revenue Today</span>
                </div>
                <div className="h-10 w-10 text-orange-500 flex items-center justify-center">
                  <Leaf className="h-7 w-7" />
                </div>
              </div>

              {/* Card 2: Stock Index */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-none">8451</h3>
                  <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-emerald-500 text-[8px] font-black text-white uppercase tracking-wider">20% Stock</span>
                </div>
                <div className="h-10 w-10 text-emerald-500 flex items-center justify-center">
                  <Activity className="h-7 w-7" />
                </div>
              </div>

              {/* Card 3: New Customer */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-none">31%</h3>
                  <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-rose-500 text-[8px] font-black text-white uppercase tracking-wider">New 20% Customer</span>
                </div>
                <div className="h-10 w-10 text-rose-500 flex items-center justify-center">
                  <Zap className="h-7 w-7" />
                </div>
              </div>

              {/* Card 4: Profit */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-none">158</h3>
                  <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-orange-500 text-[8px] font-black text-white uppercase tracking-wider">₹145 Profit</span>
                </div>
                <div className="h-10 w-10 text-orange-400 flex items-center justify-center">
                  <Award className="h-7 w-7" />
                </div>
              </div>
            </div>

            {/* Group 2: Visitors & Earnings + Statistics Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Unique Visitors & Monthly Earnings */}
              <div className="space-y-6 lg:col-span-1">
                {/* Unique Visitors */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Unique Visitors</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h4 className="text-2xl font-black text-slate-800">652</h4>
                    <ArrowDown className="h-4.5 w-4.5 text-rose-500" />
                  </div>
                  <span className="block text-[9px] text-slate-400 font-bold tracking-wide mt-1.5">36% From Last 6 Months</span>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Monthly Earnings</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h4 className="text-2xl font-black text-slate-800">5963</h4>
                    <ArrowUp className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <span className="block text-[9px] text-slate-400 font-bold tracking-wide mt-1.5">36% From Last 6 Months</span>
                </div>
              </div>

              {/* Right Column: Statistics splined spline chart */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Statistics</h4>
                </div>
                <div className="h-36 w-full mt-2">
                  <SplineChart />
                </div>
              </div>
            </div>

            {/* Group 3: 2x2 grid stats + sparklines */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 2x2 Grid block */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm lg:col-span-2 grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] border-collapse">
                {/* Top Left */}
                <div className="p-4 flex items-start gap-4">
                  <div className="p-2.5 bg-rose-50 rounded-lg text-rose-500 border border-rose-100">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black">₹1584.78</h5>
                    <span className="text-[10px] text-slate-400 font-bold">Earned this month</span>
                  </div>
                </div>

                {/* Top Right */}
                <div className="p-4 flex items-start gap-4">
                  <div className="p-2.5 bg-orange-50 rounded-lg text-[#F97316] border border-orange-100">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black">152 Working Hours</h5>
                    <span className="text-[10px] text-slate-400 font-bold">Spent this month</span>
                  </div>
                </div>

                {/* Bottom Left */}
                <div className="p-4 flex items-start gap-4">
                  <div className="p-2.5 bg-purple-50 rounded-lg text-purple-500 border border-purple-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black">54 Tasks</h5>
                    <span className="text-[10px] text-slate-400 font-bold">Completed this month</span>
                  </div>
                </div>

                {/* Bottom Right */}
                <div className="p-4 flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 rounded-lg text-[#22C55E] border border-emerald-100">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black">6 Projects</h5>
                    <span className="text-[10px] text-slate-400 font-bold">Done this month</span>
                  </div>
                </div>
              </div>

              {/* Sparkline cards */}
              <div className="grid grid-cols-2 gap-6 lg:col-span-1">
                {/* Month Sales Sparkline (Orange background) */}
                <div className="bg-[#F97316] text-white rounded-lg p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-orange-100 uppercase tracking-wider block">Month sales</span>
                    <h4 className="text-xl font-black mt-1">2362</h4>
                  </div>
                  <div className="mt-3">
                    <SparklineOrange />
                  </div>
                </div>

                {/* Products Sparkline (Light gray patterned background) */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Products</span>
                    <h4 className="text-xl font-black text-slate-800 mt-1">985</h4>
                  </div>
                  <div className="mt-3">
                    <SparklineBlue />
                  </div>
                </div>
              </div>
            </div>

            {/* Group 4: Bottom checklists & logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks checklist */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Tasks</h4>
                    <span className="text-[10px] text-orange-500 font-black cursor-pointer hover:underline">SHOW MORE</span>
                  </div>
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-xs font-semibold">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => handleToggleTask(t.id)}
                            className="rounded border-[#E5E7EB] text-orange-500 focus:ring-orange-400"
                          />
                          <span className={t.done ? "line-through text-slate-400 font-medium" : "text-slate-700"}>{t.text}</span>
                        </label>
                        {t.time && (
                          <span className="px-2 py-0.5 rounded bg-orange-50 text-[9px] font-black text-orange-500 uppercase border border-orange-100">{t.time}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2.5 mt-5 pt-4 border-t border-slate-100">
                  <input
                    type="text"
                    required
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    placeholder="Type your task..."
                    className="flex-1 border border-[#E5E7EB] rounded-md px-3 py-1.5 focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="px-4 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-md font-bold uppercase tracking-wider text-[10px]">ADD</button>
                </form>
              </div>

              {/* Customer details log */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Customer details</h4>
                  <div className="flex gap-3 text-[10px] font-black">
                    <span className="text-slate-400 cursor-pointer">SALE STATS</span>
                    <span className="text-orange-500 border-b-2 border-orange-500 pb-2.5 cursor-pointer">LATEST SALES</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-[260px] overflow-y-auto">
                  {[
                    { name: "John Deo", time: "12 hour", desc: "[#1183] Workaround for OS X selects printing bug", sub: "Chrome fixed the bug several versions ago, thus rendering this..." },
                    { name: "James Win", time: "16 hour", desc: "[#1249] Vertically center carousel controls", sub: "Try any carousel control and reduce the screen width below..." },
                    { name: "Jems William", time: "40 hour", desc: "[#1254] Inaccurate small pagination height", sub: "The height of pagination elements is not consistent with..." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold border flex items-center justify-center uppercase text-[10px] flex-shrink-0">
                        {item.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{item.time}</span>
                        </div>
                        <p className="font-black text-slate-700 mt-1 truncate">{item.desc}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setActiveTab('customers'); }} className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md font-bold uppercase tracking-wider text-[9px] mt-4 border border-slate-200">
                  SHOW MORE
                </button>
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
              {activeSubTab === 'all-products' && (
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-all active:scale-95 animate-fadeIn"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB] dark:border-slate-800 text-xs font-bold text-slate-500 gap-6">
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
                      ? 'border-[#F97316] text-[#F97316] font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* All Products */}
            {activeSubTab === 'all-products' && (
              <div className="bg-[#F8FAFC] dark:bg-slate-850 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-white dark:bg-slate-900/30 border-b border-[#E5E7EB] dark:border-slate-800 px-6 py-4 flex flex-wrap gap-2.5">
                  {['All', 'Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProductFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        productFilter === cat
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm'
                          : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-[#E5E7EB] dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">SKU / Item Info</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price / Variants</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Tags</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-slate-800 bg-white">
                      {inventory
                        .filter(item => productFilter === 'All' || item.category === productFilter)
                        .map(item => (
                          <tr key={item._id} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 flex items-center gap-4">
                              <img src={item.image} className="h-10 w-10 object-contain rounded-lg border border-[#E5E7EB] bg-white p-1" alt="" />
                              <div>
                                <span className="block text-[9px] font-black text-[#1E3A8A] dark:text-blue-400">{item.sku || 'MQ-GEN-100'}</span>
                                <span className="block font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                                <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.brand}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-800">₹{item.price}</span>
                              {item.variants && item.variants.length > 0 && (
                                <span className="block text-[9px] text-[#1E3A8A] font-bold">{item.variants.length} Variants</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${item.countInStock < 15 ? 'text-[#EF4444]' : 'text-slate-700'}`}>
                                {item.countInStock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[120px]">
                                {item.tags?.map((t, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 border border-[#E5E7EB] px-1 py-0.2 rounded text-[8px] uppercase font-bold">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit3 className="h-4.5 w-4.5" />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="p-1.5 text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors">
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
              <div className="bg-[#F8FAFC] dark:bg-slate-850 border border-[#E5E7EB] dark:border-slate-805 rounded-2xl p-6 shadow-sm max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">List New Inventory Catalog</h4>
                  
                  <form onSubmit={handleCreateProductForm} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Product Name</label>
                      <input
                        type="text" required
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-500 uppercase">Brand</label>
                        <button type="button" onClick={() => setIsBrandModalOpen(true)} className="text-[9px] text-[#1E3A8A] font-bold uppercase hover:underline">+ New Brand</button>
                      </div>
                      <input
                        type="text" required
                        value={newProduct.brand}
                        onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      >
                        {['Diabetes', 'Cardiac', 'Pain Relief', 'Vitamins', 'Skin Care', 'Ayurveda', 'Hair Care', 'Fitness & Health'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Product SKU</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                          className="flex-1 border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                        />
                        <button type="button" onClick={triggerSKU} className="px-3 bg-white text-[#1E3A8A] border border-[#E5E7EB] rounded-xl hover:bg-slate-50 font-bold uppercase tracking-wider text-[9px]">Gen SKU</button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 uppercase">Product Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={newProduct.tags}
                        onChange={e => setNewProduct({ ...newProduct, tags: e.target.value })}
                        placeholder="e.g. tablet, fever, healthcare"
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Base Stock</label>
                      <input
                        type="number" required
                        value={newProduct.countInStock}
                        onChange={e => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-500 uppercase">Base Price (₹)</label>
                      <input
                        type="number" required
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="font-bold text-slate-500 uppercase">Image URL</label>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-500 uppercase">Product Description</label>
                        <button
                          type="button"
                          onClick={generateAIDescription}
                          disabled={generatingAI}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-[#F97316] border border-orange-100 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-orange-100 disabled:opacity-50"
                        >
                          <Cpu className="h-3.5 w-3.5 animate-pulse" />
                          {generatingAI ? 'AI Writing...' : 'Write with AI'}
                        </button>
                      </div>
                      <textarea
                        value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                        className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#F97316] resize-none"
                      />
                    </div>

                    <div className="flex gap-6 md:col-span-2">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={newProduct.isTrending}
                          onChange={e => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                        />
                        <span>Featured Product</span>
                      </label>
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={newProduct.isFlashDeal}
                          onChange={e => setNewProduct({ ...newProduct, isFlashDeal: e.target.checked })}
                        />
                        <span>Flash Deal</span>
                      </label>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full py-3 bg-[#F97316] text-white rounded-xl font-bold shadow-md hover:bg-orange-600 transition-colors">
                      Save Listed Product
                    </button>
                  </form>
                </div>

                {/* Right Column: Variants Creator */}
                <div className="bg-[#F8FAFC] dark:bg-slate-900 p-5 rounded-2xl border border-[#E5E7EB] text-xs flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-slate-800 dark:text-slate-100 mb-4 border-b border-[#E5E7EB] pb-2">Product Variants Options</h5>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Size Option</label>
                        <input
                          type="text" value={variantInput.size}
                          onChange={e => setVariantInput({ ...variantInput, size: e.target.value })}
                          className="border border-[#E5E7EB] bg-white rounded px-2 py-1"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Weight Option</label>
                        <input
                          type="text" value={variantInput.weight}
                          onChange={e => setVariantInput({ ...variantInput, weight: e.target.value })}
                          className="border border-[#E5E7EB] bg-white rounded px-2 py-1"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Variant Price (₹)</label>
                        <input
                          type="number" value={variantInput.price}
                          onChange={e => setVariantInput({ ...variantInput, price: e.target.value })}
                          className="border border-[#E5E7EB] bg-white rounded px-2 py-1"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-400 uppercase text-[9px]">Variant Stock</label>
                        <input
                          type="number" value={variantInput.countInStock}
                          onChange={e => setVariantInput({ ...variantInput, countInStock: e.target.value })}
                          className="border border-[#E5E7EB] bg-white rounded px-2 py-1"
                        />
                      </div>

                      <button type="button" onClick={handleAddVariant} className="w-full py-2 bg-[#1E3A8A] text-white rounded font-bold hover:bg-blue-800 uppercase text-[10px] tracking-wide shadow-sm">
                        Append Option Variant
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#E5E7EB] pt-4 flex-1">
                    <h6 className="font-bold text-slate-700 text-[10px] uppercase mb-2">Configured Options ({newProduct.variants.length})</h6>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      {newProduct.variants.map((v, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-[#E5E7EB] p-2.5 rounded-lg">
                          <div>
                            <span className="font-bold text-slate-800">{v.size || v.weight || 'Default'}</span>
                            <span className="block text-[9px] text-slate-400">₹{v.price} / Stock: {v.countInStock}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-[#EF4444] font-bold hover:underline text-[10px]">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {activeSubTab === 'categories' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <AdminCategoryManager token={token} API_BASE={API_BASE} />
              </div>
            )}

            {/* Inventory Stock Adjuster */}
            {activeSubTab === 'inventory' && (
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Item Catalog</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Stock Index</th>
                      <th className="px-6 py-4">Stock Level</th>
                      <th className="px-6 py-4">Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white text-xs">
                    {inventory.map(item => {
                      const isLow = item.countInStock < 15;
                      const isOut = item.countInStock === 0;
                      return (
                        <tr key={item._id} className="hover:bg-[#F8FAFC]">
                          <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold uppercase">{item.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              isOut ? 'bg-red-50 text-[#EF4444] border-red-100' :
                              isLow ? 'bg-amber-50 text-[#F97316] border-orange-100 animate-pulse' :
                              'bg-emerald-50 text-[#22C55E] border-emerald-100'
                            }`}>
                              {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Secure'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-800">{item.countInStock}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number" defaultValue={item.countInStock} id={`inv-${item._id}`}
                                className="w-16 border border-[#E5E7EB] bg-white rounded px-2 py-1 text-center font-bold"
                              />
                              <button
                                onClick={() => {
                                  const val = document.getElementById(`inv-${item._id}`).value;
                                  handleUpdateStock(item._id, val);
                                }}
                                className="p-1 px-2.5 bg-[#1E3A8A] text-white border border-[#E5E7EB] hover:bg-blue-800 rounded-lg text-[10px] font-bold"
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
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Order Logs</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Moderate deliveries, agent assignments, and customer returns</p>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-[#E5E7EB] dark:border-slate-800 text-xs font-bold text-slate-500 gap-6">
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
                      ? 'border-[#F97316] text-[#F97316] font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {getFilteredOrders().map(o => (
                      <tr key={o._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-bold text-slate-800">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          <span className="block font-bold text-slate-700">{o.userId?.name || 'Walkin'}</span>
                          <span className="text-[10px] text-slate-400">{o.userId?.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">₹{o.totalAmount}</td>
                        <td className="px-6 py-4">
                          {o.status === 'Cancelled' ? (
                            <span className="text-slate-400">N/A</span>
                          ) : (
                            <select
                              value={o.assignedAgent || ''}
                              onChange={e => handleAssignAgent(o._id, e.target.value)}
                              className="border border-[#E5E7EB] bg-white rounded p-1 text-[11px] font-bold text-slate-700"
                            >
                              <option value="">Unassigned</option>
                              <option value="Amit Sharma">Amit Sharma</option>
                              <option value="Rohan Verma">Rohan Verma</option>
                              <option value="Simran Kaur">Simran Kaur</option>
                            </select>
                          )}
                        </td>
                        {activeSubTab === 'return-requests' ? (
                          <td className="px-6 py-4 font-semibold text-[#EF4444]">{o.returnReason || 'Product Return requested'}</td>
                        ) : (
                          <td className="px-6 py-4">
                            <select
                              value={o.status}
                              onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="border border-[#E5E7EB] bg-white rounded p-1 text-[11px] font-bold text-slate-700"
                            >
                              {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => setSelectedOrder(o)} className="px-2.5 py-1.5 bg-[#1E3A8A] text-white rounded-lg text-[10px] font-bold hover:bg-blue-800">
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
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer Database</h2>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Audit customer spendings, modify role rights, block users</p>
              </div>
              <button onClick={() => handleExportCSV('customers')} className="flex items-center gap-1.5 px-3 py-2 bg-[#1E3A8A] text-white text-[10px] font-bold rounded-lg hover:bg-blue-800">
                <Download className="h-3.5 w-3.5" /> Export Customers CSV
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Wallet Balance</th>
                      <th className="px-6 py-4 text-center">Loyalty Points</th>
                      <th className="px-6 py-4">Active Role Permission</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {users.map(cust => {
                      return (
                        <tr key={cust._id} className="hover:bg-[#F8FAFC]">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-650 font-black border flex items-center justify-center uppercase">
                              {cust.name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">{cust.name}</span>
                              <span className="text-[10px] text-slate-500">{cust.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-800">₹{cust.walletBalance || 0}</td>
                          <td className="px-6 py-4 text-center font-bold text-emerald-500">{cust.loyaltyPoints || 0} XP</td>
                          <td className="px-6 py-4">
                            <select
                              value={cust.role || 'Admin'}
                              disabled={user.role !== 'Super Admin'}
                              onChange={e => handleUpdateUserRole(cust._id, e.target.value)}
                              className="border border-[#E5E7EB] bg-white rounded p-1 text-[11px] font-bold text-slate-700"
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
                                ? 'bg-red-50 text-[#EF4444] border-red-100' 
                                : 'bg-emerald-50 text-[#22C55E] border-emerald-100'
                            }`}>
                              {cust.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => { setSelectedUser(cust); setIsEmailModalOpen(true); }} className="p-1.5 text-slate-455 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg">
                                <Mail className="h-4.5 w-4.5" />
                              </button>
                              <button onClick={() => handleBlockUser(cust._id)} className={`p-1.5 rounded-lg ${cust.isBlocked ? 'text-emerald-500' : 'text-orange-500 hover:bg-orange-50'}`}>
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Payments Log</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Settled</span>
                <h4 className="text-xl font-black text-slate-800 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</h4>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refunded Outflow</span>
                <h4 className="text-xl font-black text-[#EF4444] mt-2">
                  ₹{orders.filter(o => o.isRefunded).reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Provider Status</span>
                <h4 className="text-xl font-black text-[#22C55E] mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-5 w-5" /> Online
                </h4>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-bold text-slate-800">TXN_{o._id.slice(4, 12).toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-slate-650">{o.userId?.name || 'Guest'}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">₹{o.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            o.isRefunded ? 'bg-rose-50 text-[#EF4444] border-red-100' :
                            o.status === 'Delivered' || o.paymentMethod === 'Razorpay'
                              ? 'bg-emerald-50 text-[#22C55E] border-emerald-100'
                              : 'bg-amber-50 text-[#F97316] border-orange-100'
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Delivery Manifest</h2>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Shipment Order</th>
                      <th className="px-6 py-4">Shipping Destination</th>
                      <th className="px-6 py-4">Carrier Assigned</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {orders.filter(o => o.status !== 'Cancelled').map(o => (
                      <tr key={o._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4">
                          <span className="block font-bold text-slate-800">#{o._id.slice(-6).toUpperCase()}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{o.userId?.name || 'Walkin'}</span>
                        </td>
                        <td className="px-6 py-4 flex flex-col">
                          <span className="font-medium text-slate-700">{o.shippingAddress?.building}, {o.shippingAddress?.area}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#1E3A8A]">{o.assignedAgent || 'Courier Dispatch'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            o.status === 'Delivered' ? 'bg-emerald-50 text-[#22C55E] border-emerald-100' :
                            o.status === 'Shipped' ? 'bg-blue-50 text-[#1E3A8A] border-blue-100' :
                            'bg-orange-50 text-[#F97316] border-orange-100'
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
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm self-start">
              <h4 className="text-sm font-bold text-slate-800 mb-6">Create Discount Coupon</h4>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-medium">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase">Coupon Code</label>
                  <input
                    type="text" required value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 font-bold uppercase tracking-wider"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase">Discount Value (%)</label>
                  <input
                    type="number" required value={newCoupon.discount}
                    onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase">Expiry Date</label>
                  <input
                    type="date" required value={newCoupon.expiryDate}
                    onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#F97316] text-white font-bold rounded-xl shadow-md hover:bg-orange-600">Save Coupon</button>
              </form>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm lg:col-span-2">
              <div className="px-6 py-5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <h4 className="text-sm font-bold text-slate-800">Listed Coupon Codes</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Promo Code</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {coupons.map(c => (
                      <tr key={c._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-black text-[#1E3A8A] tracking-wider">{c.code}</td>
                        <td className="px-6 py-4 font-bold">{c.discount}% Off</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            c.isActive ? 'bg-emerald-50 text-[#22C55E] border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-205'
                          }`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleToggleCouponActive(c._id, c.isActive)} className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-[#E5E7EB] text-slate-600 rounded-lg text-[10px] font-bold">
                              Toggle State
                            </button>
                            <button onClick={() => handleDeleteCoupon(c._id)} className="p-1.5 text-[#EF4444] hover:bg-red-50 rounded transition-colors">
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Review Moderation</h2>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Comment</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] bg-white">
                    {reviews.map(r => (
                      <tr key={r._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-bold text-slate-700">{r.customerName}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <img src={r.productImage} className="h-8 w-8 object-contain bg-white rounded border p-0.5" alt="" />
                          <span className="font-bold text-slate-800">{r.productName}</span>
                        </td>
                        <td className="px-6 py-4 text-yellow-500 font-bold">{"⭐".repeat(r.rating)}</td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{r.comment}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {!r.isApproved && (
                              <button onClick={() => handleApproveReview(r.medicineId, r._id)} className="px-2 py-1 bg-emerald-50 text-[#22C55E] border border-emerald-100 rounded-lg text-[10px] font-bold">
                                Approve
                              </button>
                            )}
                            <button onClick={() => handleDeleteReview(r.medicineId, r._id)} className="p-1.5 text-[#EF4444] hover:bg-red-50 rounded transition-colors">
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Analytics Suite</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Revenue Trend (30 Days)</h4>
                <div className="h-48 w-full">
                  <SplineChart />
                </div>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Category Sales Distribution</h4>
                <div className="h-48 w-full">
                  <SVGBarChart data={getCategorySalesData()} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= TAB 10: NOTIFICATIONS ================= */}
        {activeTab === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">System Alerts Log</h2>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
              {lowStockProducts.map(p => (
                <div key={p._id} className="flex gap-4 items-start p-4 bg-red-50/50 border border-red-100 rounded-xl text-xs">
                  <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-800">Critical Stock Warning</h5>
                    <p className="text-slate-500 mt-1">{p.name} is running low ({p.countInStock} units left).</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 11: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Settings Hub</h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-555 uppercase tracking-wider mt-0.5">Configure store info, manage banners, and view admin profile</p>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-[#E5E7EB] dark:border-slate-800 text-xs font-bold text-slate-505 gap-6">
              {[
                { id: 'global-settings', label: 'Global Configurations' },
                { id: 'banners', label: 'Banners Manager' },
                { id: 'profile', label: 'Admin Profile' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  type="button"
                  className={`pb-3.5 border-b-2 transition-all ${
                    activeSubTab === sub.id || (activeSubTab === '' && sub.id === 'global-settings')
                      ? 'border-[#F97316] text-[#F97316] font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Global Settings */}
            {(activeSubTab === 'global-settings' || activeSubTab === '') && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm max-w-4xl">
                <h4 className="text-sm font-bold text-slate-800 mb-6">Store Global Configuration</h4>
                <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase">Store Name</label>
                    <input
                      type="text" required value={settingsForm.storeName}
                      onChange={e => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-500 uppercase">Gateway Provider</label>
                    <select
                      value={settingsForm.paymentGateway}
                      onChange={e => setSettingsForm({ ...settingsForm, paymentGateway: e.target.value })}
                      className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                    >
                      <option value="Razorpay">Razorpay Checkout</option>
                      <option value="Stripe">Stripe API</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-505 uppercase">Shipping Fees (₹)</label>
                    <input
                      type="number" required value={settingsForm.shippingCharges}
                      onChange={e => setSettingsForm({ ...settingsForm, shippingCharges: e.target.value })}
                      className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-505 uppercase">Tax Rate (%)</label>
                    <input
                      type="number" required value={settingsForm.tax}
                      onChange={e => setSettingsForm({ ...settingsForm, tax: e.target.value })}
                      className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <button type="submit" className="md:col-span-2 py-3 bg-[#F97316] text-white font-bold rounded-xl shadow-md hover:bg-orange-600">
                    Save Configurations
                  </button>
                </form>
              </div>
            )}

            {/* Banners Manager */}
            {activeSubTab === 'banners' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm max-w-4xl">
                <h4 className="text-sm font-bold text-[#1E3A8A] mb-6">Promotional Banners Manager</h4>
                <AdminBannerManager token={token} API_BASE={API_BASE} />
              </div>
            )}

            {/* Profile */}
            {activeSubTab === 'profile' && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm max-w-2xl">
                <h4 className="text-sm font-bold text-slate-800 mb-6">Administrator Settings</h4>
                <div className="space-y-6 text-xs font-semibold">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="h-16 w-16 rounded-full bg-blue-800 text-white flex items-center justify-center font-black text-2xl border">
                      {user.name ? user.name[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{user.name}</h5>
                      <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-[#F97316] text-[10px] font-black uppercase mt-1">
                        {user.role || 'Super Admin'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Globe className="h-4 w-4" /> Language Selection
                    </label>
                    <select
                      value={profileLang}
                      onChange={e => { setProfileLang(e.target.value); toast.success('Language adjusted'); }}
                      className="border border-[#E5E7EB] bg-white rounded-xl px-3.5 py-2.5"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español (ES)</option>
                      <option value="fr">Français (FR)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black z-45" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="fixed inset-x-4 top-10 bottom-10 md:inset-x-20 md:top-20 md:bottom-20 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col max-w-4xl mx-auto text-xs border dark:border-slate-800">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Order Invoice Summary</h4>
                  <p className="text-[10px] text-slate-400">ID: #{selectedOrder._id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrintInvoice} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold hover:bg-blue-800">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 bg-slate-200 rounded-full"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-[#E5E7EB] dark:border-slate-800 rounded-xl p-4 bg-[#F8FAFC]">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase text-[9px]">Billing Profile</h5>
                    <p className="font-bold">{selectedOrder.userId?.name || 'Walkin Customer'}</p>
                    <p className="text-slate-500 mt-1">{selectedOrder.userId?.email || 'N/A'}</p>
                  </div>
                  <div className="border border-[#E5E7EB] dark:border-slate-800 rounded-xl p-4 bg-[#F8FAFC]">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase text-[9px]">Purchased Items</h5>
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-[#E5E7EB] dark:border-slate-800 rounded-xl p-4 bg-[#F8FAFC]">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase text-[9px]">Destination</h5>
                    <p>{selectedOrder.shippingAddress?.building}, {selectedOrder.shippingAddress?.area}</p>
                    <span className="text-[10px] font-bold text-blue-500">PIN: {selectedOrder.shippingAddress?.pincode}</span>
                  </div>
                  
                  {selectedOrder.isReturnRequested && (
                    <div className="border border-red-100 bg-red-50/30 rounded-xl p-4 space-y-3">
                      <h6 className="font-bold text-[#EF4444]">Return Refund Request</h6>
                      <p className="text-slate-500">Customer requested a refund stating: <strong className="italic">"{selectedOrder.returnReason}"</strong></p>
                      <div className="flex gap-2">
                        <button onClick={() => handleProcessRefund(selectedOrder._id, 'approve')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase text-[9px]">Approve & Credit Wallet</button>
                        <button onClick={() => handleProcessRefund(selectedOrder._id, 'reject')} className="flex-1 py-2 bg-[#EF4444] hover:bg-red-700 text-white rounded font-bold uppercase text-[9px]">Reject</button>
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
        .dark .bg-[#F8FAFC] {
          background-color: #1E293B !important;
        }
        .dark .border-[#E5E7EB] {
          border-color: #334155 !important;
        }
        .dark .bg-white {
          background-color: #1E293B !important;
          color: #F8FAFC !important;
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