import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export const OrderStatusChart = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData([
          { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10B981' },
          { name: 'Processing', value: orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed' || o.status === 'Placed').length, color: '#3B82F6' },
          { name: 'Out for Delivery', value: orders.filter(o => o.status === 'Out for Delivery').length, color: '#F59E0B' },
          { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: '#EF4444' },
        ]);
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
      <h3 className="text-sm font-black text-slate-800 mb-6">Order Status Breakdown</h3>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                cursor="pointer"
                onClick={(entry) => console.log(`Clicked to filter orders by: ${entry.name}`)}
              >
                {data.map((entry, index) => (
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
