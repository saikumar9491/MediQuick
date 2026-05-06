import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE } from '../utils/apiConfig';
import { TrendingUp, Plus, Trash2, Search, ArrowLeft } from 'lucide-react';

const AdminTrendingProducts = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { token } = useAuth();

  const fetchMedicines = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/medicines`);
      if (!res.ok) throw new Error("Could not reach Hub");
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const trendingProducts = medicines.filter(m => m.isTrending);
  const availableForTrending = medicines.filter(m => !m.isTrending && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
      toast.success(isTrending ? 'Added to Trending!' : 'Removed from Trending!');
      fetchMedicines();
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#fdfdfd]">
        <div className="animate-spin text-4xl text-blue-600">📈</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin-dashboard" className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-2 transition-colors">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-600" /> Trending Products
            </h1>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
          >
            <Plus size={16} /> Add Trending Product
          </button>
        </div>

        {/* Info Card */}
        <div className="mb-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <p className="text-sm font-bold text-blue-800 leading-relaxed">
            Trending products are displayed prominently on the homepage carousel. Use this manager to curate the most popular items for your customers.
          </p>
        </div>

        {/* Active Trending List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-600">Currently Trending ({trendingProducts.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Category</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Price</th>
                  <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trendingProducts.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-blue-50/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-slate-900">₹{product.price}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${product.name} from Trending?`)) {
                            handleToggleTrending(product._id, false);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove from Trending"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {trendingProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="text-4xl mb-4 grayscale opacity-30">📈</div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">No products marked as trending yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">
                Add to Trending
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                ✕
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-sm font-bold outline-none transition focus:border-blue-500 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {availableForTrending.length > 0 ? availableForTrending.map(med => (
                <div 
                  key={med._id} 
                  onClick={() => handleToggleTrending(med._id, true)} 
                  className="group flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-white cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img src={med.image} alt={med.name} className="h-10 w-10 rounded-lg object-contain bg-white border border-gray-100 p-1" />
                    <div className="max-w-[200px]">
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{med.name}</p>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{med.brand} • ₹{med.price}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={10} /> Add
                  </button>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">No matching products found</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Select a product to add it to the Trending section
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default AdminTrendingProducts;
