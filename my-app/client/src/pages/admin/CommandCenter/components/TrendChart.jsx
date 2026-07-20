import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export const TrendChart = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [range, setRange] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const baseData = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString());
          baseData.push({
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            orders: dayOrders.length,
            revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
          });
        }
        setData(baseData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  return (
    <Card className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800">Orders & Revenue Trend</h3>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {['7d', '30d', '90d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-colors ${
                range === r ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={10} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" name="Orders" dataKey="orders" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" name="Revenue (₹)" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
