import React, { useState } from 'react';
import { X, Star, ShieldCheck, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const ReviewDetailModal = ({ review, onClose, onRefresh }) => {
  const [response, setResponse] = useState(review.adminResponse || '');
  const [loading, setLoading] = useState(false);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_BASE}/api/reviews/${review.medicineId}/reviews/${review._id}/respond`, {
        responseText: response
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Response posted publicly');
      onRefresh();
      onClose();
    } catch (err) {
      toast.error('Failed to post response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-lg font-black text-slate-800">Review Details</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="flex items-start gap-4">
            <img src={review.productImage} alt="" className="w-16 h-16 rounded-xl border border-slate-200 object-cover" />
            <div>
              <h3 className="font-bold text-slate-800">{review.productName}</h3>
              <p className="text-xs text-slate-500">{review.productBrand}</p>
              <div className="mt-2 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                {review.customerName}
                {review.orderId && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">
                    <ShieldCheck className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${review.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {review.isApproved ? 'Published' : 'Hidden'}
              </span>
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "{review.comment}"
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Admin Response (Public)</h4>
            <form onSubmit={handleSubmitResponse}>
              <textarea 
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write a public response to this customer..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !response.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {review.adminResponse ? 'Update Response' : 'Post Response'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
