import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id || !token) {
        setLoading(false);
        return;
      }

      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const res = await fetch(`${API_BASE}/api/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Order sync failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  if (loading)
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <div className="text-4xl animate-bounce">📦</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f1f3f6] pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
              Track Your <span className="text-blue-600">Health Shipments</span>
            </h1>
            <p className="mt-2 text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[2px] sm:tracking-[3px]">
              Verified Hub Deliveries • {orders.length} Active Shipments
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-white border-2 border-gray-900 px-5 sm:px-6 py-2.5 text-[9px] sm:text-[10px] font-black uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-900 hover:text-white active:translate-y-1 active:shadow-none"
          >
            Order New Medicines
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-14 sm:p-16 md:p-20 text-center">
            <span className="mb-4 block text-4xl sm:text-5xl grayscale">💊</span>
            <p className="font-black text-gray-400 uppercase italic tracking-[0.15em] sm:tracking-widest text-xs sm:text-sm">
              No prescription history found.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 text-blue-600 font-black uppercase text-[10px] sm:text-xs hover:underline"
            >
              Check Available Medicines →
            </button>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {orders.map((order) => {
              const statusSteps = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
              const currentStatus = order.status || 'Confirmed';
              const currentIdx = statusSteps.indexOf(currentStatus);

              const progressWidth =
                currentStatus === 'Delivered'
                  ? '100%'
                  : currentStatus === 'Out for Delivery'
                  ? '75%'
                  : currentStatus === 'Shipped'
                  ? '50%'
                  : '25%';

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* ORDER INFO BAR */}
                  <div className="flex flex-col gap-4 border-b bg-gray-50 p-4 sm:p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Order Ref
                        </p>
                        <p className="text-[11px] sm:text-xs font-black text-gray-800 break-all">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Placed On
                        </p>
                        <p className="text-[11px] sm:text-xs font-black text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Total Bill
                        </p>
                        <p className="text-[11px] sm:text-xs font-black text-blue-600">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`self-start lg:self-auto text-[9px] sm:text-[10px] font-black px-3 sm:px-4 py-1.5 rounded-full border uppercase italic ${
                        order.status === 'Delivered'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}
                    >
                      {order.status || 'Hub Dispatched'} ✔
                    </span>
                  </div>

                  {/* TRACKING */}
                  <div className="border-b px-3 py-6 sm:px-6 sm:py-8 md:p-10 overflow-x-auto">
                    <div className="relative mx-auto flex min-w-[520px] justify-between max-w-3xl">
                      <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-gray-100"></div>

                      <div
                        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-blue-600 transition-all duration-1000"
                        style={{ width: progressWidth }}
                      ></div>

                      {statusSteps.map((step, index) => {
                        const isActive = index <= currentIdx;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border-4 transition-colors duration-500 ${
                                isActive
                                  ? 'bg-blue-600 border-blue-100'
                                  : 'bg-white border-gray-200'
                              }`}
                            ></div>
                            <p
                              className={`mt-2 sm:mt-3 text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-center ${
                                isActive ? 'text-gray-900' : 'text-gray-300'
                              }`}
                            >
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="divide-y divide-gray-50 p-4 sm:p-5 md:p-6">
                    {order.items.map((item) => (
                      <div
                        key={item.productId?._id || item._id}
                        className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-5 md:gap-6"
                      >
                        <div className="h-20 w-20 shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-2">
                          <img
                            src={item.productId?.image || item.image}
                            className="h-full w-full object-contain"
                            alt=""
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-gray-800 uppercase italic tracking-tighter leading-tight break-words">
                            {item.productId?.name || item.name}
                          </h4>
                          <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="mt-1 text-xs font-black italic text-gray-900">
                            ₹{item.price}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/product/${item.productId?._id || item._id}`)}
                          className="self-start sm:self-center text-[9px] sm:text-[10px] font-black uppercase text-blue-600 border-b-2 border-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Buy Again
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;