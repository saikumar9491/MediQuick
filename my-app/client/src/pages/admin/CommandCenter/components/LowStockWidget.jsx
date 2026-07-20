import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export const LowStockWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState('low_stock'); // 'low_stock' | 'expiring'

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        setItems(medicines.filter(m => m.countInStock < 15).map(m => ({
          id: m._id,
          name: m.name,
          sku: m._id.substring(0, 6),
          current: m.countInStock,
          threshold: 15,
          status: m.countInStock === 0 ? 'Out of Stock' : 'Critical'
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [tab]);

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
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
              tab === 'low_stock' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setTab('expiring')}
            className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
              tab === 'expiring' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expiring Soon
          </button>
        </div>
      </div>
      
      <div className="p-2 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-1">
            {data.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.category}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className={`text-[10px] font-black ${item.urgent ? 'text-rose-500' : 'text-orange-500'}`}>
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
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-xs font-bold mt-4">No alerts found.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
