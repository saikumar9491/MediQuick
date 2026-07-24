import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Bell, 
  Loader2, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const SubcategoryProductListing = ({
  categoryName,
  subcategoryName,
  onBack
}) => {
  const { cart, addToCart } = useCart();
  const { user, token } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [addingId, setAddingId] = useState(null);
  const [notifyingId, setNotifyingId] = useState(null);

  // Dynamic filter chips derived from products
  const [chips, setChips] = useState(['All']);

  useEffect(() => {
    const fetchSubcategoryProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/medicines?limit=50`;
        if (categoryName && categoryName !== 'All') {
          url += `&category=${encodeURIComponent(categoryName)}`;
        }
        if (subcategoryName && subcategoryName !== 'All') {
          url += `&subCategory=${encodeURIComponent(subcategoryName)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        let items = data.medicines || data || [];

        // Fallback: If specific subcategory query returns 0 items, fetch all products for the parent category
        if (items.length === 0 && categoryName && categoryName !== 'All') {
          const fallbackUrl = `${API_BASE}/api/medicines?limit=50&category=${encodeURIComponent(categoryName)}`;
          const fallbackRes = await fetch(fallbackUrl);
          const fallbackData = await fallbackRes.json();
          items = fallbackData.medicines || fallbackData || [];
        }

        setProducts(items);

        // Derive sub-filter chips (e.g. Brands or Rx status)
        const brandSet = new Set(items.map(p => p.brand).filter(Boolean));
        const derivedChips = ['All', ...Array.from(brandSet).slice(0, 5)];
        setChips(derivedChips);
      } catch (err) {
        console.error('Failed to load subcategory products:', err);
        toast.error('Could not load products');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategoryProducts();
  }, [categoryName, subcategoryName]);

  // Filter products by active chip
  const filteredProducts = products.filter(p => {
    if (activeChip === 'All') return true;
    return (p.brand || '').toLowerCase() === activeChip.toLowerCase();
  });

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

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      {/* 1. Header Row */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-3xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none"
            aria-label="Back to categories"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {categoryName}
            </span>
            <h1 className="text-sm font-extrabold text-[#0057FF] truncate leading-tight">
              {subcategoryName}
            </h1>
          </div>
        </div>

        {/* Real Product Count Badge */}
        <span className="text-[10px] font-extrabold text-[#FF6B00] bg-orange-50 border border-orange-100/80 px-2.5 py-1 rounded-full flex-shrink-0 font-[IBM_Plex_Mono]">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* 2. Horizontal Filter Chips */}
      {chips.length > 1 && (
        <div className="bg-white border-b border-slate-150 py-2 px-4 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {chips.map(chip => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#0057FF] text-white border-[#0057FF]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Product Listing Body */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 animate-pulse space-y-2">
                <div className="h-28 bg-slate-100 rounded-xl" />
                <div className="h-3 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                <div className="h-8 w-full bg-slate-100 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-xs font-bold text-slate-700">No products found</h3>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              There are currently no active medicines listed under {subcategoryName}.
            </p>
            <button
              onClick={onBack}
              className="mt-2 text-xs font-bold text-[#0057FF] hover:underline"
            >
              Back to Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {filteredProducts.map(product => {
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
                  className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-between relative shadow-2xs hover:shadow-sm transition-shadow group"
                >
                  {/* Bestseller Badge (Top-Left) */}
                  {isBestseller && (
                    <span className="absolute top-2 left-2 z-10 bg-[#FF6B00] text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                      Bestseller
                    </span>
                  )}

                  {/* Wishlist Heart Icon (Top-Right) */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-2xs border flex items-center justify-center transition-transform active:scale-90 ${
                      isFav ? 'border-rose-200 text-[#EF4444]' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#EF4444]' : ''}`} />
                  </button>

                  {/* Product Image */}
                  <div className="h-28 w-full bg-slate-50/60 rounded-xl p-2 mb-2 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.image || 'https://placehold.co/300x300?text=Medicine'}
                      alt={product.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Out of Stock Label overlay on image */}
                    {isOos && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center p-1">
                        <span className="bg-[#EF4444] text-white text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Name */}
                  <div className="space-y-0.5 mb-1.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block font-[IBM_Plex_Mono]">
                      {product.brand || 'Generic'}
                    </span>
                    <h3 className="text-[10.5px] font-bold text-slate-800 leading-snug line-clamp-2 min-h-[30px]">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing Row */}
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-xs font-black text-slate-900 font-[IBM_Plex_Mono]">
                      ₹{price}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-[9px] text-slate-400 line-through font-[IBM_Plex_Mono]">
                          ₹{mrp}
                        </span>
                        <span className="text-[9px] font-extrabold text-[#16A34A] font-[IBM_Plex_Mono] ml-auto">
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
                      className="w-full py-1.5 rounded-xl border border-[#EF4444]/40 bg-red-50 text-[#EF4444] hover:bg-red-100 text-[10px] font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      {notifyingId === product._id ? (
                        <Loader2 size={12} className="animate-spin text-[#EF4444]" />
                      ) : (
                        <>
                          <Bell size={11} />
                          <span>Notify</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                      className="w-full py-1.5 rounded-xl bg-[#0057FF] hover:bg-[#003BB5] text-white text-[10px] font-bold transition-all active:scale-95 shadow-2xs flex items-center justify-center gap-1"
                    >
                      {addingId === product._id ? (
                        <Loader2 size={12} className="animate-spin text-white" />
                      ) : (
                        <>
                          <ShoppingCart size={11} />
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

export default SubcategoryProductListing;
