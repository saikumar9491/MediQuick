import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import AddMedicineModal from '../components/admin/AddMedicineModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, token, setUser } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- 1. Fetch Inventory from DB ---
  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/medicines`);
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      toast.error("Failed to sync with Amritsar Hub inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- 2. Add / Edit Logic ---
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // --- 3. Save to Database ---
  const handleSaveProduct = async (productData) => {
    const isEdit = !!editingProduct;
    const url = isEdit 
      ? `${API_BASE}/api/medicines/${editingProduct._id}` 
      : `${API_BASE}/api/medicines`;
    
    const method = isEdit ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(productData)
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");
      return data;
    });

    toast.promise(savePromise, {
      loading: isEdit ? 'Updating Unit...' : 'Uploading to Hub...',
      success: isEdit ? 'Unit Updated!' : 'New Unit Added!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await savePromise;
      fetchInventory(); // Refresh list from DB
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- 4. Delete from Database ---
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this medicine from Amritsar Hub permanently?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Unit purged from inventory");
        setInventory(inventory.filter(m => m._id !== id));
      } else {
        toast.error("Delete failed. Check permissions.");
      }
    } catch (err) {
      toast.error("Hub connection error");
    }
  };

  if (loading) return <div className="p-20 text-center font-black italic uppercase">📡 Establishing Satellite Link...</div>;

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-20">
      <Navbar user={user} setUser={setUser} />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic leading-none">Admin Control Center</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[4px] mt-2">Inventory Management Protocol</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-[#2874f0] text-white px-8 py-4 rounded-sm font-black text-xs shadow-xl hover:bg-blue-700 transition-all active:scale-95 italic tracking-widest"
          >
            + REGISTER NEW MEDICINE
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm border-l-4 border-blue-500 shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Stock Units</p>
            <p className="text-3xl font-black text-gray-800 italic">{inventory.length}</p>
          </div>
          {/* Mock stats for visual - could be linked to orders later */}
          <div className="bg-white p-6 rounded-sm border-l-4 border-green-500 shadow-sm opacity-50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Hub Orders</p>
            <p className="text-3xl font-black text-gray-800 italic">12</p>
          </div>
          <div className="bg-white p-6 rounded-sm border-l-4 border-yellow-500 shadow-sm opacity-50">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">System Status</p>
            <p className="text-xl font-black text-green-600 italic">ONLINE</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Unit Details</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Classification</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Brand</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Valuation</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((med) => (
                <tr key={med._id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4 flex items-center gap-4">
                    <img src={med.image} alt="" className="w-12 h-12 object-contain bg-white border p-1 rounded-sm" />
                    <div>
                      <span className="font-black text-gray-800 text-sm block uppercase italic tracking-tighter">{med.name}</span>
                      {med.needsPrescription && <span className="text-[8px] bg-red-600 text-white px-1 font-black uppercase">Rx Protocol</span>}
                    </div>
                  </td>
                  <td className="p-4 text-[10px] text-gray-500 font-black uppercase italic">{med.category}</td>
                  <td className="p-4 text-[10px] text-gray-400 font-black uppercase">{med.brand}</td>
                  <td className="p-4 text-sm font-black text-blue-600">₹{med.price}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-8">
                      <button onClick={() => handleEdit(med)} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Edit</button>
                      <button onClick={() => handleDelete(med._id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Purge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

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