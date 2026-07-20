import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, Search, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchTrendsWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTrends([]);
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
          <Search className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-black text-slate-800">Search Trends</h3>
        </div>
        <Link to="/admin/search-discovery" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
          View Report
        </Link>
      </div>
      
      <div className="p-4 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <Search className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{t.term}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{t.count.toLocaleString()} searches today</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 text-[11px] font-black ${t.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                  {t.trend}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
