import React from 'react';

export const StickyMobileCartBar = ({ medicine, selectedVariant, handleAddToCart }) => {
  const finalPrice = medicine.discountPrice || medicine.price;
  const priceDisplay = selectedVariant && selectedVariant.isRealDbVariant
    ? selectedVariant.price
    : finalPrice;
  const isOutOfStock = medicine.countInStock <= 0;

  if (isOutOfStock) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 z-40 bg-[#181d28] text-white border-t border-white/10 px-6 py-3 flex items-center justify-between lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom duration-300">
      <div>
        <p className="text-xl font-black text-white">
          ₹{priceDisplay}
        </p>
        {selectedVariant && (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{selectedVariant.label}</p>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-white hover:bg-slate-100 text-[#181d28] text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
      >
        Add to cart
      </button>
    </div>
  );
};
