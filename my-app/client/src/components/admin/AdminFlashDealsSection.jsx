import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trash2, Edit3, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const AdminFlashDealsSection = ({ inventory, setInventory, token }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [discountPrice, setDiscountPrice] = useState('');

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
                          if (window.confirm(`Remove ${deal.name} from Flash Deals?`)) {
                            handleToggleFlashDeal(deal._id, false, null);
                          }
                        }}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {flashDeals.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <Zap className="mx-auto h-12 w-12 text-gray-200" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">No Active Flash Deals</p>
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
