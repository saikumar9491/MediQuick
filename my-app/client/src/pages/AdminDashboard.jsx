import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Users, 
  Image as ImageIcon, 
  Award, 
  Activity, 
  TrendingUp, 
  Plus, 
  Zap,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Eye,
  FileText,
  Bell
} from 'lucide-react';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import AdminBannerManager from '../components/admin/AdminBannerManager';
import AddBrandModal from '../components/admin/AddBrandModal';
import EmailUserModal from '../components/admin/EmailUserModal';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, userRes, bannerRes, brandRes] = await Promise.all([
        fetch(`${API_BASE}/api/medicines`),
        fetch(`${API_BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/banners`),
        fetch(`${API_BASE}/api/brands`)
      ]);

      const [invData, userData, bannerData, brandData] = await Promise.all([
        invRes.json(), userRes.json(), bannerRes.json(), brandRes.json()
      ]);

      setInventory(Array.isArray(invData) ? invData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setBanners(Array.isArray(bannerData) ? bannerData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (err) {
      toast.error('Hub sync failed');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddNew = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setIsModalOpen(true); };

  const handleSaveProduct = async (productData) => {
    const isEdit = !!editingProduct;
    const url = isEdit ? `${API_BASE}/api/medicines/${editingProduct._id}` : `${API_BASE}/api/medicines`;
    const method = isEdit ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(productData),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      return data;
    });

    toast.promise(savePromise, {
      loading: isEdit ? 'Updating Unit...' : 'Uploading to Hub...',
      success: 'Database Synced!',
      error: (err) => `❌ ${err.message}`,
    });

    try { await savePromise; fetchData(); setIsModalOpen(false); } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Purge this unit?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Unit Purged');
        setInventory(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) { toast.error('Connection failed'); }
  };

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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Purge user?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('User Deleted');
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) { toast.error('Purge failed'); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Remove this banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Banner removed');
        setBanners(banners.filter(b => b._id !== id));
      }
    } catch (err) { toast.error('Error removing banner'); }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans">
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-[1400px]"
        >
          {/* Admin Command Center Header */}
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="h-7 w-7 text-green-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Command Center</h1>
          </div>
          <p className="text-sm font-medium text-slate-500 ml-10 mb-2">
            Inventory management and system configuration
          </p>

          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {activeTab !== 'overview' && (
              <div className="flex items-center gap-4">
                {activeTab === 'products' && (
                  <Link
                    to="/admin/flash-deals"
                    className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Flash Deals</span>
                  </Link>
                )}
                {['products', 'brands'].includes(activeTab) && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (activeTab === 'products') handleAddNew();
                      if (activeTab === 'brands') setIsBrandModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <Plus className="h-4 w-4" />
                    {activeTab === 'products' ? 'Add Product' : activeTab === 'brands' ? 'Add Brand' : 'Add New'}
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* NEW COMMAND CENTER GRID */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 mb-10">
              
              {/* TOP ROW: 3 Large Colored Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Live Status (Purple) */}
                <motion.div variants={cardVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg shadow-purple-500/20">
                  <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/80">Live Status</h3>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-5xl font-black">1</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-medium text-white/70">Active in last 5 minutes</p>
                  </div>
                  <Activity className="absolute -bottom-6 -right-6 h-40 w-40 opacity-10 text-white transition-transform duration-500 hover:scale-110 hover:-rotate-6" />
                </motion.div>

                {/* 2. User Growth (Green) */}
                <motion.div variants={cardVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20">
                  <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/80">User Growth</h3>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-5xl font-black">{users.length}</span>
                    </div>
                    <p className="mt-4 text-xs font-bold text-white/80 uppercase tracking-widest">Total Registered</p>
                  </div>
                  <Users className="absolute -bottom-6 -right-6 h-40 w-40 opacity-10 text-white transition-transform duration-500 hover:scale-110 hover:-rotate-6" />
                </motion.div>

                {/* 3. Platform Traffic / Inventory (Orange) */}
                <motion.div variants={cardVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/20">
                  <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/80">Total Inventory</h3>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-5xl font-black">{inventory.length}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-xs font-bold text-white/80 uppercase tracking-widest">
                      <div>
                        <span className="block text-white/60 text-[10px] mb-0.5">Flash Deals</span>
                        <span>{inventory.filter(m => m.isFlashDeal).length} Active</span>
                      </div>
                      <div>
                        <span className="block text-white/60 text-[10px] mb-0.5">Banners</span>
                        <span>{banners.length} Live</span>
                      </div>
                    </div>
                  </div>
                  <Eye className="absolute -bottom-6 -right-6 h-40 w-40 opacity-10 text-white transition-transform duration-500 hover:scale-110 hover:-rotate-6" />
                </motion.div>
                
              </div>

              {/* BOTTOM ROW: 4 Small White Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: users.length, icon: Users },
                  { label: 'Products Listed', value: inventory.length, icon: Package },
                  { label: 'Active Brands', value: brands.length, icon: Award },
                  { label: 'Total Broadcasts', value: 0, icon: Bell },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800 leading-none">{stat.value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent User Activity Section */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Recent User Activity</h2>
                </div>
                {users.length > 0 ? (
                  <div className="space-y-4">
                    {users.slice(0, 3).map(u => (
                      <div key={u._id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400">Account verified</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm font-medium text-slate-400">No recent activity detected.</div>
                )}
              </div>

            </div>
          )}

          {/* Dynamic Content Tables */}
          {activeTab !== 'overview' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  {activeTab === 'products' && (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Info</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/50">
                        {inventory.map((med) => (
                          <tr key={med._id} className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:px-6">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                                  <img src={med.image} alt="" className="h-full w-full object-contain" />
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-slate-800">{med.name}</span>
                                  <span className="text-xs font-medium text-slate-500">{med.brand}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 sm:px-6">
                              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {med.category}
                              </span>
                            </td>
                            <td className="p-4 sm:px-6">
                              {med.isFlashDeal ? (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 border border-orange-100">
                                  <Zap className="h-3 w-3" /> Flash Deal
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-100">Standard</span>
                              )}
                            </td>
                            <td className="p-4 sm:px-6">
                              <span className="text-sm font-bold text-slate-800">₹{med.price}</span>
                            </td>
                            <td className="p-4 sm:px-6">
                              <div className="flex justify-center gap-3">
                                <button onClick={() => handleEdit(med)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(med._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'users' && (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User Profile</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Details</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/50">
                        {users.map((u) => (
                          <tr key={u._id} className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:px-6">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                                  {u.name[0]}
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-slate-800">{u.name}</span>
                                  <span className="text-xs font-medium text-slate-500">ID: {u._id.slice(-6)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 sm:px-6">
                              <span className="block text-sm font-medium text-slate-700">{u.email}</span>
                              <span className="text-xs text-slate-500">{u.phone}</span>
                            </td>
                            <td className="p-4 sm:px-6">
                              {u.isAdmin ? (
                                <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-100">Admin</span>
                              ) : u.isBlocked ? (
                                <span className="inline-flex rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 border border-red-100">Blocked</span>
                              ) : (
                                <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-100">Active</span>
                              )}
                            </td>
                            <td className="p-4 sm:px-6">
                              <div className="flex justify-center gap-3">
                                <button onClick={() => { setSelectedUser(u); setIsEmailModalOpen(true); }} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Mail className="h-4 w-4" /></button>
                                {!u.isAdmin && (
                                  <>
                                    <button onClick={() => handleBlockUser(u._id)} className={`rounded-lg p-2 transition-all ${u.isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-500 hover:bg-orange-50'}`}>
                                      <ShieldAlert className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteUser(u._id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'banners' && (
                    <div className="p-1">
                      <AdminBannerManager 
                        banners={banners} 
                        setBanners={setBanners} 
                        token={token} 
                        API_BASE={API_BASE} 
                        handleDeleteBanner={handleDeleteBanner} 
                      />
                    </div>
                  )}

                  {activeTab === 'brands' && (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Logo</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/50">
                        {brands.map((brand) => (
                          <tr key={brand._id} className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:px-6">
                              <div className="h-16 w-16 flex items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                                <img src={brand.image} className="h-full w-full object-contain" alt="" />
                              </div>
                            </td>
                            <td className="p-4 sm:px-6 text-sm font-semibold text-slate-800">{brand.name}</td>
                            <td className="p-4 sm:px-6 text-center">
                              <button onClick={() => handleDeleteBrand(brand._id)} className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </main>

      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleSaveProduct}
        initialData={editingProduct}
      />



      <AddBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onAdd={(newBrand) => setBrands([...brands, newBrand])}
        token={token}
      />

      <EmailUserModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        user={selectedUser}
        token={token}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;