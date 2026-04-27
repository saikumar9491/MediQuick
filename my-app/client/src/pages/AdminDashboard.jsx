import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import AddBannerModal from '../components/admin/AddBannerModal';
import AddBrandModal from '../components/admin/AddBrandModal';
import EmailUserModal from '../components/admin/EmailUserModal';
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

  const { user, token, setUser } = useAuth();

  /**
   * --- HUB PROTOCOL: Fetch Data ---
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fetching for performance
      const [invRes, userRes, bannerRes, brandRes] = await Promise.all([
        fetch(`${API_BASE}/api/medicines`),
        fetch(`${API_BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/banners`),
        fetch(`${API_BASE}/api/brands`)
      ]);

      const [invData, userData, bannerData, brandData] = await Promise.all([
        invRes.json(),
        userRes.json(),
        bannerRes.json(),
        brandRes.json()
      ]);

      setInventory(Array.isArray(invData) ? invData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setBanners(Array.isArray(bannerData) ? bannerData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync with Hub database');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /**
   * --- OPERATION: Save/Update Unit ---
   */
  const handleSaveProduct = async (productData) => {
    const isEdit = !!editingProduct;
    const url = isEdit
      ? `${API_BASE}/api/medicines/${editingProduct._id}`
      : `${API_BASE}/api/medicines`;

    const method = isEdit ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      return data;
    });

    toast.promise(savePromise, {
      loading: isEdit ? 'Updating Unit...' : 'Uploading to Hub...',
      success: isEdit ? 'Unit Updated!' : 'New Unit Added!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await savePromise;
      fetchData(); // Refresh list after save
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  /**
   * --- OPERATION: Purge Unit ---
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this medicine from Amritsar Hub permanently?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Unit purged from inventory');
        setInventory((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      toast.error('Hub connection error');
    }
  };

  /**
   * --- OPERATION: User Management ---
   */
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
    } catch (err) {
      toast.error('Block operation failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('User deleted');
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      toast.error('Delete operation failed');
    }
  };

  /**
   * --- OPERATION: Banner/Brand Management ---
   */
  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Banner deleted');
        setBanners(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/brands/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Brand deleted');
        setBrands(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#2874f0]"></div>
          <p className="text-sm font-black uppercase italic tracking-wide text-gray-700">
            Establishing Satellite Link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-16 sm:pb-20">
      <main className="mx-auto max-w-[1400px] px-4 pt-24 py-6 sm:px-6 sm:py-8 sm:pt-28">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase italic leading-tight text-gray-800">
              Admin Control Center
            </h1>
            <p className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[3px] sm:tracking-[4px] text-gray-400">
              System Management Protocol
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {activeTab === 'inventory' && (
              <Link
                to="/admin/flash-deals"
                className="w-full rounded-md bg-orange-500 px-5 py-3 text-[10px] sm:w-auto sm:px-8 sm:py-4 sm:text-xs font-black italic tracking-[2px] sm:tracking-widest text-white shadow-xl transition-all hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>⚡</span> FLASH DEALS MANAGER
              </Link>
            )}
            <button
              onClick={() => {
                if (activeTab === 'inventory') handleAddNew();
                if (activeTab === 'banners') setIsBannerModalOpen(true);
                if (activeTab === 'brands') setIsBrandModalOpen(true);
              }}
              className="w-full rounded-md bg-[#2874f0] px-5 py-3 text-[10px] sm:w-auto sm:px-8 sm:py-4 sm:text-xs font-black italic tracking-[2px] sm:tracking-widest text-white shadow-xl transition-all hover:bg-blue-700 active:scale-95"
            >
              + {activeTab === 'inventory' ? 'REGISTER NEW MEDICINE' : activeTab === 'banners' ? 'UPLOAD NEW BANNER' : activeTab === 'brands' ? 'ADD FEATURED BRAND' : 'MANAGE USERS'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 sm:mb-8 border-b border-gray-200">
          {['inventory', 'users', 'banners', 'brands'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* System Stats Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 md:grid-cols-4 md:gap-6">
          <div className="rounded-md border-l-4 border-blue-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Inventory Units</p>
            <p className="text-2xl font-black italic text-gray-800">{inventory.length}</p>
          </div>
          <div className="rounded-md border-l-4 border-purple-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Users</p>
            <p className="text-2xl font-black italic text-gray-800">{users.length}</p>
          </div>
          <div className="rounded-md border-l-4 border-green-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Featured Brands</p>
            <p className="text-2xl font-black italic text-gray-800">{brands.length}</p>
          </div>
          <div className="rounded-md border-l-4 border-yellow-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">System Status</p>
            <p className="text-lg font-black italic text-green-600 uppercase">Online</p>
          </div>
        </div>

        {/* System Stats Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 md:grid-cols-3 md:gap-6">
          <div className="rounded-md border-l-4 border-blue-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Active Stock Units
            </p>
            <p className="text-2xl sm:text-3xl font-black italic text-gray-800">
              {inventory.length}
            </p>
          </div>

          <div className="rounded-md border-l-4 border-green-500 bg-white p-5 shadow-sm opacity-70 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Live Hub Orders
            </p>
            <p className="text-2xl sm:text-3xl font-black italic text-gray-800">12</p>
          </div>

          <div className="rounded-md border-l-4 border-yellow-500 bg-white p-5 shadow-sm opacity-70 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              System Status
            </p>
            <p className="text-lg sm:text-xl font-black italic text-green-600">ONLINE</p>
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-2xl">
          <div className="overflow-x-auto">
            {activeTab === 'inventory' && (
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Unit Details</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Classification</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Valuation</th>
                    <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {inventory.map((med) => (
                    <tr key={med._id} className="group transition-colors hover:bg-blue-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={med.image} alt={med.name} className="h-12 w-12 rounded-sm border p-1 object-contain bg-white" />
                          <div>
                            <span className="block text-xs font-black uppercase italic text-gray-800">{med.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{med.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[10px] font-black uppercase italic text-gray-500">{med.category}</td>
                      <td className="p-4">
                        {med.isFlashDeal ? <span className="bg-blue-100 px-2 py-0.5 text-[8px] font-black uppercase text-blue-600 rounded-full">⚡ Flash Deal</span> : <span className="text-[9px] font-bold text-gray-300">Standard</span>}
                      </td>
                      <td className="p-4 text-sm font-black text-blue-600">₹{med.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-6">
                          <button onClick={() => handleEdit(med)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(med._id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Purge</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'users' && (
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">User Profile</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Contact Info</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Security Protocols</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="group transition-colors hover:bg-purple-50/50">
                      <td className="p-4">
                        <div>
                          <span className="block text-xs font-black uppercase italic text-gray-800">{u.name}</span>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {u._id.slice(-8)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="block text-[10px] font-bold text-gray-600">{u.email}</span>
                        <span className="text-[10px] font-bold text-gray-400">{u.phone}</span>
                      </td>
                      <td className="p-4">
                        {u.isAdmin ? (
                          <span className="bg-purple-100 px-2 py-0.5 text-[8px] font-black uppercase text-purple-600 rounded-sm">Master Admin</span>
                        ) : u.isBlocked ? (
                          <span className="bg-red-600 px-2 py-0.5 text-[8px] font-black uppercase text-white rounded-sm">Blocked</span>
                        ) : (
                          <span className="bg-green-100 px-2 py-0.5 text-[8px] font-black uppercase text-green-600 rounded-sm">Verified User</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-4">
                          <button onClick={() => { setSelectedUser(u); setIsEmailModalOpen(true); }} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Message</button>
                          {!u.isAdmin && (
                            <>
                              <button onClick={() => handleBlockUser(u._id)} className={`text-[10px] font-black uppercase hover:underline ${u.isBlocked ? 'text-green-600' : 'text-orange-500'}`}>
                                {u.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                              <button onClick={() => handleDeleteUser(u._id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Delete</button>
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
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Banner Preview</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Title / Link</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {banners.map((b) => (
                    <tr key={b._id}>
                      <td className="p-4"><img src={b.image} className="h-12 w-32 object-cover rounded border" alt="banner" /></td>
                      <td className="p-4">
                        <span className="block text-[10px] font-black uppercase text-gray-800">{b.title}</span>
                        <span className="text-[9px] text-blue-500 underline truncate block max-w-xs">{b.link}</span>
                      </td>
                      <td className="p-4"><span className="text-[10px] font-black text-green-600">ACTIVE</span></td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteBanner(b._id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'brands' && (
              <table className="min-w-[760px] w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Brand Logo</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Brand Name</th>
                    <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {brands.map((brand) => (
                    <tr key={brand._id}>
                      <td className="p-4"><img src={brand.image} className="h-10 w-10 object-contain p-1 border rounded bg-white" alt="brand" /></td>
                      <td className="p-4 text-xs font-black uppercase italic text-gray-800">{brand.name}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteBrand(brand._id)} className="text-[10px] font-black uppercase text-red-500 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
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
    </div>
  );
};

export default AdminDashboard;