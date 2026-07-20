import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { AbandonedCartStatsStrip } from './components/AbandonedCartStatsStrip';
import { AbandonedCartTable } from './components/AbandonedCartTable';
import toast from 'react-hot-toast';

const AbandonedCart = () => {
  const [carts, setCarts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/carts/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching cart stats', err);
    }
  };

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/carts/abandoned?hours=2`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarts(res.data);
    } catch (err) {
      toast.error('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCarts();
  }, [fetchCarts]);

  const handleRefresh = () => {
    fetchStats();
    fetchCarts();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
            Abandoned Carts
          </h1>
          <p className="text-sm text-slate-500 font-medium">Recover lost sales from incomplete checkouts</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AbandonedCartStatsStrip stats={stats} />
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <AbandonedCartTable 
            carts={carts}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default AbandonedCart;
