import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyCartState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
          <ShoppingBag size={40} className="text-slate-300" strokeWidth={1.5} />
        </div>

        <h2 className="text-xl font-semibold text-slate-800">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Looks like you haven't added anything yet.<br />
          Browse our medicines and health products.
        </p>

        <button
          onClick={() => navigate('/medicines')}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Browse Medicines <ArrowRight size={15} />
        </button>

        {/* Quick links */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {[
            { label: 'Vitamins', path: '/medicines?category=Vitamins' },
            { label: 'Skin Care', path: '/medicines?category=Skin+Care' },
            { label: 'Offers', path: '/medicines?isFlashDeal=true' },
          ].map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCartState;
