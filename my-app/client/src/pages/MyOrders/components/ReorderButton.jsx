import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { reorder } from '../../../api/myOrders';
import { useCart } from '../../../context/CartContext';

const ReorderButton = ({ orderId, token, order, onComplete }) => {
  const navigate = useNavigate();
  const { addToCartMultiple } = useCart();
  const [loading, setLoading] = useState(false);

  const handleReorder = async (e) => {
    e.stopPropagation(); // Prevent card click
    setLoading(true);
    try {
      if (order?.items?.length > 0) {
        addToCartMultiple(order.items);
      }
      const res = await reorder(token, orderId);
      if (res.success) {
        toast.success(`Items added to your cart!`);
        if (res.warnings && res.warnings.length > 0) {
          res.warnings.forEach(w => toast(w, { icon: '⚠️', duration: 4000 }));
        }
        if (onComplete) onComplete();
        navigate('/cart');
      } else {
        toast.error('Reorder failed: No items could be added.');
      }
    } catch (err) {
      toast.error(err.message || 'Could not reorder items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReorder}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-semibold active:scale-[0.98] transition-all"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <ShoppingBag size={13} />
      )}
      <span>{loading ? 'Reordering...' : 'Reorder'}</span>
    </button>
  );
};

export default ReorderButton;
