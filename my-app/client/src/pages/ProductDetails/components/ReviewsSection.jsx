import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Loader2, MessageSquare, Edit3, Trash2, X } from 'lucide-react';
import { checkCanReview, deleteReview } from '../../../api/reviews';
import { ReviewForm } from '../../../components/ReviewForm';
import toast from 'react-hot-toast';

export const ReviewsSection = ({ medicine, user, token, refreshProduct }) => {
  const [canSubmitReview, setCanSubmitReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  const approvedReviews = medicine.reviews ? medicine.reviews.filter(r => r.isApproved !== false) : [];

  const runEligibilityCheck = async () => {
    if (user && token && medicine) {
      setLoadingCheck(true);
      try {
        const status = await checkCanReview(medicine._id, token);
        setCanSubmitReview(status.canReview);
        setAlreadyReviewed(status.alreadyReviewed);
        setExistingReview(status.review);
      } catch (err) {
        console.error('Error checking review capability:', err);
      } finally {
        setLoadingCheck(false);
      }
    }
  };

  useEffect(() => {
    runEligibilityCheck();
  }, [user, token, medicine]);

  const totalReviewsCount = approvedReviews.length;
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approvedReviews.forEach(r => {
    const roundedRating = Math.round(r.rating);
    if (starCounts[roundedRating] !== undefined) {
      starCounts[roundedRating]++;
    }
  });

  const handleDelete = async () => {
    if (!existingReview) return;
    if (!window.confirm('Are you sure you want to delete your review? This will also remove your rating from the product average.')) return;

    try {
      await deleteReview(existingReview._id, token);
      toast.success('Review deleted successfully');
      refreshProduct();
      runEligibilityCheck();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-50 pb-4">
        <h2 className="text-sm font-medium text-slate-800 uppercase tracking-widest">Customer Reviews</h2>
        
        <div>
          {loadingCheck ? (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Verifying history...</span>
            </div>
          ) : user ? (
            <div className="flex gap-2">
              {canSubmitReview ? (
                alreadyReviewed ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-xs border border-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Review</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-medium text-xs border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs uppercase tracking-wider transition-colors"
                  >
                    Write a Review
                  </button>
                )
              ) : (
                <button
                  disabled
                  title="Purchase this product to leave a review"
                  className="px-4 py-2 bg-slate-50 text-slate-400 border border-slate-150 rounded-lg font-medium text-xs uppercase tracking-wider cursor-not-allowed"
                >
                  Write a Review
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Please{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                login
              </a>{' '}
              to leave a review.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-55/60 pb-8">
        {/* Rating score card */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50/40 rounded-2xl text-center border border-slate-100">
          <p className="text-4xl font-medium text-slate-900 leading-none">{medicine.rating?.toFixed(1) || '0.0'}</p>
          <div className="flex text-amber-400 gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= Math.round(medicine.rating || 0) ? 'fill-current' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-1.5">Based on {totalReviewsCount} ratings</p>
        </div>

        {/* Rating bars */}
        <div className="md:col-span-2 space-y-1.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = starCounts[stars];
            const pct = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-normal text-slate-500">
                <span className="w-8">{stars} ★</span>
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list (testimonial style) */}
      <div className="space-y-8 divide-y divide-slate-100">
        {approvedReviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-200" />
            <p className="text-[10px] font-medium uppercase tracking-widest">No reviews yet for this product</p>
          </div>
        ) : (
          approvedReviews.map((rev, idx) => (
            <div key={rev._id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
              <div className="flex gap-3.5 items-start">
                {/* Soft Tinted Circle Initials */}
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-550 shrink-0">
                  {getInitials(rev.name)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-800">{rev.name}</span>
                      {rev.orderId && (
                        <span className="inline-flex items-center gap-1 text-[8px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-450 font-normal">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex text-amber-400 gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= rev.rating ? 'fill-current' : 'text-slate-100'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Title and Comment */}
              <div className="pl-11 space-y-1">
                {rev.title && (
                  <h4 className="text-xs font-medium text-slate-800">"{rev.title}"</h4>
                )}
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{rev.comment}</p>

                {/* Uploaded Images strip */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {rev.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedReviewImage(img)}
                        className="w-10 h-10 rounded-lg border border-slate-150 overflow-hidden bg-slate-50 flex items-center justify-center p-0.5 hover:border-slate-400 transition-colors"
                      >
                        <img src={img} className="max-h-full max-w-full object-contain" alt="" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Admin Response */}
                {rev.adminResponse && (
                  <div className="mt-3 p-3 bg-slate-50 border-l border-slate-300 rounded-r-lg">
                    <p className="text-[9px] font-medium uppercase text-slate-500 tracking-wider">Response from Pharmacist</p>
                    <p className="text-xs text-slate-550 mt-1">{rev.adminResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <ReviewForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productId={medicine._id}
        review={existingReview}
        token={token}
        onSubmit={() => {
          refreshProduct();
          runEligibilityCheck();
        }}
      />

      {/* Image Preview Lightbox */}
      {selectedReviewImage && (
        <div className="fixed inset-0 bg-slate-900/80 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedReviewImage(null)}>
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 animate-in zoom-in-95 duration-200">
            <img src={selectedReviewImage} className="max-w-full max-h-[80vh] object-contain rounded-xl" alt="" />
            <button className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900/85 text-white rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
