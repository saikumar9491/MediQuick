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
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import AddBannerModal from '../components/admin/AddBannerModal';
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
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="sm:ml-20 transition-all duration-300 min-h-screen p-4 sm:p-8 lg:p-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-7xl"
        >
          {/* Header */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
              >
                {activeTab === 'overview' ? (
                  <>Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Overview</span></>
                ) : activeTab === 'products' ? (
                  <>Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Management</span></>
                ) : activeTab === 'users' ? (
                  <>User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Base</span></>
                ) : (
                  <span className="capitalize">{activeTab} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Management</span></span>
                )}
              </motion.h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {activeTab === 'overview' ? 'Manage your inventory, users, and platform settings.' : `Manage your ${activeTab} data and configurations.`}
              </p>
            </div>

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
                {['products', 'banners', 'brands'].includes(activeTab) && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (activeTab === 'products') handleAddNew();
                      if (activeTab === 'banners') setIsBannerModalOpen(true);
                      if (activeTab === 'brands') setIsBrandModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <Plus className="h-4 w-4" />
                    {activeTab === 'products' ? 'Add Product' : activeTab === 'banners' ? 'Add Banner' : activeTab === 'brands' ? 'Add Brand' : 'Add New'}
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          {activeTab === 'overview' && (
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Products', value: inventory.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Registered Users', value: users.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Active Banners', value: banners.length, icon: ImageIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'System Status', value: 'Online', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.02] text-slate-900 transition-transform group-hover:scale-110">
                  <stat.icon />
                </div>
              </motion.div>
            ))}
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
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Visual Payload</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deployment Logic</th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/50">
                        {banners.map((b) => (
                          <tr key={b._id} className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4 sm:px-6">
                              <div className="relative group/img overflow-hidden rounded-xl border border-slate-100 shadow-sm h-24 w-64 bg-slate-50">
                                <img src={b.image} className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt="" />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <ExternalLink className="text-white h-6 w-6" />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 sm:px-6">
                              <span className="block text-sm font-semibold text-slate-800">{b.title}</span>
                              <span className="text-xs font-medium text-blue-500 hover:underline truncate block max-w-xs">{b.link}</span>
                            </td>
                            <td className="p-4 sm:px-6 text-center">
                              <button onClick={() => handleDeleteBanner(b._id)} className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white shadow-sm">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

      <AddBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onAdd={(newBanner) => setBanners([...banners, newBanner])}
        token={token}
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