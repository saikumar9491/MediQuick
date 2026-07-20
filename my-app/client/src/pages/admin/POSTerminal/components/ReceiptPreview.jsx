import React from 'react';
import { Printer, CheckCircle, ArrowLeft } from 'lucide-react';

export const ReceiptPreview = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-in zoom-in-95 duration-300">
      
      {/* Success message (Not printed) */}
      <div className="text-center mb-8 print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Sale Completed Successfully</h2>
        <p className="text-slate-500 font-medium">Order ID: {order._id}</p>
      </div>

      {/* The Printable Receipt */}
      <div className="bg-white border border-slate-200 shadow-md p-8 w-full max-w-sm font-mono text-sm print:shadow-none print:border-none print:w-full print:max-w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase tracking-wider mb-1">MediQuick Pharmacy</h1>
          <p className="text-xs text-slate-500">123 Health Ave, Medical District</p>
          <p className="text-xs text-slate-500">Tel: +91 98765 43210</p>
          <div className="border-b border-dashed border-slate-300 my-4"></div>
          <p className="text-xs font-bold">TAX INVOICE / RECEIPT</p>
        </div>

        <div className="flex justify-between text-xs mb-1">
          <span>Date:</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span>Order No:</span>
          <span>{order._id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-xs mb-4">
          <span>Customer:</span>
          <span>{order.customerName || 'Walk-in Customer'}</span>
        </div>

        <div className="border-b border-dashed border-slate-300 mb-4"></div>

        {/* Items */}
        <div className="flex justify-between font-bold text-xs mb-2">
          <span className="w-1/2">Item</span>
          <span className="w-1/4 text-center">Qty</span>
          <span className="w-1/4 text-right">Amount</span>
        </div>

        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs mb-2">
            <span className="w-1/2 pr-2">{item.name}</span>
            <span className="w-1/4 text-center">{item.quantity}</span>
            <span className="w-1/4 text-right">₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-b border-dashed border-slate-300 my-4"></div>

        {/* Totals */}
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <div className="flex justify-between text-xs mt-2 text-slate-500">
          <span>Payment Method:</span>
          <span className="uppercase">{order.paymentMethod}</span>
        </div>

        <div className="text-center mt-8 text-xs text-slate-500">
          <p>Thank you for visiting MediQuick!</p>
          <p>Wishing you good health.</p>
        </div>
      </div>

      {/* Action Buttons (Not printed) */}
      <div className="flex gap-4 mt-8 print:hidden">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> New Sale
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Printer className="w-5 h-5" /> Print Receipt
        </button>
      </div>

    </div>
  );
};
