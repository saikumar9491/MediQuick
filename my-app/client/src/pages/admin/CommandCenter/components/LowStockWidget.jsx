import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export const LowStockWidget = () => {
  const { medicines, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState('low_stock'); // 'low_stock' | 'expiring'

  useEffect(() => {
    if (!medicines || !Array.isArray(medicines)) return;
    try {
      if (tab === 'low_stock') {
        const filtered = medicines
          .filter(m => m.countInStock < (m.lowStockThreshold || 15))
          .map(m => ({
            id: m._id,
            name: m.name,
            sku: m.sku || m._id.substring(0, 6).toUpperCase(),
            category: m.category,
            value: `${m.countInStock} units left`,
            urgent: m.countInStock <= 5
          }));
        setData(filtered);
      } else {
        // Expiring soon: expiry date within next 60 days
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
        
        const filtered = medicines
          .filter(m => m.expiryDate && new Date(m.expiryDate) <= sixtyDaysFromNow)
          .map(m => {
            const exp = new Date(m.expiryDate);
            const daysLeft = Math.ceil((exp - new Date()) / (1000 * 60 * 60 * 24));
            return {
              id: m._id,
              name: m.name,
              sku: m.sku || m._id.substring(0, 6).toUpperCase(),
              category: m.category,
              value: daysLeft > 0 ? `${daysLeft} days until expiry` : 'Expired',
              urgent: daysLeft <= 15
            };
          });
        setData(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(contextLoading);
    }
  }, [medicines, tab, contextLoading]);

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="h-4 w-4 text-orange-500" />
          <h3 className="text-sm font-black text-slate-800">Inventory Alerts</h3>
        </div>
        
        <div className="flex bg-slate-100 rounded-lg p-1 w-full">
          <button
            onClick={() => setTab('low_stock')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
              tab === 'low_stock' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setTab('expiring')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors cursor-pointer ${
              tab === 'expiring' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expiring Soon
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 relative min-h-[280px] max-h-[350px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-3">
            {data.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors group">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.sku}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className={`text-[10px] font-black ${item.urgent ? 'text-rose-500 font-black' : 'text-orange-500'}`}>
                      {item.value}
                    </span>
                  </div>
                </div>
                <Button variant={tab === 'low_stock' ? 'warning' : 'outline'} size="sm" className="whitespace-nowrap flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tab === 'low_stock' ? 'Restock' : 'Review'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
            <span className="p-3 bg-slate-50 text-slate-300 rounded-full mb-2">
              <AlertOctagon className="h-6 w-6" />
            </span>
            <p className="text-xs font-bold">No inventory alerts found.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
