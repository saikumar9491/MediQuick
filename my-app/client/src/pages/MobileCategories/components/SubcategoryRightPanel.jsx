import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Bell, 
  Loader2, 
  Package, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';

const SubcategoryRightPanel = ({
  activeCategory,
  scrollRef,
  onScroll
}) => {
  const { addToCart } = useCart();

  const [activeSubChip, setActiveSubChip] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [addingId, setAddingId] = useState(null);
  const [notifyingId, setNotifyingId] = useState(null);

  const categoryName = activeCategory?.name || '';
  const subOptions = activeCategory?.subOptions || [];

  // Reset active chip and fetch products whenever active category changes
  useEffect(() => {
    setActiveSubChip('All');
  }, [categoryName]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryName) return;
      setLoading(true);
      try {
        const isFlashCategory = activeCategory?._id === 'flash-deals-special' || categoryName === 'Flash Deals';

        if (isFlashCategory) {
          const res = await fetch(`${API_BASE}/api/medicines?limit=50`);
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.medicines || []);
          const flashItems = list.filter(m => m.isFlashDeal && m.isActive !== false);
          setProducts(flashItems);
        } else {
          let url = `${API_BASE}/api/medicines?limit=50&category=${encodeURIComponent(categoryName)}`;
          if (activeSubChip && activeSubChip !== 'All') {
            url += `&subCategory=${encodeURIComponent(activeSubChip)}`;
          }

          const res = await fetch(url);
          const data = await res.json();
          let items = data.medicines || data || [];

          // Fallback: If subcategory query yields 0 items, fetch all products for parent category
          if (items.length === 0 && activeSubChip !== 'All') {
            const fallbackUrl = `${API_BASE}/api/medicines?limit=50&category=${encodeURIComponent(categoryName)}`;
            const fallbackRes = await fetch(fallbackUrl);
            const fallbackData = await fallbackRes.json();
            items = fallbackData.medicines || fallbackData || [];
          }

          setProducts(items);
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName, activeSubChip]);

  if (!activeCategory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-white">
        <Package className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
        <span className="text-xs font-semibold">Select a category to view items</span>
      </div>
    );
  }

  const toggleWishlist = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    toast.success(favorites.has(id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    try {
      await addToCart({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.discountPrice || product.price,
        image: product.image,
        countInStock: product.countInStock
      });
      toast.success(`${product.name.split(' ').slice(0, 2).join(' ')} added to cart`);
    } catch (e) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleNotifyMe = (id, name) => {
    setNotifyingId(id);
    setTimeout(() => {
      setNotifyingId(null);
      toast.success(`You will be notified when ${name.split(' ').slice(0, 2).join(' ')} is back in stock!`);
    }, 600);
  };

  // Derive subcategory chip list
  const subCategoryChips = ['All', ...subOptions.map(s => typeof s === 'object' ? s.name : s)];

  return (
    <div 
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 bg-white overflow-y-auto p-3 flex flex-col h-full no-scrollbar select-none"
    >
      {/* 1. Header Row (Category Name + Total Product Count Badge) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-sm font-black text-[#0057FF] tracking-tight truncate">
          {categoryName}
        </h2>
        <span className="text-[9.5px] font-extrabold text-[#FF6B00] bg-orange-50 border border-orange-100/80 px-2 py-0.5 rounded-full flex-shrink-0 font-[IBM_Plex_Mono]">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* 2. Top Sub-Category Filter Chips (Horizontal Scrollable Bar) */}
      {subCategoryChips.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 flex-shrink-0">
          {subCategoryChips.map((chip, idx) => {
            const isActive = activeSubChip === chip;
            return (
              <button
                key={idx}
                onClick={() => setActiveSubChip(chip)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-extrabold transition-all active:scale-95 border ${
                  isActive
                    ? 'bg-[#0057FF] text-white border-[#0057FF] shadow-2xs'
                    : 'bg-[#F5F7FF] text-slate-600 border-blue-100/70 hover:bg-blue-50'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Direct Products Grid (2 Columns) */}
      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-2.5 border border-slate-100 animate-pulse space-y-2">
                <div className="h-24 bg-slate-100 rounded-xl" />
                <div className="h-3 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                <div className="h-7 w-full bg-slate-100 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 rounded-xl my-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-xs font-bold text-slate-700">No products found</h3>
            <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
              No products matching "{activeSubChip}" in {categoryName}.
            </p>
            {activeSubChip !== 'All' && (
              <button
                onClick={() => setActiveSubChip('All')}
                className="text-[10px] font-bold text-[#0057FF] underline mt-1"
              >
                View all {categoryName} products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 pb-6">
            {products.map(product => {
              const isFav = favorites.has(product._id);
              const isOos = product.countInStock === 0;
              const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
              const price = hasDiscount ? product.discountPrice : product.price;
              const mrp = product.price;
              const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
              const isBestseller = product.isBestseller === true || product.rating >= 4.7;

              return (
                <div
                  key={product._id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-2 flex flex-col justify-between relative shadow-2xs hover:shadow-sm transition-shadow group"
                >
                  {/* Bestseller Badge (Top-Left) */}
                  {isBestseller && (
                    <span className="absolute top-1.5 left-1.5 z-10 bg-[#FF6B00] text-white font-extrabold text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                      Bestseller
                    </span>
                  )}

                  {/* Wishlist Heart Icon (Top-Right) */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/90 shadow-2xs border flex items-center justify-center transition-transform active:scale-90 ${
                      isFav ? 'border-rose-200 text-[#EF4444]' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isFav ? 'fill-[#EF4444]' : ''}`} />
                  </button>

                  {/* Product Image */}
                  <div className="h-24 w-full bg-slate-50/60 rounded-xl p-1.5 mb-1.5 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.image || 'https://placehold.co/300x300?text=Medicine'}
                      alt={product.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Out of Stock Label overlay on image */}
                    {isOos && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center p-1">
                        <span className="bg-[#EF4444] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Title */}
                  <div className="space-y-0.5 mb-1.5">
                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-400 block font-[IBM_Plex_Mono]">
                      {product.brand || 'Generic'}
                    </span>
                    <h3 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2 min-h-[26px]">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs font-black text-slate-900 font-[IBM_Plex_Mono]">
                      ₹{price}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-[8.5px] text-slate-400 line-through font-[IBM_Plex_Mono]">
                          ₹{mrp}
                        </span>
                        <span className="text-[8.5px] font-extrabold text-[#16A34A] font-[IBM_Plex_Mono] ml-auto">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  {isOos ? (
                    <button
                      onClick={() => handleNotifyMe(product._id, product.name)}
                      disabled={notifyingId === product._id}
                      className="w-full py-1.5 rounded-xl border border-[#EF4444]/40 bg-red-50 text-[#EF4444] hover:bg-red-100 text-[9.5px] font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      {notifyingId === product._id ? (
                        <Loader2 size={11} className="animate-spin text-[#EF4444]" />
                      ) : (
                        <>
                          <Bell size={10} />
                          <span>Notify</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                      className="w-full py-1.5 rounded-xl bg-[#0057FF] hover:bg-[#003BB5] text-white text-[9.5px] font-extrabold transition-all active:scale-95 shadow-2xs flex items-center justify-center gap-1"
                    >
                      {addingId === product._id ? (
                        <Loader2 size={11} className="animate-spin text-white" />
                      ) : (
                        <>
                          <ShoppingCart size={10} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryRightPanel;
