import React from 'react';
import { Star, Loader2, Eye, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ReviewsTable = ({ reviews, loading, onRowClick, onRefresh }) => {
  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (reviews.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 py-12">
      No reviews match your filters.
    </div>
  );

  const toggleStatus = async (e, r) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/reviews/${r.medicineId}/reviews/${r._id}/status`, {
        isApproved: !r.isApproved
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(r.isApproved ? 'Review hidden' : 'Review published');
      onRefresh();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-4">Product</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Rating</th>
            <th className="p-4">Review</th>
            <th className="p-4">Status</th>
            <th className="p-4">Admin Reply</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reviews.map(r => (
            <tr 
              key={r._id} 
              onClick={() => onRowClick(r)}
              className="hover:bg-slate-50 transition-colors bg-white cursor-pointer"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={r.productImage} alt="" className="w-8 h-8 rounded border object-cover shrink-0" />
                  <p className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{r.productName}</p>
                </div>
              </td>
              <td className="p-4 text-sm font-bold text-slate-700">{r.customerName}</td>
              <td className="p-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
              </td>
              <td className="p-4">
                <p className="text-xs text-slate-600 truncate max-w-[200px]">{r.comment}</p>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
                  r.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {r.isApproved ? 'Published' : 'Hidden'}
                </span>
              </td>
              <td className="p-4">
                {r.adminResponse ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                    <CheckCircle className="w-3 h-3" /> Yes
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">-</span>
                )}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-1">
                  <button 
                    onClick={(e) => toggleStatus(e, r)}
                    title={r.isApproved ? 'Hide Review' : 'Publish Review'}
                    className={`p-2 rounded-lg transition-colors ${r.isApproved ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                  >
                    {r.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onRowClick(r)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
