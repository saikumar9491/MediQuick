import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user, token } = useAuth(); // Get token for secure fetch
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Check if we have both user and token
      if (!user?._id || !token) {
        setLoading(false);
        return;
      }

      try {
        // 2. Use the dynamic API Base URL
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // 3. SECURE FETCH: Add the Authorization header
        const res = await fetch(`${API_BASE}/api/orders/user/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Order sync failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]); // Add token to dependency array

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="animate-bounce text-4xl">📦</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-20 pt-24"> {/* Added more padding for nav */}
      <div className="max-w-5xl mx-auto px-4">
        
        {/* UNIQUE DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Track Your <span className="text-blue-600">Health Shipments</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[3px] mt-2">
              Verified Hub Deliveries • {orders.length} Active Shipments
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-white border-2 border-gray-900 px-6 py-2 text-[10px] font-black uppercase hover:bg-gray-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            Order New Medicines
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <span className="text-5xl grayscale mb-4 block">💊</span>
            <p className="font-black text-gray-400 uppercase italic tracking-widest">No prescription history found.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 text-blue-600 font-black uppercase text-xs hover:underline"
            >
              Check Available Medicines →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-2xl hover:shadow-md transition-shadow">
                
                {/* ORDER INFO BAR */}
                <div className="bg-gray-50 p-6 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order Ref</p>
                      <p className="text-xs font-black text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Placed On</p>
                      <p className="text-xs font-black text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Bill</p>
                      <p className="text-xs font-black text-blue-600">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase italic ${
                    order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {order.status || 'Hub Dispatched'} ✔
                  </span>
                </div>

                {/* TRACKING PROGRESS TRACKER */}
                <div className="p-10 border-b">
                   <div className="relative flex justify-between max-w-3xl mx-auto">
                      {/* Tracking Line Background */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                      
                      {/* Dynamic Progress Line */}
                      <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-1000 rounded-full" 
                           style={{ width: 
                             order.status === 'Delivered' ? '100%' : 
                             order.status === 'Out for Delivery' ? '75%' : 
                             order.status === 'Shipped' ? '50%' : '25%' 
                           }}></div>

                      {/* Status Nodes */}
                      {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => {
                        const statusSteps = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
                        const currentIdx = statusSteps.indexOf(order.status || 'Confirmed');
                        const isActive = index <= currentIdx;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full border-4 transition-colors duration-500 ${
                              isActive ? 'bg-blue-600 border-blue-100' : 'bg-white border-gray-200'
                            }`}></div>
                            <p className={`text-[9px] font-black uppercase mt-3 tracking-tighter ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                              {step}
                            </p>
                          </div>
                        )
                      })}
                   </div>
                </div>

                {/* ITEM LIST */}
                <div className="p-6 divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.productId?._id || item._id} className="flex items-center gap-6 py-4 first:pt-0 last:pb-0">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 border border-gray-100">
                        <img src={item.productId?.image || item.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-800 uppercase italic tracking-tighter leading-none">
                          {item.productId?.name || item.name}
                        </h4>
                        <p className="text-[9px] text-gray-400 font-black uppercase mt-1 tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-xs font-black text-gray-900 mt-1 italic">₹{item.price}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/product/${item.productId?._id || item._id}`)}
                        className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;