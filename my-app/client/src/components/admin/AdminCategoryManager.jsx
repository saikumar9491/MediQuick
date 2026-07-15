import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategoryManager = ({ token, API_BASE }) => {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', path: '', subOptions: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', path: '', subOptions: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.name || !newCategory.path) {
      toast.error('Name and Path are required');
      return;
    }

    const payload = {
      ...newCategory,
      subOptions: newCategory.subOptions.split(',').map(s => s.trim()).filter(s => s),
    };

    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Category Added');
        setIsAdding(false);
        setNewCategory({ name: '', path: '', subOptions: '' });
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Category Removed');
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleUpdate = async (id) => {
    const payload = {
      ...editData,
      subOptions: editData.subOptions.split(',').map(s => s.trim()).filter(s => s),
    };

    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Category Updated');
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Navigation Categories</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-[#10b981] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Hair Care"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Path / Link</label>
              <input
                type="text"
                placeholder="e.g. /medicines?filter=hair-care"
                value={newCategory.path}
                onChange={(e) => setNewCategory({ ...newCategory, path: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sub-Options (Comma separated)</label>
              <textarea
                placeholder="Hair Oils, Shampoos, Conditioners..."
                value={newCategory.subOptions}
                onChange={(e) => setNewCategory({ ...newCategory, subOptions: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows="3"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            Create Category
          </button>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-sm hover:shadow-md transition-shadow">
            {editingId === cat._id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={editData.path}
                    onChange={(e) => setEditData({ ...editData, path: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <textarea
                    value={editData.subOptions}
                    onChange={(e) => setEditData({ ...editData, subOptions: e.target.value })}
                    className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    rows="2"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(cat._id)} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white"><Save size={14} /> Save</button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500"><X size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{cat.path}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-medium">
                    {cat.subOptions.length} Sub-options: {cat.subOptions.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(cat._id);
                      setEditData({ name: cat.name, path: cat.path, subOptions: cat.subOptions.join(', ') });
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-medium text-slate-400">No categories defined yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryManager;
