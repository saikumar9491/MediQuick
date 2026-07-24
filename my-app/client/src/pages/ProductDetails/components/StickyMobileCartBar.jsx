import React from 'react';

export const StickyMobileCartBar = ({ medicine, selectedVariant, handleAddToCart }) => {
  const finalPrice = medicine.discountPrice || medicine.price;
  const priceDisplay = selectedVariant && selectedVariant.isRealDbVariant
    ? selectedVariant.price
    : finalPrice;
  const isOutOfStock = medicine.countInStock <= 0;

  if (isOutOfStock) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 z-40 bg-white text-slate-800 border-t border-slate-200 px-6 py-3 flex items-center justify-between lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300">
      <div>
        <p className="text-xl font-black text-slate-900">
          ₹{priceDisplay}
        </p>
        {selectedVariant && (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{selectedVariant.label}</p>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-[#0057FF] hover:bg-[#003BB5] text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
      >
        Add to cart
      </button>
    </div>
  );
};
