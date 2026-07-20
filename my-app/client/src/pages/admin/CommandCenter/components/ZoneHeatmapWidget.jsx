import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ZoneHeatmapWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setZones([]);
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
      <div className="p-6 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800">Delivery Zones Heatmap</h3>
        <Link to="/admin/radar" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Live Radar &rarr;
        </Link>
      </div>
      
      <div className="p-6 flex-1 relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Abstract minimap representation using progress bars */}
            {zones.map((zone, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className={`h-4 w-4 ${zone.color.replace('bg-', 'text-')}`} />
                    <span className="text-xs font-black text-slate-800">{zone.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{zone.deliveries} Active</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${zone.color} ${zone.width} opacity-80`}></div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <p className="text-xs text-slate-600 text-center font-medium">
                North Zone is currently experiencing high delivery volume. Consider routing additional fleet resources.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
