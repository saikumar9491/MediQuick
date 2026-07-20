import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, Star, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopCustomersWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCustomers([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-black text-slate-800">Top Customers</h3>
        </div>
        <Link to="/admin/customers" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
          View All
        </Link>
      </div>
      
      <div className="p-4 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs ${c.color}`}>
                      {c.initials}
                    </div>
                    {idx < 3 && (
                      <div className="absolute -top-1 -right-1 bg-amber-400 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs font-black text-slate-800">{c.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{c.orders} Orders Lifetime</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-black text-slate-800 flex items-center justify-end">
                    <IndianRupee className="h-3 w-3 text-slate-400 mr-0.5" />
                    {c.spend.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Spend</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
