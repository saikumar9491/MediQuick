import React, { useState } from 'react';
import { Tag, CheckCircle, X, Loader2, ShieldCheck, RotateCcw, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { validateCoupon } from '../../../api/checkout';
import ConfettiExplosion from '../../../components/ConfettiExplosion';

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 49;

const CartSummaryCard = ({
  items = [],
  token,
  appliedCoupon,
  onCouponApply,
  onCouponRemove,
  onProceed,
  isLoggedIn,
}) => {
  const [couponOpen, setCouponOpen] = useState(false);
  const [code, setCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Only in-stock items count toward totals
  const activeItems = items.filter(i => !i.outOfStock);
  const subtotal = activeItems.reduce((sum, i) => {
    const p = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
    return sum + p * (i.quantity || 1);
  }, 0);

  const oosCount = items.filter(i => i.outOfStock).length;
  const allOos = items.length > 0 && activeItems.length === 0;

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (subtotal === 0 ? 0 : DELIVERY_FEE);
  const total = subtotal + deliveryFee - couponDiscount;
  const freeDeliveryGap = FREE_DELIVERY_THRESHOLD - subtotal;
  const cartCategories = activeItems.map(i => i.category).filter(Boolean);

  const handleApplyCoupon = async () => {
    if (!code.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const result = await validateCoupon(token, { code, subtotal, cartCategories });
      onCouponApply(result);
      setCode('');
      setCouponOpen(false);
      setShowConfetti(true);
    } catch (e) {
      setCouponError(e.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const canProceed = activeItems.length > 0 && !allOos;
  const disabledReason = !isLoggedIn
    ? 'Log in to proceed to checkout'
    : items.length === 0
    ? 'Your cart is empty'
    : allOos
    ? 'Remove out-of-stock items to continue'
    : null;

  return (
    <>
      {showConfetti && <ConfettiExplosion />}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Order Summary</h3>
      </div>

      {/* OOS warning */}
      {oosCount > 0 && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600">
            {oosCount} item{oosCount > 1 ? 's are' : ' is'} out of stock and excluded from total
          </p>
        </div>
      )}

      {/* Coupon */}
      <div className="px-5 py-4 border-b border-slate-100">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-emerald-700">{appliedCoupon.code}</p>
                <p className="text-[10px] text-emerald-600">You save ₹{appliedCoupon.discountAmount}</p>
              </div>
            </div>
            <button
              onClick={onCouponRemove}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setCouponOpen(o => !o)}
              className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Tag size={13} />
              Have a coupon code?
            </button>

            {couponOpen && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={code}
                      onChange={e => { setCode(e.target.value.toUpperCase()); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !code.trim() || !isLoggedIn}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <X size={11} /> {couponError}
                  </p>
                )}
                {!isLoggedIn && (
                  <p className="text-xs text-slate-400">Log in to apply coupons</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 space-y-3 border-b border-slate-100">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal ({activeItems.length} item{activeItems.length !== 1 ? 's' : ''})</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Delivery</span>
          <span className={deliveryFee === 0 && subtotal > 0 ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
            {subtotal === 0 ? '—' : deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600 font-medium">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>−₹{couponDiscount}</span>
          </div>
        )}

        {/* Free delivery nudge */}
        {subtotal > 0 && freeDeliveryGap > 0 && (
          <div className="pt-1">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Add ₹{freeDeliveryGap} more for free delivery</span>
              <span>{Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-100">
          <span className="text-sm">Total</span>
          <span className="text-base">₹{total}</span>
        </div>
        <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 space-y-3">
        {disabledReason && (
          <p className="text-[11px] text-center text-slate-400">{disabledReason}</p>
        )}
        <button
          onClick={onProceed}
          disabled={!canProceed || !isLoggedIn}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 transition-all"
        >
          Proceed to Checkout <ArrowRight size={15} />
        </button>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 pt-1">
          {[
            { icon: ShieldCheck, label: 'Secure Payment' },
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Award, label: 'Licensed Pharmacy' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1 text-[10px] text-slate-400">
              <Icon size={11} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default CartSummaryCard;
