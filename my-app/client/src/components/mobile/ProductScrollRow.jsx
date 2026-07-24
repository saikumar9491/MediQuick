import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Plus, Minus, ShoppingCart, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';
import toast from 'react-hot-toast';

export const MobileProductCard = ({ product }) => {
  if (!product) return null;
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const _id = product._id;
  const name = product.name;
  const brand = product.brand;
  const image = product.image;
  const price = product.price;
  const discountPrice = product.discountPrice;
  const countInStock = product.countInStock;
  const isBestseller = product.isBestseller || product.rating >= 4.5;
  const rating = product.rating || 0;

  // Cart logic
  const cartItem = cartItems?.find(item => (item._id || item.productId) === _id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = countInStock === 0;

  // Discount math
  const hasDiscount = !!discountPrice && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const mrp = price;
  const discountPercent = hasDiscount ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;

  const handleCardClick = async () => {
    // 1. Log view history to backend
    let sessionId = sessionStorage.getItem('mq_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('mq_session_id', sessionId);
    }

    try {
      fetch(`${API_BASE}/api/customers/recently-viewed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ productId: _id, sessionId })
      }).catch(e => console.error("Error logging view history", e));
    } catch (e) {}

    // 2. Navigate to product details page
    navigate(`/product/${_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setLoading(true);
    try {
      addToCart({
        _id,
        name,
        brand,
        image,
        price: finalPrice,
        countInStock
      });
      toast.success(`${name} added to cart`, { duration: 1500 });
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (currentQuantity >= countInStock) {
      toast.error('Max stock limit reached');
      return;
    }
    updateQuantity(_id, currentQuantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (currentQuantity <= 1) {
      removeFromCart(_id);
      toast.success('Removed from cart', { duration: 1500 });
    } else {
      updateQuantity(_id, currentQuantity - 1);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="w-36 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col shrink-0 relative active:scale-[0.98] transition-transform select-none"
    >
      {/* Badges (Flipkart style Bestseller) */}
      {isBestseller && (
        <span className="absolute top-2 left-2 z-10 bg-[#FF6B00] text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-3xs">
          Bestseller
        </span>
      )}

      {/* Image container */}
      <div className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1.5 mb-2.5">
        <img 
          src={image} 
          alt={name} 
          className="max-h-full max-w-full object-contain mix-blend-multiply" 
          loading="lazy"
        />
      </div>

      {/* Product info */}
      <div className="flex-1 flex flex-col min-w-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{brand}</span>
        <h4 className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2 mt-0.5 min-h-[28px]">{name}</h4>

        {/* Rating pill */}
        {rating > 0 && (
          <div className="flex items-center gap-0.5 mt-1 bg-emerald-50 text-emerald-700 font-extrabold text-[9px] w-fit px-1.5 py-0.5 rounded">
            <span>{rating.toFixed(1)}</span>
            <Star size={7} className="fill-current stroke-none" />
          </div>
        )}

        {/* Price & Cart row */}
        <div className="flex items-end justify-between mt-2.5 pt-2 border-t border-slate-100/60">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[9px] text-slate-400 line-through">₹{mrp}</span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-900">₹{finalPrice}</span>
              {discountPercent > 0 && (
                <span className="text-[9px] font-black text-[#16A34A]">{discountPercent}% Off</span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          {isOutOfStock ? (
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-[#EF4444] uppercase leading-none">Out of Stock</span>
              <button 
                onClick={(e) => { e.stopPropagation(); toast.success("We will notify you when in stock!"); }}
                className="text-[8px] font-bold text-[#EF4444] underline hover:text-red-600 mt-0.5"
              >
                Notify me
              </button>
            </div>
          ) : currentQuantity > 0 ? (
            <div className="flex items-center bg-[#0057FF] rounded-full text-white overflow-hidden shadow-sm h-6">
              <button 
                onClick={handleDecrement}
                className="w-5 flex items-center justify-center text-xs font-bold active:bg-[#003BB5] h-full"
              >
                -
              </button>
              <span className="text-[10px] font-black w-4 text-center">{currentQuantity}</span>
              <button 
                onClick={handleIncrement}
                className="w-5 flex items-center justify-center text-xs font-bold active:bg-[#003BB5] h-full"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="h-6 w-6 rounded-full bg-[#0057FF] active:bg-[#003BB5] hover:scale-105 flex items-center justify-center text-white transition-all shadow-3xs"
              title="Add to Cart"
            >
              {loading ? (
                <Loader2 size={11} className="animate-spin text-white" />
              ) : (
                <Plus size={13} strokeWidth={3} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductScrollRow = ({ title, products = [], seeAllLink }) => {
  const rowRef = React.useRef(null);
  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (rowRef.current) rowRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (rowRef.current) rowRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  return (
    <div className="space-y-3.5 bg-white py-4 px-4 border-b border-slate-100">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
        
        <div className="flex items-center gap-2">
          {/* Side Scroll Arrow Controls (< >) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={scrollLeft}
              className="p-1 rounded-lg bg-slate-100 hover:bg-[#0057FF] hover:text-white text-slate-600 transition-all cursor-pointer active:scale-95 border border-slate-200/80"
              title="Scroll Left"
            >
              <ChevronLeft size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="p-1 rounded-lg bg-slate-100 hover:bg-[#0057FF] hover:text-white text-slate-600 transition-all cursor-pointer active:scale-95 border border-slate-200/80"
              title="Scroll Right"
            >
              <ChevronRight size={15} strokeWidth={2.5} />
            </button>
          </div>

          {seeAllLink && (
            <Link 
              to={seeAllLink} 
              className="text-xs font-black text-[#FF6B00] hover:text-[#E55A00] uppercase tracking-wider flex items-center gap-0.5 hover:underline"
            >
              See All
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal scrolling wrapper */}
      <div ref={rowRef} className="flex overflow-x-auto gap-3.5 pb-2.5 scrollbar-none snap-x scroll-smooth">
        {products.map((product) => (
          <div key={product._id} className="snap-start">
            <MobileProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductScrollRow;
