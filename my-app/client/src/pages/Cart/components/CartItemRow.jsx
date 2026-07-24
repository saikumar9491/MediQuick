import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, FileText, AlertCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const UNDO_DURATION = 5000;

const CartItemRow = ({ item, onQuantityChange, onRemove, disabled }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Safe product identifier for both legacy and new schemas
  const prodId = item.productId || item._id;

  // Real price logic — discountPrice is the sale price, price is MRP
  const salePrice = item.discountPrice && item.discountPrice < item.price
    ? item.discountPrice
    : item.price;
  const mrp = item.price;
  const hasDiscount = salePrice < mrp;
  const discountPct = hasDiscount ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;
  const lineTotal = salePrice * (item.quantity || 1);

  const atStockLimit = item.quantity >= item.countInStock;
  const isOos = item.outOfStock;

  const handleQuantityChange = async (delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1 || newQty > item.countInStock) return;
    setUpdating(true);
    try {
      await onQuantityChange(prodId, newQty);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    // Optimistic: notify parent immediately
    onRemove(prodId, 'optimistic');

    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-700">Removed <strong>{item.name.split(' ').slice(0, 3).join(' ')}</strong></span>
          <button
            className="text-xs font-semibold text-blue-600 underline"
            onClick={() => {
              toast.dismiss(t.id);
              onRemove(prodId, 'undo');
              setRemoving(false);
            }}
          >
            Undo
          </button>
        </div>
      ),
      { duration: UNDO_DURATION, icon: null }
    );

    // Commit after undo window
    setTimeout(async () => {
      try {
        await onRemove(prodId, 'commit');
      } catch (_) {}
    }, UNDO_DURATION + 200);
  };

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      isOos
        ? 'border-red-100 bg-red-50/20'
        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
    }`}>
      {/* Out-of-stock overlay label */}
      {isOos && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 text-[#EF4444] text-[10px] font-black rounded-full uppercase tracking-wider shadow-2xs">
            <AlertCircle size={10} /> Out of Stock
          </span>
        </div>
      )}

      <div className={`flex gap-3 sm:gap-4 p-3 sm:p-4 ${isOos ? 'opacity-50' : ''}`}>
        {/* Product Image */}
        <button
          onClick={() => navigate(`/product/${prodId}`)}
          className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden hover:border-blue-200 transition-colors"
        >
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => navigate(`/product/${prodId}`)}
                className="text-xs sm:text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors text-left leading-snug line-clamp-2 w-full"
              >
                {/* Show first 8 words max to keep layout clean */}
                {item.name?.split(' ').slice(0, 8).join(' ')}{item.name?.split(' ').length > 8 ? '…' : ''}
              </button>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.brand}</p>
            </div>

            {/* Line total */}
            <div className="text-right flex-shrink-0">
              <p className="text-base font-semibold text-slate-900">₹{lineTotal}</p>
              {hasDiscount && (
                <p className="text-[10px] text-slate-400 line-through">₹{mrp * item.quantity}</p>
              )}
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-slate-800">₹{salePrice}</span>
            {hasDiscount && (
              <>
                <span className="text-xs text-slate-400 line-through">₹{mrp}</span>
                <span className="text-[10px] font-bold text-[#16A34A] bg-green-50 px-1.5 py-0.5 rounded">
                  {discountPct}% OFF
                </span>
              </>
            )}
            <span className="text-[10px] text-slate-400">per unit</span>
          </div>

          {/* In Stock check badge */}
          {!isOos && (
            <div className="flex items-center gap-1.5 mt-2 bg-green-50 text-[#16A34A] border border-green-200/50 px-2 py-0.5 rounded-full w-fit text-[9px] font-black uppercase tracking-wider">
              In Stock
            </div>
          )}

          {/* Rx tag */}
          {item.needsRx && (
            <div className="flex items-center gap-1 mt-1.5">
              <FileText size={10} className="text-amber-500" />
              <span className="text-[10px] text-amber-600 font-medium">Prescription required at checkout</span>
            </div>
          )}

          {/* Stock limit warning */}
          {!isOos && atStockLimit && (
            <p className="text-[10px] text-orange-500 font-medium mt-1">
              Only {item.countInStock} left in stock
            </p>
          )}

          {/* Bottom row: Qty stepper + Actions */}
          <div className="flex items-center justify-between mt-3">
            {/* Quantity stepper */}
            {!isOos ? (
              <div className={`flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden ${updating ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1 || updating || disabled}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                >
                  <Minus size={13} className="text-[#0057FF]" />
                </button>
                <span className="w-9 text-center text-sm font-semibold text-slate-800 border-x border-slate-200">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={atStockLimit || updating || disabled}
                  title={atStockLimit ? `Only ${item.countInStock} available` : ''}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                >
                  <Plus size={13} className="text-[#0057FF]" />
                </button>
              </div>
            ) : (
              <div /> /* spacer */
            )}

            {/* Remove button */}
            <button
              onClick={handleRemove}
              disabled={removing || disabled}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#EF4444] transition-colors disabled:opacity-40"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
