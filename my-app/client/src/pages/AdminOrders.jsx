import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';

const AdminOrders = ({ medicines = [], user, setUser }) => {
  // Mock data for incoming orders
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
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <Navbar user={user} setUser={setUser} medicines={medicines} />
      
      <main className="max-w-[1400px] mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 uppercase italic">Order Fulfillment</h1>
          <div className="flex gap-2">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {orders.filter(o => o.status === 'Pending').length} New
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-black text-blue-600 text-sm">{order.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800 text-sm">{order.customer}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{order.location}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                      {order.items.join(", ")}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    {order.hasPrescription ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-[10px] font-black uppercase">Verified</span>
                    ) : (
                      <span className="text-gray-300 text-[10px] font-black uppercase">N/A</span>
                    )}
                  </td>
                  <td className="p-4 font-black text-gray-900">₹{order.total}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      className="text-[10px] font-black uppercase border p-1 rounded-sm outline-none bg-white cursor-pointer"
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
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;