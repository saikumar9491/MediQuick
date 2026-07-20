import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchReviews } from '../../../api/profile';

const ReviewsTab = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchReviews(token);
      setReviews(data);
    } catch (_) {
      toast.error('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <MessageSquare size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">My Reviews</h2>
          <p className="text-xs text-slate-400">View the reviews you've written for medicines and products.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto text-slate-300 mb-3" size={36} strokeWidth={1.5} />
          <p className="text-sm text-slate-500 font-medium">You haven't written any reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold text-slate-800 hover:text-blue-650 cursor-pointer">
                    {review.medicineId?.name || 'Unknown Product'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{review.medicineId?.brand}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-100">
                  <Star size={11} className="fill-amber-600 stroke-amber-600" />
                  <span>{review.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">"{review.comment}"</p>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                <Calendar size={11} />
                <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
