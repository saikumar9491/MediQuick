import React, { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, Package, Activity, AlertOctagon, XCircle, AlertTriangle } from 'lucide-react';
import { fetchProductsStats } from '../../../../api/products';

export const ProductsStatsStrip = ({ setStockStatus }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setError(false);
        const data = await fetchProductsStats();
        setStats({
          total: data.totalProducts || 0,
          active: data.activeProducts || 0,
          lowStock: data.lowStock || 0,
          outOfStock: data.outOfStock || 0
        });
      } catch (err) {
        console.error('ProductsStatsStrip Fetch Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
        {[1,2,3,4].map(i => (
          <Card key={i} className="h-24 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-slate-300" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-100 flex items-center justify-center text-red-600">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span className="text-sm font-semibold">Failed to load product statistics.</span>
      </Card>
    );
  }

  const items = [
    { label: 'Total Products', value: stats?.total, icon: <Package className="h-4 w-4" />, color: 'bg-blue-50 text-blue-600 border-blue-100', onClick: () => setStockStatus && setStockStatus('All') },
    { label: 'Active Products', value: stats?.active, icon: <Activity className="h-4 w-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Low Stock', value: stats?.lowStock, icon: <AlertOctagon className="h-4 w-4" />, color: 'bg-orange-50 text-orange-600 border-orange-100', onClick: () => setStockStatus && setStockStatus('low_stock') },
    { label: 'Out of Stock', value: stats?.outOfStock, icon: <XCircle className="h-4 w-4" />, color: 'bg-rose-50 text-rose-600 border-rose-100', onClick: () => setStockStatus && setStockStatus('out_of_stock') },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {items.map((item, idx) => (
        <Card 
          key={idx} 
          onClick={item.onClick}
          className={`p-4 flex flex-col justify-between transition-shadow ${item.onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg border ${item.color}`}>
              {item.icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">{(item.value || 0).toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{item.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
