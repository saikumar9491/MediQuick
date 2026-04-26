import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

  /**
   * --- HUB PROTOCOL: Fetch Inventory ---
   * Wrapped in useCallback to prevent unnecessary re-renders
   */
  const fetchInventory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/medicines`);
      if (!response.ok) throw new Error("Could not reach Hub");
      const data = await response.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync with Amritsar Hub inventory');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /**
   * --- OPERATION: Save/Update Unit ---
   */
  const handleSaveProduct = async (productData) => {
    const isEdit = !!editingProduct;
    const url = isEdit
      ? `${API_BASE}/api/medicines/${editingProduct._id}`
      : `${API_BASE}/api/medicines`;

    const method = isEdit ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      return data;
    });

    toast.promise(savePromise, {
      loading: isEdit ? 'Updating Unit...' : 'Uploading to Hub...',
      success: isEdit ? 'Unit Updated!' : 'New Unit Added!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      await savePromise;
      fetchInventory(); // Refresh list after save
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  /**
   * --- OPERATION: Purge Unit ---
   */
  const handleDelete = async (id) => {
    // Permanent purge confirmation
    if (!window.confirm('Remove this medicine from Amritsar Hub permanently?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Unit purged from inventory');
        // Filter locally for immediate UI feedback
        setInventory((prev) => prev.filter((m) => m._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Purge failed. Check permissions.');
      }
    } catch (err) {
      toast.error('Hub connection error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#2874f0]"></div>
          <p className="text-sm font-black uppercase italic tracking-wide text-gray-700">
            Establishing Satellite Link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-16 sm:pb-20">
      <main className="mx-auto max-w-[1400px] px-4 pt-24 py-6 sm:px-6 sm:py-8 sm:pt-28">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase italic leading-tight text-gray-800">
              Admin Control Center
            </h1>
            <p className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[3px] sm:tracking-[4px] text-gray-400">
              Inventory Management Protocol
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admin/flash-deals"
              className="w-full rounded-md bg-orange-500 px-5 py-3 text-[10px] sm:w-auto sm:px-8 sm:py-4 sm:text-xs font-black italic tracking-[2px] sm:tracking-widest text-white shadow-xl transition-all hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>⚡</span> FLASH DEALS MANAGER
            </Link>
            <button
              onClick={handleAddNew}
              className="w-full rounded-md bg-[#2874f0] px-5 py-3 text-[10px] sm:w-auto sm:px-8 sm:py-4 sm:text-xs font-black italic tracking-[2px] sm:tracking-widest text-white shadow-xl transition-all hover:bg-blue-700 active:scale-95"
            >
              + REGISTER NEW MEDICINE
            </button>
          </div>
        </div>

        {/* System Stats Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 md:grid-cols-3 md:gap-6">
          <div className="rounded-md border-l-4 border-blue-500 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Active Stock Units
            </p>
            <p className="text-2xl sm:text-3xl font-black italic text-gray-800">
              {inventory.length}
            </p>
          </div>

          <div className="rounded-md border-l-4 border-green-500 bg-white p-5 shadow-sm opacity-70 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Live Hub Orders
            </p>
            <p className="text-2xl sm:text-3xl font-black italic text-gray-800">12</p>
          </div>

          <div className="rounded-md border-l-4 border-yellow-500 bg-white p-5 shadow-sm opacity-70 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              System Status
            </p>
            <p className="text-lg sm:text-xl font-black italic text-green-600">ONLINE</p>
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Unit Details</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Classification</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Brand</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest">Valuation</th>
                  <th className="p-4 text-center text-[10px] font-black uppercase tracking-widest">Operations</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700">
                {inventory.map((med) => (
                  <tr key={med._id} className="group transition-colors hover:bg-blue-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={med.image || 'https://placehold.co/100x100?text=Medicine'}
                          alt={med.name}
                          className="h-12 w-12 rounded-sm border bg-white p-1 object-contain"
                        />
                        <div>
                          <span className="block text-xs sm:text-sm font-black uppercase italic tracking-tight text-gray-800">
                            {med.name}
                          </span>
                          {med.needsPrescription && (
                            <span className="mt-1 inline-block bg-red-600 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                              Rx Protocol
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[10px] font-black uppercase italic text-gray-500">
                      {med.category}
                    </td>

                    <td className="p-4 text-[10px] font-black uppercase text-gray-400">
                      {med.brand}
                    </td>

                    <td className="p-4">
                      {med.isFlashDeal ? (
                        <div className="flex flex-col">
                          <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-black uppercase text-blue-600">
                            ⚡ Flash Deal
                          </span>
                          <span className="mt-1 text-[9px] font-bold text-blue-400">₹{med.discountPrice}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300">Standard</span>
                      )}
                    </td>

                    <td className="p-4 text-sm font-black text-blue-600">
                      ₹{med.price}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-4 sm:gap-8">
                        <button
                          onClick={() => handleEdit(med)}
                          className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="text-[10px] font-black uppercase text-red-500 hover:underline"
                        >
                          Purge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {inventory.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-10 text-center text-xs font-black uppercase tracking-[2px] text-gray-400"
                    >
                      No inventory units found in Hub
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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