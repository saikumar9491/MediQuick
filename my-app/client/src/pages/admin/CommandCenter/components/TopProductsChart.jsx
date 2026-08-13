import { useCommandCenter } from '../CommandCenterContext';
import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export const TopProductsChart = () => {
  const { topProducts, loading } = useCommandCenter();

  // Format data for Recharts BarChart
  const chartData = (topProducts || []).map(item => ({
    name: item.name,
    sales: item.unitsSold,
    stock: item.stock
  })).sort((a, b) => b.sales - a.sales);

  return (
    <Card className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      <div>
        <h3 className="text-sm font-black text-slate-800">Top Selling Products</h3>
        <p className="text-xs text-slate-400 font-medium">Top 10 highest-volume products sold today</p>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px] text-slate-400 font-medium text-xs">
          No product sales recorded today
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#E5E7EB" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={140} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#475569', fontWeight: 'bold' }} 
              />
              <RechartsTooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold', color: '#2563EB' }}
              />
              <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3B82F6" className="hover:opacity-80 transition-opacity" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
