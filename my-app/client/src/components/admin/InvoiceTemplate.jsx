import React from 'react';

const InvoiceTemplate = ({ order }) => {
  if (!order) return null;

  const itemPrice = order.items?.length ? (order.total / order.items.length).toFixed(2) : "0.00";

  return (
    <div
      id="printable-invoice"
      className="mx-auto max-w-[800px] border bg-white p-4 shadow-sm sm:p-6 md:p-8 lg:p-10 print:max-w-full print:border-0 print:p-0 print:shadow-none"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-6 border-b-2 border-gray-100 pb-6 sm:mb-8 sm:pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 sm:text-3xl">
            MediQuick<span className="text-green-500">+</span>
          </h1>

          <p className="mt-1 text-[10px] font-bold uppercase text-gray-400 sm:text-xs">
            Amritsar Central Hub
          </p>

          <p className="mt-3 text-[10px] leading-relaxed text-gray-500 sm:mt-4 sm:text-[11px]">
            Main Market, Ranjit Avenue
            <br />
            Amritsar, Punjab - 143001
            <br />
            GSTIN: 03AAAAA0000A1Z5
          </p>
        </div>

        <div className="text-left md:text-right">
          <h2 className="text-lg font-black uppercase italic text-gray-800 sm:text-xl">
            Tax Invoice
          </h2>

          <p className="mt-2 text-xs font-bold text-gray-400 sm:text-sm">
            Order ID: <span className="text-gray-800">{order.id}</span>
          </p>

          <p className="text-xs font-bold text-gray-400 sm:text-sm">
            Date: <span className="text-gray-800">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Billing Details */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:mb-8 sm:grid-cols-2 sm:gap-8 md:mb-10 md:gap-10">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Billed To:
          </p>
          <p className="text-sm font-bold text-gray-800 sm:text-base">{order.customer}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{order.location}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            Payment Status:
          </p>
          <p className="inline-block border border-green-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-green-600 sm:text-xs">
            PAID
          </p>
        </div>
      </div>

      {/* Item Table */}
      <div className="mb-6 overflow-x-auto sm:mb-8 md:mb-10">
        <table className="min-w-[560px] w-full">
          <thead>
            <tr className="border-b-2 border-gray-800 text-left">
              <th className="py-3 pr-3 text-[10px] font-black uppercase">Medicine Name</th>
              <th className="py-3 px-2 text-center text-[10px] font-black uppercase">Qty</th>
              <th className="py-3 px-2 text-right text-[10px] font-black uppercase">Price</th>
              <th className="py-3 pl-2 text-right text-[10px] font-black uppercase">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="py-4 pr-3 text-xs font-bold text-gray-800 sm:text-sm">{item}</td>
                <td className="py-4 px-2 text-center text-xs font-medium sm:text-sm">1</td>
                <td className="py-4 px-2 text-right text-xs font-medium sm:text-sm">₹{itemPrice}</td>
                <td className="py-4 pl-2 text-right text-xs font-black sm:text-sm">₹{itemPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-start sm:justify-end">
        <div className="w-full max-w-[260px] space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>

          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>GST (12%)</span>
            <span>Included</span>
          </div>

          <div className="flex justify-between border-t-2 border-gray-800 pt-2 text-base font-black text-gray-900 sm:text-lg">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 border-t border-dashed border-gray-200 pt-6 text-center sm:mt-14 md:mt-20 md:pt-8">
        <p className="text-[9px] font-bold uppercase tracking-widest italic text-gray-400 sm:text-[10px]">
          Thank you for choosing MediQuick+ Amritsar Hub
        </p>
        <p className="mt-1 text-[8px] text-gray-300">
          This is a computer generated invoice and does not require a signature.
        </p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;