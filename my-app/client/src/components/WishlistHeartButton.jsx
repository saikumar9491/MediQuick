import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../api/wishlist';

const WishlistHeartButton = ({ productId, className = '', size = 16 }) => {
  const { token } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the current wishlist state for this product on mount/token change
  useEffect(() => {
    if (!token) {
      setIsWishlisted(false);
      return;
    }

    const checkWishlist = async () => {
      try {
        const list = await fetchWishlist(token);
        const exists = list.some(item => (item.productId?._id || item._id) === productId);
        setIsWishlisted(exists);
      } catch (_) {
        // Silent catch to prevent console noise
      }
    };
    checkWishlist();
  }, [token, productId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      return toast.error('Please login to save items to your wishlist.');
    }

    setLoading(true);
    // Optimistic UI toggle
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    try {
      if (previousState) {
        await removeFromWishlist(token, productId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(token, productId);
        toast.success('Added to wishlist');
      }
    } catch (_) {
      // Revert on failure
      setIsWishlisted(previousState);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full bg-white hover:bg-slate-50 border border-slate-150 shadow-sm transition-all duration-200 active:scale-90 flex items-center justify-center ${className}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          isWishlisted
            ? 'fill-red-500 stroke-red-500 scale-105'
            : 'text-slate-400 stroke-[2] hover:text-slate-600'
        }`}
      />
    </button>
  );
};

export default WishlistHeartButton;
