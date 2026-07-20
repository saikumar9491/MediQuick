import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';

export const CartPanel = ({ cartItems, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center z-10">
        <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          Current Sale
        </h3>
        <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
            <p className="font-bold text-sm">Cart is empty</p>
            <p className="text-xs mt-1">Search or click products to add</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cartItems.map(item => (
              <div key={item.productId} className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm hover:border-blue-300 transition-colors">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-slate-100 hidden sm:block" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-black text-blue-600 text-sm">₹{item.price}</span>
                    {item.quantity >= item.countInStock && (
                      <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <AlertCircle className="h-2.5 w-2.5" /> Max stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end mt-2 sm:mt-0">
                  {/* Stepper */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm select-none">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.countInStock}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 text-right font-black text-slate-800">
                      ₹{item.price * item.quantity}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
