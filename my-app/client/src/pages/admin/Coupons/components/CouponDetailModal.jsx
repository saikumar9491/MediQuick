import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CouponDetailModal = ({ couponId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/coupons/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load coupon details");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [couponId, onClose]);

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
    </div>
  );

  if (!data) return null;

  const { coupon, history } = data;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800 text-white rounded font-mono text-sm">{coupon.code}</span>
              Details & History
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Discount</p>
              <p className="text-sm font-bold text-slate-800">
                {coupon.discountType === 'Percentage' ? `${coupon.discountValue}% (Max ₹${coupon.maxDiscountCap || '∞'})` : `₹${coupon.discountValue} Flat`}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Min Order</p>
              <p className="text-sm font-bold text-slate-800">₹{coupon.minOrderValue}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Usage Limit</p>
              <p className="text-sm font-bold text-slate-800">{coupon.usedCount} / {coupon.usageLimit || 'Unlimited'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Per User Limit</p>
              <p className="text-sm font-bold text-slate-800">{coupon.perCustomerLimit}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Valid From</p>
              <p className="text-sm font-medium text-slate-700">{new Date(coupon.validFrom).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Valid To</p>
              <p className="text-sm font-medium text-slate-700">{new Date(coupon.validTo).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Applicable To</p>
              <p className="text-sm font-bold text-slate-800">
                {coupon.applicableTo === 'All' ? 'All Products' : `${coupon.applicableCategoryIds?.length || 0} Categories`}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${coupon.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Redemption History (Recent 50)</h3>
            </div>
            
            <div className="overflow-x-auto">
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No orders have used this coupon yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Order Total</th>
                      <th className="p-3 text-right">Discount Applied</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map(order => (
                      <tr key={order._id} className="hover:bg-slate-50 text-sm">
                        <td className="p-3 font-mono text-xs font-medium text-slate-600">
                          {order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{order.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{order.userId?.email || 'N/A'}</p>
                        </td>
                        <td className="p-3 text-xs text-slate-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-800">
                          ₹{order.totalAmount}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          -₹{order.discountApplied || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
