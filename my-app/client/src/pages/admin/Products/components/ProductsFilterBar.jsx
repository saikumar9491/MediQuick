import React, { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Search, Filter, X } from 'lucide-react';
import { fetchCategories } from '../../../../api/products';

export const ProductsFilterBar = ({ 
  searchTerm, setSearchTerm, 
  category, setCategory, 
  stockStatus, setStockStatus, 
  prescriptionReq, setPrescriptionReq 
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [categoriesList, setCategoriesList] = useState([]);

  // Fetch unique categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        // Assuming data is an array of category objects { name: '...' }
        if (Array.isArray(data)) {
          setCategoriesList(data.map(cat => cat.name || cat));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchTerm]);

  // Sync external clear events back to local state
  useEffect(() => {
    if (searchTerm === '') {
      setLocalSearch('');
    }
  }, [searchTerm]);

  const handleClear = () => {
    setLocalSearch('');
    setCategory('All');
    setStockStatus('All');
    setPrescriptionReq('All');
  };

  const hasFilters = localSearch !== '' || category !== 'All' || stockStatus !== 'All' || prescriptionReq !== 'All';

  return (
    <Card className="p-4 animate-in fade-in duration-500 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by product name or salt/generic name..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-colors ${category !== 'All' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
            <Filter className={`h-3 w-3 ${category !== 'All' ? 'text-blue-500' : 'text-slate-400'}`} />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${category !== 'All' ? 'text-blue-700' : 'text-slate-700'}`}
            >
              <option value="All" className="text-slate-700">All Categories</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat} className="text-slate-700">{cat}</option>
              ))}
            </select>
          </div>

          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-colors ${stockStatus !== 'All' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
            <select 
              value={stockStatus} 
              onChange={(e) => setStockStatus(e.target.value)}
              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${stockStatus !== 'All' ? 'text-blue-700' : 'text-slate-700'}`}
            >
              <option value="All" className="text-slate-700">All Stock</option>
              <option value="in_stock" className="text-slate-700">In Stock</option>
              <option value="low_stock" className="text-slate-700">Low Stock</option>
              <option value="out_of_stock" className="text-slate-700">Out of Stock</option>
            </select>
          </div>

          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-colors ${prescriptionReq !== 'All' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
            <select 
              value={prescriptionReq} 
              onChange={(e) => setPrescriptionReq(e.target.value)}
              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${prescriptionReq !== 'All' ? 'text-blue-700' : 'text-slate-700'}`}
            >
              <option value="All" className="text-slate-700">Prescription: All</option>
              <option value="true" className="text-slate-700">Rx Required</option>
              <option value="false" className="text-slate-700">OTC Only</option>
            </select>
          </div>

          {hasFilters && (
            <button 
              onClick={handleClear}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 ml-2"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
