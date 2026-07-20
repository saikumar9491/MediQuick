import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, ShoppingCart, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ActivityFeed = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEvents([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    
    fetchData();
    const refresher = setInterval(fetchData, 30000); // 30s auto-refresh
    return () => clearInterval(refresher);
  }, [orders, medicines, users, contextLoading]);

  const getEventIcon = (type) => {
    switch(type) {
      case 'order': return <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><ShoppingCart className="h-4 w-4" /></div>;
      case 'support': return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full"><MessageSquare className="h-4 w-4" /></div>;
      case 'alert': return <div className="p-2 bg-orange-50 text-orange-600 rounded-full"><AlertTriangle className="h-4 w-4" /></div>;
      case 'prescription': return <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><ShieldCheck className="h-4 w-4" /></div>;
      default: return <div className="p-2 bg-slate-50 text-slate-600 rounded-full"><div className="h-4 w-4 rounded-full bg-slate-400" /></div>;
    }
  };

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800">Live Activity Feed</h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE
        </span>
      </div>
      
      <div className="p-4 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading && events.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={event.id} className="relative flex gap-4">
                {/* Connecting line */}
                {idx !== events.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-16px] w-0.5 bg-slate-100"></div>
                )}
                
                <div className="relative z-10 flex-shrink-0">
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 pb-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-slate-800">{event.title}</p>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{event.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
