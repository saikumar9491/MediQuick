import React from 'react';

const InvoiceTemplate = ({ order }) => {
  if (!order) return null;

  return (
    <div className="bg-white p-10 max-w-[800px] mx-auto border shadow-sm print:shadow-none print:border-0" id="printable-invoice">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter">MediQuick<span className="text-green-500">+</span></h1>
          <p className="text-xs font-bold text-gray-400 uppercase mt-1">Amritsar Central Hub</p>
          <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
            Main Market, Ranjit Avenue<br />
            Amritsar, Punjab - 143001<br />
            GSTIN: 03AAAAA0000A1Z5
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black uppercase italic text-gray-800">Tax Invoice</h2>
          <p className="text-sm font-bold text-gray-400 mt-2">Order ID: <span className="text-gray-800">{order.id}</span></p>
          <p className="text-sm font-bold text-gray-400">Date: <span className="text-gray-800">{new Date().toLocaleDateString()}</span></p>
        </div>
      </div>

      {/* Billing Details */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To:</p>
          <p className="font-bold text-gray-800">{order.customer}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{order.location}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Status:</p>
          <p className="font-bold text-green-600 uppercase text-xs tracking-widest border border-green-600 inline-block px-2 py-1">PAID</p>
        </div>
      </div>

      {/* Item Table */}
      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left">
            <th className="py-3 text-[10px] font-black uppercase">Medicine Name</th>
            <th className="py-3 text-[10px] font-black uppercase text-center">Qty</th>
            <th className="py-3 text-[10px] font-black uppercase text-right">Price</th>
            <th className="py-3 text-[10px] font-black uppercase text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <tr key={index}>
              <td className="py-4 text-sm font-bold text-gray-800">{item}</td>
              <td className="py-4 text-sm text-center font-medium">1</td>
              <td className="py-4 text-sm text-right font-medium">₹{(order.total / order.items.length).toFixed(2)}</td>
              <td className="py-4 text-sm text-right font-black">₹{(order.total / order.items.length).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>GST (12%)</span>
            <span>Included</span>
          </div>
          <div className="flex justify-between text-lg font-black text-gray-900 border-t-2 border-gray-800 pt-2">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-dashed border-gray-200 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Thank you for choosing MediQuick+ Amritsar Hub</p>
        <p className="text-[8px] text-gray-300 mt-1">This is a computer generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;