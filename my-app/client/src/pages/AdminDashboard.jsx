import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import AddMedicineModal from '../components/admin/AddMedicineModal';



// Add this function inside AdminOrders component
const handlePrint = (order) => {
  const printContent = document.getElementById('printable-invoice');
  const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  WindowPrt.document.write(`
    <html>
      <head>
        <title>Print Invoice - ${order.id}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  WindowPrt.document.close();
};

const AdminDashboard = ({ medicines = [], user, setUser }) => {
  const [inventory, setInventory] = useState(medicines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Open modal for a new medicine
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open modal with existing data to edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this medicine from the Amritsar Hub inventory?")) {
      setInventory(inventory.filter(m => m.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing item
      setInventory(inventory.map(m => m.id === productData.id ? productData : m));
    } else {
      // Add new item with a temporary ID
      const newEntry = { ...productData, id: Date.now() };
      setInventory([...inventory, newEntry]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <Navbar user={user} setUser={setUser} medicines={inventory} />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic">Admin Control Center</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Amritsar Hub Management</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-black text-xs shadow-lg hover:bg-blue-700 transition-all"
          >
            + ADD NEW MEDICINE
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm border-l-4 border-blue-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Products</p>
            <p className="text-3xl font-black text-gray-800">{inventory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-sm border-l-4 border-green-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Orders</p>
            <p className="text-3xl font-black text-gray-800">12</p>
          </div>
          <div className="bg-white p-6 rounded-sm border-l-4 border-yellow-500 shadow-sm">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Revenue (MTD)</p>
            <p className="text-3xl font-black text-gray-800">₹42,500</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-black text-gray-400 uppercase">Product Details</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase">Category</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase">Brand</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase">Price</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map((med) => (
                <tr key={med.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={med.image} alt="" className="w-12 h-12 object-contain bg-white border p-1" />
                    <div>
                      <span className="font-bold text-gray-700 text-sm block">{med.name}</span>
                      {med.needsRx && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-black uppercase">Rx Required</span>}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-600 font-bold uppercase tracking-tight">{med.category}</td>
                  <td className="p-4 text-xs text-gray-400 font-black uppercase">{med.brand}</td>
                  <td className="p-4 text-sm font-black text-gray-900">₹{med.price}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-6">
                      <button 
                        onClick={() => handleEdit(med)}
                        className="text-blue-600 font-black text-[10px] uppercase hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(med.id)}
                        className="text-red-500 font-black text-[10px] uppercase hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Reusable Modal for Add/Edit */}
      <AddMedicineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleSaveProduct}
        initialData={editingProduct} 
      />
    </div>
  );
};

export default AdminDashboard;