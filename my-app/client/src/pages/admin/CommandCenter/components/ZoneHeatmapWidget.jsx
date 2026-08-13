import { useCommandCenter } from '../CommandCenterContext';
import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const ZoneHeatmapWidget = () => {
  const { zoneDensity, loading } = useCommandCenter();

  // Amritsar as central base location
  const defaultCenter = [31.6340, 74.8723];

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-800">Order Density Map</h3>
          <p className="text-xs text-slate-400 font-medium">Real-time geographic delivery hotspot concentrations</p>
        </div>
        <Link to="/admin/radar" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Live Radar &rarr;
        </Link>
      </div>

      <div className="flex-1 relative min-h-[350px] w-full" style={{ height: '350px' }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1000]">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <MapContainer 
            center={defaultCenter} 
            zoom={12} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(zoneDensity || []).map((zone, idx) => {
              const position = [zone.lat || 31.634, zone.lng || 74.872];
              const radius = Math.min(Math.max((zone.count || 1) * 6, 8), 35);
              
              return (
                <CircleMarker
                  key={idx}
                  center={position}
                  radius={radius}
                  pathOptions={{
                    color: '#EF4444',
                    fillColor: '#EF4444',
                    fillOpacity: 0.4,
                    weight: 1.5
                  }}
                >
                  <Popup>
                    <div className="text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="h-3 w-3 text-red-500" />
                        <span>{zone.city || 'Punjab'} - {zone.pincode}</span>
                      </div>
                      <div className="mt-1 font-black text-blue-600">
                        {zone.count} Active Orders
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </Card>
  );
};
