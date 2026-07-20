import React from 'react';
import { Wallet, CreditCard, AlertCircle } from 'lucide-react';

const COD_ICON = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

export const PaymentMethodSection = ({ selected, onChange, razorpayAvailable }) => {
  const methods = [
    {
      id: 'cod',
      label: 'Cash on Delivery',
      sub: 'Pay when your order arrives',
      icon: <Wallet size={20} />,
      available: true,
    },
    {
      id: 'razorpay',
      label: 'Pay Online',
      sub: razorpayAvailable ? 'UPI · Cards · Net Banking' : 'Configure Razorpay to enable',
      icon: <CreditCard size={20} />,
      available: razorpayAvailable,
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map(method => (
        <div
          key={method.id}
          onClick={() => method.available && onChange(method.id)}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            !method.available
              ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
              : selected === method.id
              ? 'border-blue-500 bg-blue-50/40 cursor-pointer'
              : 'border-slate-200 bg-white cursor-pointer hover:border-slate-300'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${selected === method.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            {method.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{method.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{method.sub}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
            selected === method.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
          }`}>
            {selected === method.id && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
          </div>
        </div>
      ))}

      {!razorpayAvailable && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <AlertCircle size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500">
            Online payment requires <span className="font-medium">RAZORPAY_KEY_ID</span> and <span className="font-medium">RAZORPAY_KEY_SECRET</span> in your server <code>.env</code> file.
          </p>
        </div>
      )}
    </div>
  );
};
