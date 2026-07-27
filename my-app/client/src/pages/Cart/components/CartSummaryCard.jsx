import React from 'react';
import { Tag, CheckCircle, X, Loader2, ShieldCheck, RotateCcw, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { validateCoupon } from '../../../api/checkout';
import { CouponInput } from '../../Checkout/components/CouponInput';

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
  const boxRef = useRef(null);
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    if (appliedCoupon && justApplied && boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        // Global confetti shoots out of the box and across the screen
        confetti({
          particleCount: 10,
          spread: 120,
          startVelocity: 30,
          origin: { x, y },
          colors: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
          zIndex: 9999
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      setJustApplied(false);
    }
  }, [appliedCoupon, justApplied]);

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
      setJustApplied(true);
      onCouponApply(result);
      setCode('');
      setCouponOpen(false);
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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible relative">
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
        <CouponInput
          token={token}
          subtotal={subtotal}
          cartCategories={cartCategories}
          appliedCoupon={appliedCoupon}
          onApply={onCouponApply}
          onRemove={onCouponRemove}
        />
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 space-y-3 border-b border-slate-100">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal ({activeItems.length} item{activeItems.length !== 1 ? 's' : ''})</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Delivery</span>
          <span className={deliveryFee === 0 && subtotal > 0 ? 'text-[#16A34A] font-medium' : 'text-slate-500'}>
            {subtotal === 0 ? '—' : deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs text-[#16A34A] font-medium">
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
      <div className="px-5 py-4 space-y-3 md:block hidden">
        {disabledReason && (
          <p className="text-[11px] text-center text-slate-400">{disabledReason}</p>
        )}
        <button
          onClick={onProceed}
          disabled={!canProceed || !isLoggedIn}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0057FF] text-white text-sm font-semibold hover:bg-[#003BB5] active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 transition-all"
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
