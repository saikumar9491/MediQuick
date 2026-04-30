import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trash2, Edit3, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const AdminFlashDealsSection = ({ inventory, setInventory, banners = [], setBanners, token }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [discountPrice, setDiscountPrice] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const flashDeals = inventory.filter(m => m.isFlashDeal);
  const availableForFlash = inventory.filter(m => !m.isFlashDeal && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleFlashDeal = async (id, isFlashDeal, price) => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}/flash-deal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isFlashDeal, discountPrice: price })
      });

      if (!res.ok) throw new Error('Failed to update flash deal');
      toast.success(isFlashDeal ? 'Flash Deal added! ⚡' : 'Flash Deal removed!');
      
      // Optimistic state sync
      setInventory(inventory.map(m => m._id === id ? { ...m, isFlashDeal, discountPrice: price } : m));
      setShowAddModal(false);
      setSelectedMedicine(null);
      setDiscountPrice('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setDiscountPrice(medicine.discountPrice || medicine.price);
    setShowAddModal(true);
  };

  const flashBanner = banners.find(b => b.category === 'flash');

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveFlashBanner = async () => {
    if (!bannerPreview && !flashBanner) return toast.error('Please select an image');
    const loadToast = toast.loading('Saving Banner...');
    try {
      const res = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Flash Sale Banner',
          image: bannerPreview,
          category: 'flash'
        })
      });
      if (!res.ok) throw new Error('Failed to save banner');
      const savedBanner = await res.json();
      toast.success('Flash Deal Banner Updated', { id: loadToast });
      setBannerFile(null);
      setBannerPreview('');
      if (setBanners) setBanners([...banners.filter(b => b.category !== 'flash'), savedBanner]);
    } catch (err) {
      toast.error(err.message, { id: loadToast });
    }
  };

  const handleDeleteBanner = async () => {
    if (!flashBanner || !window.confirm('Remove Flash Deal Banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/banners/${flashBanner._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to remove banner');
      toast.success('Banner removed');
      if (setBanners) setBanners(banners.filter(b => b._id !== flashBanner._id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 flex items-center gap-2">
            <Zap className="h-8 w-8 text-orange-500 fill-orange-500 animate-pulse" /> Flash Deals Manager
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
            Activate high-discount time-limited promos
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedMedicine(null);
            setDiscountPrice('');
            setSearchQuery('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-300"
        >
          <Plus className="h-4 w-4" /> Add Flash Deal
        </button>
      </div>

      {/* Flash Banner Manager */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
            <span className="text-lg">🖼️</span> Daily Flash Deals Banner
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Current/Preview Banner Display */}
          <div className="w-full md:w-2/3 h-[140px] sm:h-[180px] bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
            {(bannerPreview || flashBanner) ? (
              <img 
                src={bannerPreview || flashBanner.image} 
                alt="Flash Deal Banner" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-center text-gray-400">
                <span className="block text-3xl mb-2">📸</span>
                <span className="text-xs font-bold uppercase tracking-widest">No Banner Set</span>
              </div>
            )}
          </div>

          {/* Banner Controls */}
          <div className="w-full md:w-1/3 flex flex-col gap-3">
            <label className="cursor-pointer bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-blue-100 transition-colors">
              {flashBanner ? 'Change Image' : 'Upload Image'}
              <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
            </label>
            
            {bannerPreview && (
              <button 
                onClick={saveFlashBanner} 
                className="bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-orange-600 transition-colors"
              >
                Save Banner
              </button>
            )}

            {flashBanner && !bannerPreview && (
              <button 
                onClick={handleDeleteBanner} 
                className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl text-center hover:bg-red-100 transition-colors"
              >
                Delete Banner
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">MRP Base</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-orange-500">Flash Price</th>
                <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flashDeals.map((deal) => (
                <tr key={deal._id} className="transition-colors hover:bg-orange-50/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={deal.image} alt={deal.name} className="h-10 w-10 rounded-xl object-contain bg-slate-50 border border-gray-100" />
                      <div>
                        <p className="text-sm font-black italic uppercase text-slate-900 line-clamp-1">{deal.name}</p>
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">{deal.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-gray-400 line-through">₹{deal.price}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-base font-black text-orange-600">₹{deal.discountPrice}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEditModal(deal)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${deal.name} from Flash Deals?`)) {
                            handleToggleFlashDeal(deal._id, false, null);
                          }
                        }}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {flashDeals.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <Zap className="mx-auto h-12 w-12 text-gray-200" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2 mb-4">No Active Flash Deals</p>
                    <button
                      onClick={() => {
                        setSelectedMedicine(null);
                        setDiscountPrice('');
                        setSearchQuery('');
                        setShowAddModal(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4" /> Add Products to Flash Deals
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Products Section */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Available Products</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-8 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Base Price</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {availableForFlash.map((med) => (
                <tr key={med._id} className="transition-colors hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={med.image} alt={med.name} className="h-10 w-10 rounded-xl object-contain bg-white border border-gray-100 shadow-sm" />
                      <div>
                        <p className="text-sm font-black text-slate-800 line-clamp-1">{med.name}</p>
                        <span className="text-[9px] font-bold uppercase text-gray-400">{med.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700">₹{med.price}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openEditModal(med)}
                      className="rounded-lg bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-orange-600 transition-all hover:bg-orange-500 hover:text-white"
                    >
                      Make Flash Deal
                    </button>
                  </td>
                </tr>
              ))}
              {availableForFlash.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No available products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="text-orange-500 h-5 w-5 fill-orange-500" /> {selectedMedicine && selectedMedicine.isFlashDeal ? 'Edit Flash Deal' : 'Add Flash Deal'}
            </h3>

            {!selectedMedicine ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500"
                  />
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {availableForFlash.map(med => (
                    <div 
                      key={med._id} 
                      onClick={() => { setSelectedMedicine(med); setDiscountPrice(med.price); }} 
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <img src={med.image} alt={med.name} className="h-8 w-8 rounded-lg object-contain bg-white shadow-sm" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{med.name}</p>
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Base: ₹{med.price}</p>
                        </div>
                      </div>
                      <span className="text-orange-500 text-xs font-black uppercase">Select</span>
                    </div>
                  ))}
                  {availableForFlash.length === 0 && (
                    <p className="text-center text-xs text-gray-400 font-bold py-4">No matching items</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <img src={selectedMedicine.image} alt="" className="h-12 w-12 rounded-xl object-contain bg-white shadow-sm p-1" />
                  <div>
                    <p className="text-sm font-black uppercase italic text-slate-900">{selectedMedicine.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Base Price: ₹{selectedMedicine.price}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">Flash Sale Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full rounded-xl border border-orange-200 p-3 text-lg font-black text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { if (!selectedMedicine.isFlashDeal) setSelectedMedicine(null); else setShowAddModal(false); }}
                    className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleToggleFlashDeal(selectedMedicine._id, true, discountPrice)}
                    disabled={!discountPrice}
                    className="flex-1 rounded-xl bg-orange-500 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    Save Deal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlashDealsSection;
