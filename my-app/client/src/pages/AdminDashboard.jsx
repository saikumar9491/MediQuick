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
  const [activeTab, setActiveTab] = useState('inventory');
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="sm:ml-20 transition-all duration-300 min-h-screen p-4 sm:p-8 lg:p-12">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-7xl"
        >
          {/* Header */}
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 sm:text-4xl"
              >
                Operational <span className="text-blue-600">Hub</span>
              </motion.h1>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                Command & Control Interface v2.0
              </p>
            </div>

            <div className="flex items-center gap-4">
              {activeTab === 'inventory' && (
                <Link
                  to="/admin/flash-deals"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-orange-500 px-6 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  <Zap className="h-4 w-4" />
                  <span>Flash Deals</span>
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (activeTab === 'inventory') handleAddNew();
                  if (activeTab === 'banners') setIsBannerModalOpen(true);
                  if (activeTab === 'brands') setIsBrandModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-xs font-black uppercase italic tracking-widest text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {activeTab === 'inventory' ? 'Add Unit' : activeTab === 'banners' ? 'Add Banner' : activeTab === 'brands' ? 'Add Brand' : 'Admin Status'}
              </motion.button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Inventory', value: inventory.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Active Banners', value: banners.length, icon: ImageIcon, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Market Reach', value: 'Live', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black italic text-gray-900">{stat.value}</p>
                <div className="absolute -bottom-2 -right-2 text-6xl opacity-[0.03]">
                  <stat.icon />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Content Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl"
            >
              <div className="overflow-x-auto custom-scrollbar">
                {activeTab === 'inventory' && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Unit</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Valuation</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inventory.map((med) => (
                        <tr key={med._id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                                <img src={med.image} alt="" className="h-full w-full object-contain" />
                              </div>
                              <div>
                                <span className="block text-sm font-black uppercase italic text-gray-900">{med.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{med.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-600">
                              {med.category}
                            </span>
                          </td>
                          <td className="p-6">
                            {med.isFlashDeal ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-600">
                                <Zap className="h-3 w-3" /> Deal
                              </span>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Normal</span>
                            )}
                          </td>
                          <td className="p-6">
                            <span className="text-sm font-black text-blue-600">₹{med.price}</span>
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-4">
                              <button onClick={() => handleEdit(med)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 className="h-4 w-4" /></button>
                              <button onClick={() => handleDelete(med._id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'users' && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Personnel Profile</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Communication</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Security Clearance</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Protocols</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u._id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 font-black">
                                {u.name[0]}
                              </div>
                              <div>
                                <span className="block text-sm font-black uppercase italic text-gray-900">{u.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Sector {u._id.slice(-4)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="block text-xs font-bold text-gray-600">{u.email}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.phone}</span>
                          </td>
                          <td className="p-6">
                            {u.isAdmin ? (
                              <span className="rounded-lg bg-purple-50 px-3 py-1 text-[10px] font-black uppercase text-purple-600">Master Level</span>
                            ) : u.isBlocked ? (
                              <span className="rounded-lg bg-red-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg shadow-red-500/20">Access Revoked</span>
                            ) : (
                              <span className="rounded-lg bg-green-50 px-3 py-1 text-[10px] font-black uppercase text-green-600">Verified</span>
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-4">
                              <button onClick={() => { setSelectedUser(u); setIsEmailModalOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><Mail className="h-4 w-4" /></button>
                              {!u.isAdmin && (
                                <>
                                  <button onClick={() => handleBlockUser(u._id)} className={`rounded-lg p-2 transition-all ${u.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}>
                                    <ShieldAlert className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDeleteUser(u._id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
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
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Payload</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Deployment Logic</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {banners.map((b) => (
                        <tr key={b._id}>
                          <td className="p-6">
                            <div className="relative group/img overflow-hidden rounded-2xl border border-gray-100 shadow-sm h-24 w-64 bg-gray-50">
                              <img src={b.image} className="h-full w-full object-cover transition-transform group-hover/img:scale-110" alt="" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="text-white h-6 w-6" />
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="block text-xs font-black uppercase italic text-gray-900">{b.title}</span>
                            <span className="text-[10px] font-bold text-blue-500 underline truncate block max-w-xs">{b.link}</span>
                          </td>
                          <td className="p-6 text-center">
                            <button onClick={() => handleDeleteBanner(b._id)} className="rounded-xl bg-red-50 px-4 py-2 text-[10px] font-black uppercase text-red-500 transition-all hover:bg-red-500 hover:text-white">Decommission</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'brands' && (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Identity</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                        <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {brands.map((brand) => (
                        <tr key={brand._id}>
                          <td className="p-6">
                            <div className="h-16 w-16 flex items-center justify-center rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                              <img src={brand.image} className="h-full w-full object-contain" alt="" />
                            </div>
                          </td>
                          <td className="p-6 text-xs font-black uppercase italic text-gray-900 tracking-tight">{brand.name}</td>
                          <td className="p-6 text-center">
                            <button onClick={() => handleDeleteBrand(brand._id)} className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 hover:underline">Remove Associate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
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