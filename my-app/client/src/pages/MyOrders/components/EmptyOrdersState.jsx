import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyOrdersState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <ShoppingBag size={28} />
      </div>
      <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
      <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        You haven't placed any orders yet. Explore our selection of premium medicines and healthcare products.
      </p>
      <button
        onClick={() => navigate('/medicines')}
        className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
      >
        Start Shopping <ArrowRight size={13} />
      </button>
    </div>
  );
};

export default EmptyOrdersState;
