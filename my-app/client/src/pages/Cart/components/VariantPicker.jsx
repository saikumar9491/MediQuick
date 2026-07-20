import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

/**
 * VariantPicker — inline dropdown to switch variant (size/weight) on a cart item.
 * Shown as a small "Change" link next to the current variant label.
 * variants: [{ size, weight, price, countInStock }]
 */
const VariantPicker = ({ currentVariant, variants = [], onSelect, disabled }) => {
  const [open, setOpen] = useState(false);

  if (!variants || variants.length === 0) return null;

  const label = currentVariant
    ? [currentVariant.size, currentVariant.weight].filter(Boolean).join(' · ')
    : null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 transition-colors"
      >
        {label && <span className="font-medium">{label}</span>}
        <span className="text-blue-600 font-medium underline">Change</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 min-w-[160px]">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Select variant</span>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-600">
              <X size={12} />
            </button>
          </div>
          {variants.map((v, i) => {
            const vLabel = [v.size, v.weight].filter(Boolean).join(' · ');
            const oos = v.countInStock === 0;
            return (
              <button
                key={i}
                onClick={() => { onSelect(v); setOpen(false); }}
                disabled={oos}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${oos ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className="font-medium text-slate-700">{vLabel || `Option ${i + 1}`}</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">₹{v.price}</p>
                  {oos && <p className="text-[9px] text-red-500">Out of stock</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VariantPicker;
