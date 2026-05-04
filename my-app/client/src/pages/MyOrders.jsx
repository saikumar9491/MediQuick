import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Box, 
  Calendar, 
  CreditCard,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { API_BASE } from '../utils/apiConfig';

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
        const res = await fetch(`${API_BASE}/api/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        // Sort orders by most recent
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : [];
        setOrders(sortedData);
      } catch (err) {
        console.error('Order sync failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id, token]);

  const statusSteps = [
    { id: 'Confirmed', icon: Package, label: 'Confirmed' },
    { id: 'Shipped', icon: Truck, label: 'In Transit' },
    { id: 'Out for Delivery', icon: MapPin, label: 'Out for Delivery' },
    { id: 'Delivered', icon: CheckCircle2, label: 'Delivered' }
  ];

  const getStatusIndex = (status) => {
    const index = statusSteps.findIndex(s => s.id === status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 flex flex-col items-center justify-center px-4">
        <div className="relative">
          <Loader2 size={48} className="text-[#00a2a4] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-[#00a2a4] rounded-full" />
          </div>
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Retrieving Health Shipments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 bg-[#00a2a4]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00a2a4]">Patient Portal</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
              My <span className="text-[#00a2a4]">Shipments</span>
            </h1>
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {orders.length} Verified Hub Records Found
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-[#00a2a4]"
          >
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            New Order
          </motion.button>
        </header>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white p-12 sm:p-20 text-center shadow-xl shadow-slate-100"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <Box size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Active Shipments</h2>
            <p className="mt-4 max-w-xs text-[11px] font-bold leading-relaxed text-slate-400 uppercase tracking-widest">
              Your prescription history is empty. Start your health journey with our clinical-grade supplies.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-10 flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#00a2a4]"
            >
              Shop Medicines <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const currentIdx = getStatusIndex(order.status || 'Confirmed');
                
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-white shadow-2xl shadow-slate-200/60"
                  >
                    {/* Top Decorative Strip */}
                    <div className={`absolute top-0 left-0 h-1 w-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-[#00a2a4]'}`} />
                    
                    {/* ORDER HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 sm:p-10 border-b border-slate-50">
                      <div className="flex flex-wrap gap-10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Box size={12} className="text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
                          </div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized On</p>
                          </div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CreditCard size={12} className="text-slate-400" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bill</p>
                          </div>
                          <p className="text-sm font-black text-[#00a2a4] tracking-tighter">₹{order.totalAmount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          order.status === 'Delivered' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-teal-50 text-[#00a2a4] border-teal-100'
                        }`}>
                          {order.status || 'Confirmed'}
                        </span>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC TRACKING TIMELINE */}
                    <div className="px-8 py-12 sm:px-12 sm:py-16 bg-slate-50/50">
                      <div className="relative mx-auto max-w-4xl">
                        {/* Progress Line */}
                        <div className="absolute top-[22px] left-0 h-[2px] w-full bg-slate-100" />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`absolute top-[22px] left-0 h-[2px] transition-colors duration-500 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-[#00a2a4]'}`} 
                        />

                        <div className="relative flex justify-between">
                          {statusSteps.map((step, index) => {
                            const isPast = index < currentIdx;
                            const isCurrent = index === currentIdx;
                            const StepIcon = step.icon;

                            return (
                              <div key={step.id} className="flex flex-col items-center">
                                <motion.div 
                                  initial={false}
                                  animate={{
                                    backgroundColor: isPast || isCurrent ? (order.status === 'Delivered' ? '#22c55e' : '#00a2a4') : '#ffffff',
                                    borderColor: isPast || isCurrent ? (order.status === 'Delivered' ? '#22c55e' : '#00a2a4') : '#e2e8f0',
                                    color: isPast || isCurrent ? '#ffffff' : '#94a3b8'
                                  }}
                                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 ${isCurrent ? 'shadow-lg shadow-teal-100 ring-4 ring-white' : ''}`}
                                >
                                  {isPast ? <CheckCircle2 size={18} strokeWidth={3} /> : <StepIcon size={18} strokeWidth={2.5} />}
                                </motion.div>
                                <div className="mt-4 flex flex-col items-center gap-1">
                                  <span className={`text-[10px] font-black uppercase tracking-tight ${isCurrent ? 'text-slate-900' : isPast ? 'text-slate-600' : 'text-slate-300'}`}>
                                    {step.label}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[8px] font-bold text-[#00a2a4] uppercase tracking-widest animate-pulse">Current Phase</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ITEMS LIST */}
                    <div className="p-8 sm:p-10 space-y-8">
                      <div className="flex items-center gap-2 mb-2">
                        <Box size={14} className="text-[#00a2a4]" />
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Inventory Manifest</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {order.items.map((item) => (
                          <div 
                            key={item.productId?._id || item._id}
                            className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00a2a4] transition-colors"
                          >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-2 border border-slate-200 shadow-sm">
                              <img
                                src={item.productId?.image || item.image}
                                className="h-full w-full object-contain"
                                alt=""
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="truncate text-xs font-black text-slate-900 uppercase tracking-tight">
                                {item.productId?.name || item.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-4">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-black text-[#00a2a4]">₹{item.price}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/product/${item.productId?._id || item._id}`)}
                              className="h-10 w-10 flex items-center justify-center rounded-full text-slate-400 hover:text-[#00a2a4] hover:bg-white transition-all shadow-sm"
                            >
                              <RefreshCcw size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="px-8 py-6 sm:px-10 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-teal-400" />
                        <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Certified Amritsar Hub Delivery • AES-256 Encrypted</p>
                      </div>
                      <button className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] hover:text-white transition-colors">
                        Download Invoice
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;