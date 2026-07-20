import React from 'react';

export const StickyMobileCartBar = ({ medicine, selectedVariant, handleAddToCart }) => {
  const finalPrice = medicine.discountPrice || medicine.price;
  const priceDisplay = selectedVariant && selectedVariant.isRealDbVariant
    ? selectedVariant.price
    : finalPrice;
  const isOutOfStock = medicine.countInStock <= 0;

  if (isOutOfStock) return null;

  return (
    <div className="fixed bottom-[56px] left-0 right-0 z-40 bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <img 
          src={medicine.image} 
          alt={medicine.name} 
          className="w-10 h-10 object-contain rounded bg-slate-50/50 p-1 border border-slate-100/65"
        />
        <div>
          <p className="text-xs font-medium text-slate-800 line-clamp-1 max-w-[140px] leading-tight">
            {medicine.name}
          </p>
          <p className="text-xs font-medium text-slate-900 mt-0.5">
            ₹{priceDisplay} {selectedVariant && <span className="text-[9px] font-normal text-slate-400">({selectedVariant.label})</span>}
          </p>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-2xs transition-colors min-w-[110px]"
      >
        Add to Cart
      </button>
    </div>
  );
};
