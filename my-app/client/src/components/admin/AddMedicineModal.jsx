import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AddMedicineModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    category: 'Wellness',
    image: '',
    needsRx: false,
  });

  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: '',
        brand: '',
        category: 'Wellness',
        image: '',
        needsRx: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = initialData
      ? `${API_BASE}/api/medicines/${initialData._id}`
      : `${API_BASE}/api/medicines`;

    const method = initialData ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Hub sync failed');
      return data;
    });

    toast.promise(savePromise, {
      loading: initialData ? 'Updating Unit...' : 'Uploading to Hub...',
      success: initialData ? 'Unit Updated Successfully!' : 'New Unit Added to Hub!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await savePromise;
      onAdd(data);
      onClose();
    } catch (err) {
      console.error('Medicine Save Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]">
      <div className="w-full max-w-md sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-2xl animate-[modalPop_0.28s_ease-out]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="pr-3 text-sm sm:text-base font-black uppercase italic tracking-tight text-gray-800">
            {initialData ? 'Edit Unit Protocol' : 'Register New Inventory'}
          </h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-200 hover:text-gray-800"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-6 sm:py-6">
          <div className="space-y-1">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Medicine Name
            </label>
            <input
              type="text"
              value={formData.name}
              required
              className="w-full rounded-md border p-3 text-sm font-bold uppercase italic tracking-tight outline-none transition focus:border-blue-500"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-1/2 space-y-1">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                required
                className="w-full rounded-md border p-3 text-sm font-bold outline-none transition focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="w-full sm:w-1/2 space-y-1">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                required
                className="w-full rounded-md border p-3 text-sm font-bold uppercase tracking-tight outline-none transition focus:border-blue-500"
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Category Classification
            </label>
            <select
              className="w-full rounded-md border bg-white p-3 text-sm font-bold outline-none transition focus:border-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Wellness">Wellness</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Energy Drinks">Energy Drinks</option>
              <option value="Ayurveda">Ayurveda</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Cloud Image Link
            </label>
            <input
              type="text"
              value={formData.image}
              placeholder="https://..."
              className="w-full rounded-md border p-3 text-sm font-bold outline-none transition focus:border-blue-500"
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <label className="group flex cursor-pointer items-start gap-3 rounded-md border border-dashed bg-gray-50 p-3 transition-colors hover:bg-red-50">
            <input
              type="checkbox"
              checked={formData.needsRx}
              className="mt-0.5 h-4 w-4 shrink-0 accent-red-500"
              onChange={(e) => setFormData({ ...formData, needsRx: e.target.checked })}
            />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-500 transition-colors group-hover:text-red-600">
              Requires Rx Protocol (Amritsar Hub Safety)
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#fb641b] px-4 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase italic tracking-[2px] text-white shadow-lg transition-all hover:bg-[#f05a18] hover:shadow-xl active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading
              ? 'Establishing Hub Link...'
              : initialData
              ? 'Confirm Update'
              : 'Authorize New Entry'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(18px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddMedicineModal;