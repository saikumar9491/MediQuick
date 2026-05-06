import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { TrendingUp, Plus, Trash2, Search } from 'lucide-react';
import { API_BASE } from '../../utils/apiConfig';

const AdminTrendingSection = ({ inventory, setInventory, token }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const trendingProducts = inventory.filter(m => m.isTrending);
  const availableForTrending = inventory.filter(m => !m.isTrending && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleToggleTrending = async (id, isTrending) => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}/trending`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isTrending })
      });

      if (!res.ok) throw new Error('Failed to update trending status');
      
      const updatedProduct = await res.json();
      setInventory(prev => prev.map(p => p._id === id ? updatedProduct : p));
      
      toast.success(isTrending ? 'Added to Trending!' : 'Removed from Trending!');
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Trending Products Management
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Currently displaying {trendingProducts.length} items in the trending carousel.
          </p>
        </div>
        <button
          onClick={() => {
            setSearchQuery('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus size={16} /> Add Trending
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendingProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg border border-slate-100 bg-white p-1">
                        <img src={product.image} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Remove from trending?')) {
                          handleToggleTrending(product._id, false);
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {trendingProducts.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">No trending products curated yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Curate Trending</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {availableForTrending.map(med => (
                <div 
                  key={med._id}
                  onClick={() => handleToggleTrending(med._id, true)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={med.image} alt="" className="h-8 w-8 rounded-lg object-contain bg-white border border-slate-100 p-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{med.name}</p>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">₹{med.price}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Add</span>
                </div>
              ))}
              {availableForTrending.length === 0 && (
                <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminTrendingSection;
