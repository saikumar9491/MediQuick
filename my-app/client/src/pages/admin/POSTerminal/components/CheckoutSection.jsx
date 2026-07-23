import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, Banknote, Smartphone, Check, Loader2, User, UserPlus } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CheckoutSection = ({ 
  cartItems, 
  customer, 
  setCustomer, 
  paymentMethod, 
  setPaymentMethod, 
  discount, 
  setDiscount, 
  onComplete, 
  onClear,
  isProcessing
}) => {
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  const handleSearchUser = async () => {
    if (userSearchQuery.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsSearchingUser(true);
    try {
      const token = localStorage.getItem('userToken');
      // Using existing users endpoint with search
      const res = await axios.get(`${API_BASE}/api/users?search=${userSearchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = res.data.users || res.data;
      
      // Filter strictly by phone
      const matchedUser = users.find(u => u.phone === userSearchQuery);
      if (matchedUser) {
        setCustomer({ name: matchedUser.name, phone: matchedUser.phone, userId: matchedUser._id });
        toast.success(`Found existing customer: ${matchedUser.name}`);
        setUserSearchQuery('');
      } else {
        toast.error("No customer found with that number.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching for customer.");
    } finally {
      setIsSearchingUser(false);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 md:p-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      {/* Customer Selection */}
      <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3 w-3" /> Customer Info
          </label>
          {customer.userId ? (
            <button 
              onClick={() => setCustomer({ name: 'Walk-in Customer', phone: '', userId: null })}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          ) : null}
        </div>
        
        {customer.userId ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">{customer.name}</p>
              <p className="text-xs text-slate-500">{customer.phone}</p>
            </div>
            <div className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
              Linked Account
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by 10-digit Phone" 
                className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchUser()}
              />
              <button 
                onClick={handleSearchUser}
                disabled={isSearchingUser}
                className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-sm font-bold hover:bg-blue-100 disabled:opacity-50"
              >
                {isSearchingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <input 
                type="text" 
                placeholder="Name (Optional)" 
                className="bg-white border border-slate-200 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                value={customer.name === 'Walk-in Customer' ? '' : customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value || 'Walk-in Customer' })}
              />
              <input 
                type="text" 
                placeholder="Phone (Optional)" 
                className="bg-white border border-slate-200 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
          <span>Subtotal</span>
          <span className="text-slate-800">₹{subtotal}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
          <span>Discount (₹)</span>
          <input 
            type="number" 
            min="0"
            max={subtotal}
            className="w-24 text-right bg-slate-50 border border-slate-200 rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 text-slate-800"
            value={discount || ''}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-lg font-black text-slate-800">Total</span>
          <span className="text-2xl font-black text-blue-600">₹{total}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => setPaymentMethod('Cash')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
              paymentMethod === 'Cash' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
            }`}
          >
            <Banknote className="h-5 w-5" />
            <span className="text-xs font-bold">Cash</span>
          </button>
          
          <button 
            onClick={() => setPaymentMethod('UPI')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
              paymentMethod === 'UPI' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
            }`}
          >
            <Smartphone className="h-5 w-5" />
            <span className="text-xs font-bold">UPI</span>
          </button>

          <button 
            onClick={() => setPaymentMethod('Card')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
              paymentMethod === 'Card' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs font-bold">Card</span>
          </button>
        </div>
      </div>

      {/* Dynamic Payment Method Details */}
      {cartItems.length > 0 && paymentMethod === 'UPI' && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              UPI Static QR Code (Scan to Pay)
            </span>
            
            {/* Styled Animated QR Code Container */}
            <div className="relative w-40 h-40 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-3 shadow-inner overflow-hidden group">
              {/* Scan Line Animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-md shadow-emerald-400" 
                   style={{
                     animation: 'scanAnimation 2s infinite ease-in-out',
                     top: '0%'
                   }} />
              
              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Outer borders */}
                <path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Top-left position block */}
                <rect x="5" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
                {/* Top-right position block */}
                <rect x="15" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
                {/* Bottom-left position block */}
                <rect x="5" y="15" width="4" height="4" rx="0.5" fill="currentColor" />
                {/* Inside details */}
                <path d="M12 7v5h3M12 15h.01M16 12h2v3M9 12H7" strokeLinecap="round" />
                <rect x="15" y="15" width="2" height="2" rx="0.2" fill="currentColor" />
              </svg>
            </div>
            
            <p className="text-xs font-bold text-slate-700">₹{total} (Inclusive of Taxes)</p>
            <p className="text-[10px] text-slate-400">MediQuick Merchant ID: <span className="font-mono text-slate-500">mediquick@upi</span></p>
          </div>
          <div className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-2 font-bold flex items-center justify-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 animate-pulse" />
            Awaiting payment confirmation...
          </div>
          
          {/* Keyframe style injection inside component */}
          <style>{`
            @keyframes scanAnimation {
              0% { top: 5%; }
              50% { top: 95%; }
              100% { top: 5%; }
            }
          `}</style>
        </div>
      )}

      {cartItems.length > 0 && paymentMethod === 'Card' && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in fade-in duration-300">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
            Swipe or Enter Card Details
          </span>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="Name on Card"
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500 text-slate-800 font-bold"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Card Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-xs focus:ring-1 focus:ring-blue-500 text-slate-850 font-bold font-mono"
                />
                <CreditCard className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500 text-slate-850 font-bold font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">CVV</label>
                <input 
                  type="password" 
                  placeholder="•••"
                  maxLength="3"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500 text-slate-850 font-bold font-mono"
                />
              </div>
            </div>
          </div>
          
          <div className="text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
            🔒 POS Terminal PCI-DSS Compliant Connection
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button 
          onClick={onClear}
          disabled={cartItems.length === 0 || isProcessing}
          className="px-4 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50"
        >
          Clear
        </button>
        <button 
          onClick={onComplete}
          disabled={cartItems.length === 0 || !paymentMethod || isProcessing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:shadow-lg disabled:hover:translate-y-0 disabled:bg-blue-400 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
          ) : (
            <><Check className="h-6 w-6" /> Complete Sale (₹{total})</>
          )}
        </button>
      </div>

    </div>
  );
};
