import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const AddBannerModal = ({ isOpen, onClose, onAdd, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Banner uploaded!');
        onAdd(data);
        setFormData({ title: '', image: '', link: '' });
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to upload banner');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
        <h2 className="mb-6 text-lg font-black uppercase italic text-gray-800">Upload New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Banner Title</label>
            <input
              type="text"
              required
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Image URL</label>
            <input
              type="url"
              required
              placeholder="https://..."
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Target Link (Optional)</label>
            <input
              type="text"
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
              className="flex-1 rounded-md bg-blue-600 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
            >
              Deploy Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerModal;
