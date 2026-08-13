import { useCommandCenter } from '../CommandCenterContext';
import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export const OrderStatusChart = () => {
  const { orderStatus, loading } = useCommandCenter();

  // Map backend orderStatus aggregation to chart values
  const getStatusCount = (statusKeys) => {
    return (orderStatus || [])
      .filter(item => statusKeys.includes(item._id))
      .reduce((sum, item) => sum + item.count, 0);
  };

  const chartData = [
    { name: 'Delivered', value: getStatusCount(['Delivered']), color: '#10B981' },
    { name: 'Processing', value: getStatusCount(['Processing', 'Confirmed', 'Placed']), color: '#3B82F6' },
    { name: 'Out for Delivery', value: getStatusCount(['Out for Delivery']), color: '#F59E0B' },
    { name: 'Cancelled', value: getStatusCount(['Cancelled']), color: '#EF4444' },
  ].filter(item => item.value > 0);

  return (
    <Card className="p-6 h-full flex flex-col animate-in fade-in duration-500">
      <h3 className="text-sm font-black text-slate-800 mb-6">Order Status Breakdown</h3>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px] text-slate-400 font-medium text-xs">
          No orders tracked
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend 
                iconType="circle" 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
