import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AddMedicineModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: '', price: '', brand: '', category: 'Wellness', image: '', needsRx: false
  });
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Effect to pre-fill form if editing (initialData exists)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', price: '', brand: '', category: 'Wellness', image: '', needsRx: false });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Determine if we are adding (POST) or updating (PUT)
    const url = initialData 
      ? `${API_BASE}/api/medicines/${initialData._id}` 
      : `${API_BASE}/api/medicines`;
    
    const method = initialData ? 'PUT' : 'POST';

    const savePromise = fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(formData)
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Hub sync failed");
      return data;
    });

    toast.promise(savePromise, {
      loading: initialData ? 'Updating Unit...' : 'Uploading to Hub...',
      success: initialData ? 'Unit Updated Successfully!' : 'New Unit Added to Hub!',
      error: (err) => `❌ ${err.message}`,
    });

    try {
      const data = await savePromise;
      onAdd(data); // Trigger UI refresh in AdminDashboard
      onClose();   // Close modal
    } catch (err) {
      console.error("Medicine Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-sm shadow-2xl animate-fadeIn overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-black text-gray-800 uppercase italic tracking-tighter">
            {initialData ? 'Edit Unit Protocol' : 'Register New Inventory'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-2xl leading-none">×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Medicine Name</label>
            <input 
              type="text" value={formData.name} required 
              className="w-full border p-3 text-sm font-bold outline-none focus:border-blue-500 uppercase italic tracking-tighter" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Price (₹)</label>
              <input 
                type="number" value={formData.price} required 
                className="w-full border p-3 text-sm font-bold outline-none focus:border-blue-500" 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
              />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Brand</label>
              <input 
                type="text" value={formData.brand} required 
                className="w-full border p-3 text-sm font-bold outline-none focus:border-blue-500 uppercase tracking-tighter" 
                onChange={(e) => setFormData({...formData, brand: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Category Classification</label>
            <select 
              className="w-full border p-3 text-sm font-bold outline-none focus:border-blue-500 bg-white" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
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
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Cloud Image Link</label>
            <input 
              type="text" value={formData.image} placeholder="https://..." 
              className="w-full border p-3 text-sm font-bold outline-none focus:border-blue-500" 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
            />
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 border border-dashed hover:bg-red-50 transition-colors group">
            <input 
              type="checkbox" checked={formData.needsRx}
              className="w-4 h-4 accent-red-500" 
              onChange={(e) => setFormData({...formData, needsRx: e.target.checked})} 
            />
            <span className="text-[10px] font-black text-gray-500 group-hover:text-red-600 uppercase transition-colors tracking-widest">
              Requires Rx Protocol (Amritsar Hub Safety)
            </span>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#fb641b] text-white py-4 font-black uppercase text-sm shadow-lg hover:bg-[#f05a18] transition-all transform active:scale-95 disabled:bg-gray-400 tracking-[2px] italic"
          >
            {loading ? "Establishing Hub Link..." : (initialData ? 'Confirm Update' : 'Authorize New Entry')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;