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
