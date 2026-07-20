import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, Clock, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export const DeliveryPerformance = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    avgTime: { value: '24h', change: 0, isPositive: true },
    onTimeRate: { value: 100, change: 0, isPositive: true },
    delayedOrders: { value: 0, change: 0, isPositive: true }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({
          avgTime: { value: '24h', change: 0, isPositive: true },
          onTimeRate: { value: 100, change: 0, isPositive: true },
          delayedOrders: { value: 0, change: 0, isPositive: true }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  if (loading) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800">Delivery Performance</h3>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors">
          Fleet Console &rarr;
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4 flex-1">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100"><Clock className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Delivery Time</p>
              <h4 className="text-xl font-black text-slate-800">{data?.avgTime.value}</h4>
            </div>
          </div>
          <div className={`flex flex-col items-end text-xs font-bold ${data?.avgTime.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span className="flex items-center gap-0.5">
              {data?.avgTime.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {Math.abs(data?.avgTime.change)}%
            </span>
            <span className="text-[9px] text-slate-400 font-medium">vs last week</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-100"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Rate</p>
              <h4 className="text-xl font-black text-slate-800">{data?.onTimeRate.value}</h4>
            </div>
          </div>
          <div className={`flex flex-col items-end text-xs font-bold ${data?.onTimeRate.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span className="flex items-center gap-0.5">
              {data?.onTimeRate.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(data?.onTimeRate.change)}%
            </span>
            <span className="text-[9px] text-slate-400 font-medium">vs last week</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-orange-600 rounded-lg shadow-sm border border-slate-100"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delayed Orders</p>
              <h4 className="text-xl font-black text-slate-800">{data?.delayedOrders.value}</h4>
            </div>
          </div>
          <div className={`flex flex-col items-end text-xs font-bold ${data?.delayedOrders.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span className="flex items-center gap-0.5">
              {data?.delayedOrders.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {Math.abs(data?.delayedOrders.change)}%
            </span>
            <span className="text-[9px] text-slate-400 font-medium">vs last week</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
