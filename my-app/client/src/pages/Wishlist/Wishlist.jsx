import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Loader2, ArrowUpDown, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlist';
import { addItem } from '../../api/cart';

import WishlistGrid from './components/WishlistGrid';
import EmptyWishlistState from './components/EmptyWishlistState';

const Wishlist = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price-low', 'price-high'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWishlist(token);
      setItems(data);
    } catch (_) {
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
    loadWishlist();
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(token, productId);
      setItems(prev => prev.filter(i => i._id !== productId));
    } catch (_) {
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleUndo = async (item) => {
    try {
      await addToWishlist(token, item._id);
      setItems(prev => [item, ...prev]);
      toast.success(`${item.name} added back to wishlist`);
    } catch (_) {
      toast.error('Could not undo removal');
    }
  };

  const handleAddAllToCart = async () => {
    const inStockItems = items.filter(i => i.countInStock > 0);
    if (inStockItems.length === 0) {
      return toast.error('No in-stock items to add to cart.');
    }

    setAddingAll(true);
    let successCount = 0;
    try {
      for (const item of inStockItems) {
        await addItem(token, item._id, 1);
        successCount++;
      }
      toast.success(`Successfully added ${successCount} items to your cart!`);
    } catch (err) {
      toast.error(err.message || 'Failed to add all items to cart');
    } finally {
      setAddingAll(false);
    }
  };

  // Get categories for filter dropdown
  const categories = ['all', ...new Set(items.map(i => i.category).filter(Boolean))];

  // Apply filter & sorting
  const processedItems = items
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => {
      const aPrice = a.discountPrice || a.price;
      const bPrice = b.discountPrice || b.price;

      if (sortBy === 'price-low') {
        return aPrice - bPrice;
      }
      if (sortBy === 'price-high') {
        return bPrice - aPrice;
      }
      // Default: recent (by addedAt or id if not populated)
      return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Heart size={20} className="fill-blue-100" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">My Wishlist</h1>
                <p className="text-xs text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
              </div>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                disabled={addingAll}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-all shadow-sm"
              >
                {addingAll ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                <span>Add All to Cart</span>
              </button>
            )}
          </div>

          {/* Filter/Sort bar */}
          {items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 p-3 rounded-2xl">
              {/* Category Filter */}
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl">
                <Tag size={13} className="text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer w-full capitalize"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl">
                <ArrowUpDown size={13} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Grid display */}
          {processedItems.length === 0 ? (
            <EmptyWishlistState />
          ) : (
            <WishlistGrid
              items={processedItems}
              token={token}
              onRemove={handleRemove}
              onUndo={handleUndo}
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default Wishlist;
