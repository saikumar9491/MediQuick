import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { validateCart, fetchCart } from '../../api/cart';

import CartItemRow from './components/CartItemRow';
import CartSummaryCard from './components/CartSummaryCard';
import EmptyCartState from './components/EmptyCartState';
import RecommendedProducts from './components/RecommendedProducts';

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 49;

const Cart = () => {
  const { token } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, setCartItems } = useCart();
  const navigate = useNavigate();

  const [validating, setValidating] = useState(false);
  const [validationIssues, setValidationIssues] = useState([]);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Undo-removal registry
  const removingRef = useRef({});  // { productId: { committed } }
  const [pendingRemovals, setPendingRemovals] = useState({}); // optimistically hidden keys

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ─── Manual Refresh / Sync ──────────────────────────────────────────────────

  const handleRefresh = async () => {
    if (!token) return;
    setValidating(true);
    try {
      const data = await fetchCart(token);
      if (isMounted.current && data.items) {
        // Update context items
        const formatted = data.items.map(item => ({
          _id: item.productId,
          ...item,
        }));
        if (typeof setCartItems === 'function') {
          setCartItems(formatted);
        }
      }
    } catch (_) {
      toast.error('Failed to sync live prices/stock');
    } finally {
      if (isMounted.current) setValidating(false);
    }
  };

  // ─── Validate on load ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!token || cartItems.length === 0) return;

    const runValidate = async () => {
      setValidating(true);
      try {
        const result = await validateCart(token);
        if (result.issues?.length > 0) {
          const serious = result.issues.filter(
            i => i.issues?.some(t => t === 'out_of_stock' || t === 'stock_reduced')
          );
          if (isMounted.current) {
            setValidationIssues(serious);
            // If the validation endpoint returns updated items, sync them to context
            if (result.items?.length > 0 && typeof setCartItems === 'function') {
              setCartItems(result.items.map(item => ({
                _id: item.productId,
                ...item,
              })));
            }
          }
        } else {
          if (isMounted.current) setValidationIssues([]);
        }
      } catch (_) {
        // Non-fatal
      } finally {
        if (isMounted.current) setValidating(false);
      }
    };

    const t = setTimeout(runValidate, 800);
    return () => clearTimeout(t);
  }, [token, cartItems.length === 0]);

  // ─── Coupon auto-removal if subtotal drops ───────────────────────────────

  useEffect(() => {
    if (!appliedCoupon) return;
    const activeSubtotal = cartItems
      .filter(i => !i.outOfStock && !pendingRemovals[i.productId || i._id])
      .reduce((sum, i) => {
        const p = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
        return sum + p * (i.quantity || 1);
      }, 0);

    if (activeSubtotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      toast(`Coupon ${appliedCoupon.code} removed — order fell below ₹${appliedCoupon.minOrderValue} minimum`, {
        icon: 'ℹ️',
        duration: 4000,
      });
    }
  }, [cartItems, pendingRemovals, appliedCoupon]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleQuantityChange = async (productId, newQty) => {
    updateQuantity(productId, newQty);
  };

  const handleRemove = async (productId, mode) => {
    const key = productId?.toString();

    if (mode === 'optimistic') {
      setPendingRemovals(prev => ({ ...prev, [key]: true }));
      removingRef.current[key] = { committed: false };
      return;
    }

    if (mode === 'undo') {
      setPendingRemovals(prev => { const n = { ...prev }; delete n[key]; return n; });
      if (removingRef.current[key]) removingRef.current[key].committed = true;
      return;
    }

    if (mode === 'commit') {
      if (removingRef.current[key]?.committed) return;
      
      // Call context function to remove item. Auto-save handles DB deletion.
      removeFromCart(productId);

      if (isMounted.current) {
        setPendingRemovals(prev => { const n = { ...prev }; delete n[key]; return n; });
      }
      return;
    }
  };

  const handleProceed = () => {
    if (!token) { navigate('/login', { state: { from: '/cart' } }); return; }
    navigate('/checkout');
  };

  // ─── Derived state ───────────────────────────────────────────────────────

  const visibleItems = cartItems.filter(item => {
    const id = item.productId || item._id;
    return id && !pendingRemovals[id.toString()];
  });
  const cartCategories = [...new Set(visibleItems.map(i => i.category).filter(Boolean))];

  const activeItems = visibleItems.filter(i => !i.outOfStock);
  const subtotal = activeItems.reduce((sum, i) => {
    const p = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
    return sum + p * (i.quantity || 1);
  }, 0);
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (subtotal === 0 ? 0 : DELIVERY_FEE);
  const totalAmount = subtotal + deliveryFee - couponDiscount;

  // ─── Render ──────────────────────────────────────────────────────────────

  if (visibleItems.length === 0 && Object.keys(pendingRemovals).length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <EmptyCartState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-36 md:pb-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingCart size={22} className="text-blue-600" />
              Your Cart
              <span className="text-base font-normal text-slate-400 ml-1">
                ({visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''})
              </span>
            </h1>
          </div>
          {token && (
            <button
              onClick={handleRefresh}
              disabled={validating}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RefreshCw size={12} className={validating ? 'animate-spin' : ''} />
              {validating ? 'Checking stock…' : 'Refresh'}
            </button>
          )}
        </div>

        {/* Validation issues banner */}
        {validationIssues.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Some items have changed since you added them</p>
              <ul className="mt-1 space-y-0.5">
                {validationIssues.map((issue, i) => (
                  <li key={i} className="text-xs text-amber-700">
                    <span className="font-medium">{issue.name}</span>:&nbsp;
                    {issue.issues?.includes('out_of_stock') && 'Out of stock'}
                    {issue.issues?.includes('stock_reduced') && `Only ${issue.currentStock} left`}
                    {issue.issues?.includes('price_changed') && ` · Price updated to ₹${issue.currentPrice}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* LEFT — Cart Items */}
          <div className="flex-1 min-w-0 space-y-3">
            {visibleItems.map(item => (
              <CartItemRow
                key={item.productId || item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                disabled={validating}
              />
            ))}

            {/* Recommendations */}
            <RecommendedProducts cartCategories={cartCategories} />
          </div>

          {/* RIGHT — Summary (always visible, sticky on md+) */}
          <div className="w-full md:w-[340px] lg:w-[380px] flex-shrink-0 md:sticky md:top-24">
            <CartSummaryCard
              items={visibleItems}
              token={token}
              appliedCoupon={appliedCoupon}
              onCouponApply={(coupon) => setAppliedCoupon({ ...coupon, minOrderValue: coupon.minOrderValue || 0 })}
              onCouponRemove={() => setAppliedCoupon(null)}
              onProceed={handleProceed}
              isLoggedIn={!!token}
            />
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BOTTOM CART BAR (Flipkart Style) */}
      {visibleItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between md:hidden shadow-[0_-4px_15px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Amount</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">₹{totalAmount}</span>
              {couponDiscount > 0 && (
                <span className="text-[9px] font-bold text-[#16A34A]">Saved ₹{couponDiscount}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleProceed}
            disabled={activeItems.length === 0}
            className="bg-[#0057FF] hover:bg-[#003BB5] disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full shadow-md active:scale-95 transition-transform"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
