import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored dot icons for riders
const createRiderIcon = (riskStatus) => {
  let colorClass = 'bg-emerald-500';
  if (riskStatus === 'At Risk') colorClass = 'bg-orange-500';
  if (riskStatus === 'Breached') colorClass = 'bg-rose-500';

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center bg-white"><div class="w-3 h-3 rounded-full ${colorClass}"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MapController = ({ deliveries, selectedOrder }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedOrder) {
      // Find order to center
      const order = deliveries.find(d => d._id === selectedOrder);
      if (order && order.rider?.currentLocation) {
        map.flyTo([order.rider.currentLocation.lat, order.rider.currentLocation.lng], 15, { duration: 1.5 });
      } else if (order && order.shippingAddress?.coordinates) {
        // Fallback to customer address if rider has no location
        map.flyTo([order.shippingAddress.coordinates.lat, order.shippingAddress.coordinates.lng], 15, { duration: 1.5 });
      }
    }
  }, [selectedOrder, map, deliveries]);

  return null;
};

export const DeliveryMap = ({ deliveries, selectedOrder, onSelectOrder }) => {
  // Default center (e.g. New Delhi)
  const defaultCenter = [28.6139, 77.2090];
  
  const mapDeliveries = deliveries.filter(d => 
    (d.rider?.currentLocation?.lat && d.rider?.currentLocation?.lng) || 
    (d.shippingAddress?.coordinates?.lat && d.shippingAddress?.coordinates?.lng)
  );

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapController deliveries={deliveries} selectedOrder={selectedOrder} />

        {mapDeliveries.map(order => {
          const riderLoc = order.rider?.currentLocation;
          const customerLoc = order.shippingAddress?.coordinates; // Assuming coordinates exist for demo, if not we skip customer pin or line
          
          return (
            <React.Fragment key={order._id}>
              {/* Rider Marker */}
              {riderLoc && (
                <Marker 
                  position={[riderLoc.lat, riderLoc.lng]} 
                  icon={createRiderIcon(order.riskStatus)}
                  eventHandlers={{ click: () => onSelectOrder(order._id) }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-sm text-slate-800">{order.rider.name}</p>
                      <p className="text-xs text-slate-500 mb-1">{order.rider.phone}</p>
                      <hr className="my-1 border-slate-200" />
                      <p className="text-xs font-bold text-slate-700">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">Elapsed: {order.elapsedMins}m / {order.estimatedMins}m</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Customer Marker */}
              {customerLoc && customerLoc.lat && (
                <Marker 
                  position={[customerLoc.lat, customerLoc.lng]}
                  eventHandlers={{ click: () => onSelectOrder(order._id) }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-sm text-slate-800">{order.customerName}</p>
                      <p className="text-xs text-slate-500 mb-1">{order.shippingAddress.building}, {order.shippingAddress.pincode}</p>
                      <hr className="my-1 border-slate-200" />
                      <p className="text-xs font-bold text-slate-700">Status: {order.status}</p>
                      <p className="text-xs text-slate-500">{order.itemsCount} Items</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Connecting Line */}
              {riderLoc && customerLoc && customerLoc.lat && (
                <Polyline 
                  positions={[
                    [riderLoc.lat, riderLoc.lng],
                    [customerLoc.lat, customerLoc.lng]
                  ]}
                  color={order.riskStatus === 'Breached' ? '#f43f5e' : order.riskStatus === 'At Risk' ? '#f97316' : '#3b82f6'}
                  weight={3}
                  dashArray="5, 10"
                  opacity={0.6}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
