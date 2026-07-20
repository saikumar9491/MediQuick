import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Loader2, Package, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import { QuickAccessGrid } from './QuickAccessGrid';

export const ProductSearchPanel = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  
  // Auto-focus on load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/medicines?search=${query}`);
        setResults(res.data.medicines || res.data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      onAdd(results[0]);
      setQuery(''); // clear after adding top result
      searchInputRef.current.focus();
    }
  };

  const handleAddResult = (item) => {
    onAdd(item);
    // Optionally clear query after adding, or leave it for multiple qty
    searchInputRef.current.focus();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search Bar Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? <Loader2 className="h-5 w-5 text-slate-400 animate-spin" /> : <Search className="h-5 w-5 text-slate-400" />}
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg shadow-inner bg-slate-50 transition-colors"
            placeholder="Search by product name, generic salt, or SKU... (Press Enter for top result)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Search Results Dropdown/Grid */}
        {query.trim().length >= 2 && (
          <div className="mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {results.length === 0 && !loading ? (
              <div className="text-center py-8 text-slate-500 font-medium bg-slate-50 rounded-lg">
                No products found matching "{query}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map(item => (
                  <div 
                    key={item._id} 
                    onClick={() => handleAddResult(item)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      item.countInStock > 0 
                        ? 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5' 
                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-slate-100 bg-white" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate text-sm">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{item.salt || item.brand}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-black text-blue-600 text-sm">₹{item.price}</span>
                        {item.countInStock > 0 ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Package className="h-3 w-3" /> {item.countInStock}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                    {item.needsRx && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1" title="Prescription Required">
                          <AlertCircle className="h-3 w-3" /> Rx
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <QuickAccessGrid onAdd={handleAddResult} />
    </div>
  );
};
