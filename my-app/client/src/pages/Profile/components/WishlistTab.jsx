import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWishlist } from '../../../api/profile';
import { addItem } from '../../../api/cart';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { API_BASE } from '../../../utils/apiConfig';

const WishlistTab = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWishlist(token);
      setItems(data);
    } catch (_) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [token]);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    try {
      await addItem(token, product._id, 1);
      toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Could not add item to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/wishlist/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        toast.success('Removed from wishlist');
        setItems(prev => prev.filter(i => i._id !== productId));
      } else {
        throw new Error('Remove failed');
      }
    } catch (_) {
      toast.error('Could not remove from wishlist');
    }
  };

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
          <Heart size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">My Wishlist</h2>
          <p className="text-xs text-slate-400">View and manage the products you've saved for later.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-slate-300 mb-3 animate-pulse" size={36} strokeWidth={1.5} />
          <p className="text-sm text-slate-500 font-medium">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((prod) => {
            const salePrice = prod.discountPrice && prod.discountPrice < prod.price
              ? prod.discountPrice : prod.price;
            const hasDiscount = salePrice < prod.price;
            const oos = prod.countInStock === 0;

            return (
              <div key={prod._id} className="rounded-2xl border border-slate-200 p-4 bg-white flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all relative group">
                <button
                  onClick={() => handleRemove(prod._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all z-10"
                  title="Remove from wishlist"
                >
                  <HeartOff size={14} />
                </button>

                <div className="space-y-3">
                  {/* Image */}
                  <div className="h-28 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain p-2" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{prod.brand}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {/* Price */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">₹{salePrice}</span>
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.price}</span>
                    )}
                    {oos && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded ml-auto">
                        OOS
                      </span>
                    )}
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={() => handleAddToCart(prod)}
                    disabled={oos || addingId === prod._id}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold text-blue-600 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {addingId === prod._id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={13} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
