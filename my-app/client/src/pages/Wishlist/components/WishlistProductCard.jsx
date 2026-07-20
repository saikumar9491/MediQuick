import React, { useState } from 'react';
import { Heart, ShoppingCart, Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { subscribeToRestock } from '../../../api/wishlist';
import { addItem } from '../../../api/cart';

const WishlistProductCard = ({ item, token, onRemove, onUndo }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const currentPrice = item.discountPrice && item.discountPrice < item.price 
    ? item.discountPrice 
    : item.price;
  const hasDiscount = currentPrice < item.price;
  const oos = item.countInStock === 0;
  const lowStock = item.countInStock > 0 && item.countInStock <= 5;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (oos) return;
    setAddingToCart(true);
    try {
      await addItem(token, item._id, 1);
      toast.success(`${item.name} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.stopPropagation();
    setSubscribing(true);
    try {
      await subscribeToRestock(token, item._id);
      setIsSubscribed(true);
      toast.success(`You will be notified when ${item.name} is restocked!`);
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(item._id);

    // Provide Undo Toast
    toast((t) => (
      <span className="flex items-center gap-2 text-xs">
        Removed from wishlist
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onUndo(item);
          }}
          className="text-blue-600 font-bold hover:underline"
        >
          Undo
        </button>
      </span>
    ), { duration: 5000 });
  };

  return (
    <div
      onClick={() => navigate(`/medicines/${item._id}`)}
      className={`relative rounded-2xl border p-4 bg-white hover:shadow-sm hover:border-slate-350 transition-all cursor-pointer flex flex-col justify-between ${
        oos ? 'opacity-85 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      {/* Heart Remove Toggle */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-50 hover:bg-red-50 text-red-500 transition-all z-10"
        title="Remove from wishlist"
      >
        <Heart size={14} className="fill-red-500 stroke-red-500" />
      </button>

      {/* Price Dropped Badge */}
      {item.priceDropped && (
        <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full z-10 border border-emerald-250">
          Price dropped! (Was ₹{item.priceAtAdd})
        </span>
      )}

      <div className="space-y-3">
        {/* Product Image */}
        <div className="h-28 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
          {item.image ? (
            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain p-2" />
          ) : (
            <div className="w-10 h-10 bg-slate-200 rounded-lg" />
          )}
        </div>

        {/* Product Details */}
        <div>
          {item.category && (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{item.category}</span>
          )}
          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mt-0.5">{item.name}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{item.brand}</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {/* Prices & Stock Details */}
        <div className="flex items-end justify-between gap-1.5 flex-wrap">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">₹{currentPrice}</span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-400 line-through">₹{item.price}</span>
              )}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Added on {new Date(item.addedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Stock Badges */}
          {oos ? (
            <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          ) : lowStock ? (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              Only {item.countInStock} left
            </span>
          ) : (
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>

        {/* Action Button */}
        {oos ? (
          <button
            onClick={handleSubscribe}
            disabled={subscribing || isSubscribed}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isSubscribed
                ? 'bg-slate-100 text-slate-500 border border-slate-200'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {subscribing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isSubscribed ? (
              <CheckCircle2 size={13} className="text-emerald-600" />
            ) : (
              <Bell size={13} />
            )}
            <span>{isSubscribed ? 'You\'ll be notified' : 'Notify Me When Available'}</span>
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98]"
          >
            {addingToCart ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ShoppingCart size={13} />
            )}
            <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WishlistProductCard;
