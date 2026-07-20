import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';

export const QuickAccessGrid = ({ onAdd }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickAccess = async () => {
      try {
        // Fetch trending items to use as quick access
        const res = await axios.get(`${API_BASE}/api/medicines?trending=true&limit=8`);
        // Filter out items with 0 stock to make it more useful
        const available = (res.data.medicines || res.data).filter(m => m.countInStock > 0);
        setItems(available.slice(0, 8)); // Ensure max 8
      } catch (err) {
        console.error('Failed to fetch quick access items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuickAccess();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[300px]">
        <h3 className="font-black text-slate-800 text-lg mb-4">Quick Add</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
      <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
        Quick Add <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Top Sellers</span>
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <div 
            key={item._id}
            onClick={() => onAdd(item)}
            className="flex flex-col border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md hover:-translate-y-1 transition-all group relative bg-white"
          >
            <div className="h-16 w-full flex items-center justify-center mb-2">
              <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain rounded" />
            </div>
            <h4 className="font-bold text-slate-800 text-xs truncate leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h4>
            <div className="flex items-end justify-between mt-auto pt-2">
              <span className="font-black text-blue-600 text-sm">₹{item.price}</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded flex items-center gap-0.5">
                <Package className="h-2 w-2" /> {item.countInStock}
              </span>
            </div>
            {item.needsRx && (
              <div className="absolute top-1 right-1 bg-orange-100 rounded-full p-0.5" title="Rx Required">
                <AlertCircle className="h-3 w-3 text-orange-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
