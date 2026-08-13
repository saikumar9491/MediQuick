import { useCommandCenter } from '../CommandCenterContext';
import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export const TrendChart = () => {
  const { hourlyRevenue, loading } = useCommandCenter();

  // Process today vs yesterday hourly comparisons
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const chartData = hours.map(hour => {
    // Find item that matches the hour (backend format: "YYYY-MM-DD HH:00")
    const todayItem = hourlyRevenue?.today?.find(item => item._id.endsWith(hour));
    const yesterdayItem = hourlyRevenue?.yesterday?.find(item => item._id.endsWith(hour));
    return {
      hour,
      "Today (₹)": todayItem ? todayItem.total : 0,
      "Yesterday (₹)": yesterdayItem ? yesterdayItem.total : 0
    };
  });

  return (
    <Card className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-800">Hourly Revenue comparison</h3>
          <p className="text-xs text-slate-400 font-medium">Compare today's hourly performance against yesterday</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dx={-10} />
              <RechartsTooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} />
              <Line type="monotone" name="Today" dataKey="Today (₹)" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Yesterday" dataKey="Yesterday (₹)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
