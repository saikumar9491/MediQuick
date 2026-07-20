import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Trash2, Loader2 } from 'lucide-react';
import { uploadProductImage } from '../api/products';
import { submitReview, editReview } from '../api/reviews';
import toast from 'react-hot-toast';

export const ReviewForm = ({ isOpen, onClose, productId, review, token, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating || 5);
      setTitle(review.title || '');
      setComment(review.comment || '');
      setImages(review.images || []);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setImages([]);
    }
  }, [review, isOpen]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      toast.error('You can upload up to 3 photos only');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return uploadProductImage(formData);
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.imageUrl || res.url);
      setImages(prev => [...prev, ...newUrls].slice(0, 3));
      toast.success('Photos uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 10) {
      toast.error('Review text must be at least 10 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId,
        rating,
        comment,
        title,
        images
      };

      if (review) {
        // Edit Review
        await editReview(review._id, payload, token);
        toast.success('Review updated and is pending moderation');
      } else {
        // Submit New Review
        await submitReview(payload, token);
        toast.success('Review submitted and is pending moderation');
      }
      onSubmit();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[150] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
            {review ? 'Edit Your Review' : 'Write a Product Review'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-2 bg-slate-50 rounded-2xl border border-slate-150">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tap stars to rate</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-amber-400 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Review Title (Optional)</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              placeholder="Summarize your experience (e.g. Highly effective, fast relief)"
            />
          </div>

          {/* Review comment */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Detailed Review *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold resize-y"
              placeholder="What did you like or dislike? How was the dosage? (min. 10 characters)"
              required
            />
          </div>

          {/* Photo uploads */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Attach Photos (Optional, Max 3)</label>
            <div className="flex gap-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-1 bg-white">
                  <img src={img} className="max-h-full max-w-full object-contain" alt="" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 3 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/20 text-slate-450 hover:text-blue-600">
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Add Photo</span>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            {uploading && (
              <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1.5 mt-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading photos...
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all min-w-[120px] disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
