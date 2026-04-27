import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const AddBrandModal = ({ isOpen, onClose, onAdd, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    isFeatured: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Brand added to Hub!');
        onAdd(data);
        setFormData({ name: '', image: '', isFeatured: true });
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to add brand');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
        <h2 className="mb-6 text-lg font-black uppercase italic text-gray-800">Add Featured Brand</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Name</label>
            <input
              type="text"
              required
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Logo URL</label>
            <input
              type="url"
              required
              placeholder="https://..."
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-gray-100 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#2874f0] py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
            >
              Add Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrandModal;
