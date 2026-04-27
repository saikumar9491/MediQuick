import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';

const AdminFlashDeals = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit/Add state
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [discountPrice, setDiscountPrice] = useState('');

  const { token } = useAuth();

  const fetchMedicines = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/medicines`);
      if (!response.ok) throw new Error("Could not reach Hub");
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const flashDeals = medicines.filter(m => m.isFlashDeal);
  const availableForFlash = medicines.filter(m => !m.isFlashDeal && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleFlashDeal = async (id, isFlashDeal, price) => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}/flash-deal`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          isFlashDeal,
          discountPrice: price
        })
      });

      if (!res.ok) throw new Error('Failed to update flash deal');
      toast.success(isFlashDeal ? 'Flash Deal added!' : 'Flash Deal removed!');
      fetchMedicines();
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#fdfdfd]">
        <div className="animate-spin text-4xl">⚡</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin-dashboard" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-900">
              ⚡ Flash Deals Manager
            </h1>
          </div>
          <button
            onClick={() => {
              setSelectedMedicine(null);
              setDiscountPrice('');
              setSearchQuery('');
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-orange-200 active:scale-95"
          >
            <span>+</span> Add Flash Deal
          </button>
        </div>

        {/* Active Deals List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-600">Active Daily Deals ({flashDeals.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">MRP / Base</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-orange-600">Flash Price</th>
                  <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {flashDeals.map((deal) => (
                  <tr key={deal._id} className="transition-colors hover:bg-orange-50/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={deal.image} alt={deal.name} className="h-10 w-10 rounded-lg object-contain bg-gray-50 border border-gray-100" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{deal.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{deal.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-400 line-through">₹{deal.price}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-lg text-orange-600">₹{deal.discountPrice}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(deal)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${deal.name} from Flash Deals?`)) {
                              handleToggleFlashDeal(deal._id, false, null);
                            }
                          }}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 transition-colors hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {flashDeals.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <div className="text-4xl mb-3 grayscale opacity-50">⚡</div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">No active flash deals.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">
            <h3 className="mb-6 text-xl font-black uppercase tracking-tighter text-slate-900">
              {selectedMedicine && selectedMedicine.isFlashDeal ? 'Edit Flash Deal' : 'Add Flash Deal'}
            </h3>

            {!selectedMedicine ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search inventory to add..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm font-bold outline-none transition focus:border-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {availableForFlash.length > 0 ? availableForFlash.map(med => (
                    <div key={med._id} onClick={() => { setSelectedMedicine(med); setDiscountPrice(med.price); }} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={med.image} alt={med.name} className="h-8 w-8 rounded-lg object-contain bg-white" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{med.name}</p>
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Base: ₹{med.price}</p>
                        </div>
                      </div>
                      <span className="text-orange-500 font-bold">Select</span>
                    </div>
                  )) : (
                    <p className="text-center text-xs text-gray-400 font-bold py-4">No matching items found.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                   <img src={selectedMedicine.image} alt={selectedMedicine.name} className="h-12 w-12 rounded-xl object-contain bg-white shadow-sm" />
                   <div>
                      <p className="text-sm font-black text-slate-900 line-clamp-1">{selectedMedicine.name}</p>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Price: ₹{selectedMedicine.price}</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">Flash Sale Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full rounded-xl border border-orange-200 p-3 text-lg font-black text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter discounted price"
                  />
                  {Number(discountPrice) >= selectedMedicine.price && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">Warning: Flash price should be lower than base price.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (!selectedMedicine.isFlashDeal) setSelectedMedicine(null);
                      else setShowAddModal(false);
                    }}
                    className="flex-1 rounded-xl bg-gray-100 py-3.5 text-[11px] font-black uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleToggleFlashDeal(selectedMedicine._id, true, discountPrice)}
                    disabled={!discountPrice}
                    className="flex-1 rounded-xl bg-orange-500 py-3.5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-orange-600 disabled:opacity-50"
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

export default AdminFlashDeals;
