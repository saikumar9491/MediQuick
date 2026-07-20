import React from 'react';
import { ShieldCheck, RotateCcw, Award, Minus, Plus, Trash2 } from 'lucide-react';
import { CouponInput } from './CouponInput';

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 49;

export const OrderSummaryCard = ({
  cartItems,
  deliveryEstimate,
  appliedCoupon,
  onCouponApply,
  onCouponRemove,
  onQuantityChange,
  onRemoveItem,
  token,
  isServiceable,
  selectedAddress,
  paymentMethod,
  rxRequired,
  prescriptionUploaded,
  isPlacingOrder,
  onPlaceOrder,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee - couponDiscount;

  const cartCategories = cartItems.map(i => i.category).filter(Boolean);

  // Button disabled logic
  const isAddressOk = !!selectedAddress;
  const isZoneOk = isServiceable === true;
  const isPaymentOk = !!paymentMethod;
  const isRxOk = !rxRequired || prescriptionUploaded;
  const canPlace = isAddressOk && isZoneOk && isPaymentOk && isRxOk && !isPlacingOrder;

  const disabledReason = !isAddressOk
    ? 'Select a delivery address'
    : !isZoneOk
    ? 'Delivery not available to this pincode'
    : !isPaymentOk
    ? 'Select a payment method'
    : !isRxOk
    ? 'Upload required prescription'
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Order Summary</h3>
        <p className="text-xs text-slate-400 mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Cart Items */}
      <div className="px-5 py-4 space-y-4 max-h-60 overflow-y-auto">
        {cartItems.map(item => (
          <div key={item._id} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate leading-tight">{item.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.brand}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg">
                  <button
                    onClick={() => onQuantityChange(item._id, (item.quantity || 1) - 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-xs font-medium text-slate-700 w-5 text-center">{item.quantity || 1}</span>
                  <button
                    onClick={() => onQuantityChange(item._id, (item.quantity || 1) + 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">₹{item.price * (item.quantity || 1)}</span>
                  <button onClick={() => onRemoveItem(item._id)} className="text-slate-300 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="px-5 pb-4 border-b border-slate-100">
        <CouponInput
          token={token}
          subtotal={subtotal}
          cartCategories={cartCategories}
          appliedCoupon={appliedCoupon}
          onApply={onCouponApply}
          onRemove={onCouponRemove}
        />
      </div>

      {/* Price Breakdown */}
      <div className="px-5 py-4 space-y-2.5 border-b border-slate-100">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : ''}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-[10px] text-slate-400">Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more for free delivery</p>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600 font-medium">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>−₹{couponDiscount}</span>
          </div>
        )}
        {deliveryEstimate?.deliveryDateString && isServiceable && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Estimated delivery</span>
            <span className="font-medium">{deliveryEstimate.deliveryDateString}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-100">
          <span className="text-sm">Total</span>
          <span className="text-base">₹{total}</span>
        </div>
        <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
      </div>

      {/* Place Order CTA */}
      <div className="px-5 py-4 space-y-3">
        {disabledReason && (
          <p className="text-[11px] text-center text-slate-400">{disabledReason}</p>
        )}
        <button
          onClick={onPlaceOrder}
          disabled={!canPlace}
          className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-150 flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : (
            <>Place Order · ₹{total}</>
          )}
        </button>

        {/* Trust Row */}
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
  );
};
