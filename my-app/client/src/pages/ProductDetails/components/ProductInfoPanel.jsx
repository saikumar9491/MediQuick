import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CreditCard, RefreshCw, Star, Heart } from 'lucide-react';

export const ProductInfoPanel = ({ 
  medicine, 
  selectedVariant, 
  packVariants, 
  setSelectedVariant, 
  quantity, 
  setQuantity, 
  handleAddToCart, 
  handleBuyNow,
  jumpToReviews,
  isWishlisted,
  toggleWishlist
}) => {
  // selectedVariant is always set (real DB variant OR fallback bundle)
  const finalPrice = selectedVariant
    ? selectedVariant.price
    : (medicine.discountPrice || medicine.price);

  // MRP: for bundle fallbacks use medicine.price × multiplier × 1.05; for real DB variants use 1.33×
  const mrp = selectedVariant
    ? selectedVariant.isRealDbVariant
      ? Math.round(selectedVariant.price * 1.33)
      : Math.round(medicine.price * (selectedVariant.multiplier || 1) * 1.05)
    : Math.round(medicine.price * 1.33);

  const discountPercent = mrp > finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : 0;

  const priceDisplay = finalPrice;
  const mrpDisplay = mrp;

  const currentStock = selectedVariant
    ? selectedVariant.countInStock
    : medicine.countInStock;

  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= (medicine.lowStockThreshold || 10);

  return (
    <div className="space-y-6">
      {/* Brand & Name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-teal-600 uppercase tracking-widest">
            {medicine.category} {medicine.subCategory && `/ ${medicine.subCategory}`}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-800 leading-tight">
          {medicine.name}
        </h1>
        <p className="text-xs text-slate-450 font-medium">
          Manufactured by:{' '}
          <Link to={`/brand/${medicine.brand}`} className="text-blue-600 hover:underline font-medium">
            {medicine.brand}
          </Link>
        </p>
      </div>

      {/* Understated rating summary */}
      <div 
        onClick={jumpToReviews}
        className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 text-xs text-slate-450 font-medium"
      >
        <div className="flex items-center text-amber-400 gap-0.5">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-slate-700 font-medium">{medicine.rating?.toFixed(1) || '0.0'}</span>
        </div>
        <span>•</span>
        <span className="hover:underline">{medicine.numReviews || 0} reviews</span>
      </div>

      {/* Description */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">Product Description</p>
        {medicine.description && medicine.description.trim().length > 0 ? (
          <p className="text-xs text-slate-600 leading-relaxed">{medicine.description}</p>
        ) : (
          <p className="text-xs text-slate-400 italic leading-relaxed">
            Detailed clinical profiles, uses, and instructions are featured in the tabs below.
          </p>
        )}
      </div>

      {/* Composition / Salt */}
      {medicine.salt && (
        <div className="p-3.5 bg-slate-50/50 border border-slate-200/40 rounded-xl">
          <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Composition / Generic Name</p>
          <p className="text-xs text-slate-650 mt-1 font-medium leading-relaxed">{medicine.salt}</p>
        </div>
      )}

      {/* Price block */}
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-medium text-slate-900">
            ₹{priceDisplay}
          </span>
          {discountPercent > 0 && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm line-through text-slate-350">M.R.P. ₹{mrpDisplay}</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full">
                {discountPercent}% off
              </span>
            </div>
          )}
        </div>
        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Inclusive of all taxes</p>
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <span className="text-xs font-medium text-red-500">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="text-xs font-medium text-orange-500">
            Only {medicine.countInStock} left
          </span>
        ) : (
          <span className="text-xs font-medium text-emerald-600">
            In stock
          </span>
        )}
      </div>

      {/* Package / Bundle Selector — always visible */}
      {packVariants && packVariants.length > 0 && (
        <div className="space-y-3">
          <label className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.15em] block">Choose Package</label>
          <div className="flex flex-wrap gap-2.5">
            {packVariants.map(v => {
              const isSelected = selectedVariant && selectedVariant.label === v.label;
              return (
                <button
                  key={v.label}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs ${
                    isSelected
                      ? 'bg-[#0f172a] text-white border-transparent font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350 font-medium'
                  }`}
                >
                  <span className="text-sm">{v.icon}</span>
                  <span>{v.label}</span>
                  {v.info && (
                    <span className={`text-[9px] font-normal ml-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {v.info}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!isOutOfStock && (
          <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden w-full sm:w-28 justify-between">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-3.5 py-2 text-slate-400 hover:text-slate-700 transition-colors font-medium text-sm"
            >
              -
            </button>
            <span className="font-medium text-xs text-slate-700">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="px-3.5 py-2 text-slate-400 hover:text-slate-700 transition-colors font-medium text-sm"
            >
              +
            </button>
          </div>
        )}

        {isOutOfStock ? (
          <button 
            className="w-full py-3 bg-slate-900 text-white font-medium text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all"
            onClick={() => toast.success("We'll notify you once this medicine is back in stock!")}
          >
            Notify me when available
          </button>
        ) : (
          <div className="flex-grow flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="px-5 py-3 border border-slate-200 hover:border-slate-350 text-slate-700 font-medium text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-slate-50"
            >
              Buy Now
            </button>
            <button 
              onClick={toggleWishlist}
              className={`p-3 border rounded-xl transition-all ${
                isWishlisted 
                  ? 'border-rose-200 bg-rose-50/50 text-rose-500' 
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Rx Required warning */}
      {medicine.needsRx && (
        <div className="flex items-start gap-3 p-4 bg-orange-50/30 border border-orange-100 text-orange-700 rounded-xl">
          <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
          <div className="text-xs font-medium">
            <p className="font-semibold text-orange-800">Prescription Required</p>
            <p className="mt-0.5 text-orange-600/90 leading-relaxed">A doctor's prescription is required to purchase this product. You can upload it during checkout.</p>
          </div>
        </div>
      )}
    </div>
  );
};
