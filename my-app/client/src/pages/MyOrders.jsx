import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user orders from your Hub Backend
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${user?._id}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Order sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchOrders();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-20">
      <div className="animate-bounce text-4xl">📦</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-20 pt-10">
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
          <div className="bg-white p-20 text-center border-2 border-dashed border-gray-200">
            <span className="text-5xl grayscale mb-4 block">💊</span>
            <p className="font-black text-gray-400 uppercase italic tracking-widest">No prescription history found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm hover:shadow-md transition-shadow">
                
                {/* ORDER INFO BAR */}
                <div className="bg-gray-50 p-4 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Order Ref</p>
                      <p className="text-xs font-black text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Placed On</p>
                      <p className="text-xs font-black text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Total Bill</p>
                      <p className="text-xs font-black text-blue-600">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-100 uppercase italic">
                    Hub Dispatched ✔
                  </span>
                </div>

                {/* TRACKING PROGRESS TRACKER */}
                <div className="p-8 border-b">
                   <div className="relative flex justify-between">
                      {/* Tracking Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2"></div>
                      <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-1000`} 
                           style={{ width: order.status === 'Delivered' ? '100%' : '50%' }}></div>

                      {/* Status Nodes */}
                      {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-4 ${index <= 1 ? 'bg-blue-600 border-blue-100' : 'bg-white border-gray-100'}`}></div>
                          <p className={`text-[9px] font-black uppercase mt-2 tracking-tighter ${index <= 1 ? 'text-gray-900' : 'text-gray-300'}`}>
                            {step}
                          </p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* ITEM LIST */}
                <div className="p-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-6">
                      <img src={item.image} className="w-16 h-16 object-contain border p-1 rounded-sm" alt="" />
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-800 uppercase italic tracking-tighter leading-none">{item.name}</h4>
                        <p className="text-[9px] text-gray-400 font-black uppercase mt-1">Qty: {item.quantity}</p>
                        <p className="text-xs font-black text-gray-900 mt-1 italic">₹{item.price}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/product/${item._id}`)}
                        className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 hover:text-blue-800"
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