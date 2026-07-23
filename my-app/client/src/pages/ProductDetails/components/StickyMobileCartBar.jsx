import React from 'react';

export const StickyMobileCartBar = ({ medicine, selectedVariant, handleAddToCart }) => {
  const finalPrice = medicine.discountPrice || medicine.price;
  const priceDisplay = selectedVariant && selectedVariant.isRealDbVariant
    ? selectedVariant.price
    : finalPrice;
  const isOutOfStock = medicine.countInStock <= 0;

  if (isOutOfStock) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 z-40 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)] animate-in slide-in-from-bottom duration-300">
      <div>
        <p className="text-lg font-black text-slate-900">
          ₹{priceDisplay}
        </p>
        {selectedVariant && (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{selectedVariant.label}</p>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="text-xs font-black uppercase tracking-widest text-slate-900 hover:opacity-80 transition-opacity"
      >
        Add to cart
      </button>
    </div>
  );
};
