import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';

const AdminOrders = ({ medicines = [], user, setUser }) => {
  const [orders, setOrders] = useState([
    {
      id: "ORD99821",
      customer: "Sanjeev Kumar",
      location: "Ranjit Avenue, Amritsar",
      total: 1250,
      status: "Pending",
      hasPrescription: true,
      items: ["Paracetamol 500mg", "Minoxidil Topical 5%"]
    },
    {
      id: "ORD99822",
      customer: "Anita Rani",
      location: "Golden Temple Area, Amritsar",
      total: 450,
      status: "Shipped",
      hasPrescription: false,
      items: ["Multivitamin Gold"]
    }
  ]);

  const updateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-10">
      <Navbar user={user} setUser={setUser} medicines={medicines} />

      <main className="mx-auto mt-6 max-w-[1400px] px-4 sm:mt-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-black uppercase italic text-gray-800">
            Order Fulfillment
          </h1>

          <div className="flex gap-2">
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-700">
              {orders.filter((o) => o.status === 'Pending').length} New
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer & Location</th>
                  <th className="p-4">Items</th>
                  <th className="p-4 text-center">Rx Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-gray-50/80"
                  >
                    <td className="p-4 text-sm font-black text-blue-600">
                      {order.id}
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-bold text-gray-800">
                        {order.customer}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        {order.location}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="max-w-[220px] truncate text-xs font-medium text-gray-600">
                        {order.items.join(", ")}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      {order.hasPrescription ? (
                        <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-black uppercase text-green-600">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-gray-300">
                          N/A
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-black text-gray-900">
                      ₹{order.total}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-sm px-2 py-1 text-[10px] font-black uppercase tracking-tighter ${
                          order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <select
                        className="cursor-pointer rounded-sm border bg-white p-2 text-[10px] font-black uppercase outline-none"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-xs font-black uppercase tracking-[2px] text-gray-400"
                    >
                      No orders available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;