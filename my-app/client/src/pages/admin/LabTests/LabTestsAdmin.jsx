import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Clock, 
  Droplet, 
  Save, 
  X,
  SlidersHorizontal,
  Search,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getLabTests, addLabTest, updateLabTest, deleteLabTest } from '../../../api/labTests';
import toast from 'react-hot-toast';

const LabTestsAdmin = () => {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Full Body Checkup',
    price: '',
    discountedPrice: '',
    sampleType: 'Blood',
    turnaroundHours: 24,
    prepInstructions: '',
    parameters: ''
  });

  const categories = ['Full Body Checkup', 'Thyroid', 'Diabetes', 'Heart Health', 'Liver Care', 'Kidney Function', 'Vitamins'];
  const sampleTypes = ['Blood', 'Urine', 'Swab', 'Stool'];

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await getLabTests({ all: true }); // Fetch all (including inactive if backend supports)
      setTests(data);
    } catch (err) {
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleEditClick = (test) => {
    setEditId(test._id);
    setFormData({
      name: test.name,
      description: test.description || '',
      category: test.category,
      price: test.price,
      discountedPrice: test.discountedPrice || '',
      sampleType: test.sampleType,
      turnaroundHours: test.turnaroundHours,
      prepInstructions: test.prepInstructions || '',
      parameters: test.parameters ? test.parameters.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Full Body Checkup',
      price: '',
      discountedPrice: '',
      sampleType: 'Blood',
      turnaroundHours: 24,
      prepInstructions: '',
      parameters: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test package?')) return;
    try {
      await deleteLabTest(token, id);
      toast.success('Test package removed');
      fetchTests();
    } catch (err) {
      toast.error('Failed to delete test package');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      return toast.error('Please fill in all required fields');
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
      turnaroundHours: Number(formData.turnaroundHours),
      parameters: formData.parameters.split(',').map(p => p.trim()).filter(Boolean)
    };

    try {
      if (editId) {
        await updateLabTest(token, editId, payload);
        toast.success('Test package updated successfully');
      } else {
        await addLabTest(token, payload);
        toast.success('Test package created successfully');
      }
      setIsModalOpen(false);
      fetchTests();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Lab Test Catalog Manager</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage diagnostic profiles and packages pricing</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-[#065F60] hover:bg-[#054E4F] text-xs font-bold text-white transition-all shadow-md cursor-pointer self-start"
        >
          <Plus size={14} />
          <span>Add Test Package</span>
        </button>
      </div>

      {/* Search Filter Row */}
      <div className="flex items-center gap-4 bg-white border border-slate-200/50 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search test profiles by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:bg-white border border-transparent focus:border-slate-200 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-[#00a2a4] w-8 h-8" />
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                <th className="p-4">Test Profile</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sample Required</th>
                <th className="p-4">Parameters</th>
                <th className="p-4">Pricing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredTests.map((test) => (
                <tr key={test._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-800 block">{test.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{test.turnaroundHours} Hours Turnaround</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-650 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {test.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5">
                      <Droplet size={12} className="text-red-500" />
                      {test.sampleType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-450">{test.parameters ? test.parameters.length : 0} Biomarkers</span>
                  </td>
                  <td className="p-4">
                    {test.discountedPrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900">₹{test.discountedPrice}</span>
                        <span className="text-slate-400 line-through text-[10px]">₹{test.price}</span>
                      </div>
                    ) : (
                      <span>₹{test.price}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEditClick(test)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDelete(test._id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200/50 rounded-2xl">
          <Sparkles className="mx-auto w-8 h-8 text-slate-300 mb-3" />
          <p className="text-xs font-bold text-slate-500">No test packages registered</p>
        </div>
      )}

      {/* Edit/Create Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleIn">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
              {editId ? 'Modify Test Package' : 'Register New Test Package'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Package Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sample Type *</label>
                  <select
                    value={formData.sampleType}
                    onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  >
                    {sampleTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">MRP Price (₹) *</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Promo Price (₹)</label>
                  <input 
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Hours Turnaround</label>
                  <input 
                    type="number"
                    value={formData.turnaroundHours}
                    onChange={(e) => setFormData({...formData, turnaroundHours: e.target.value})}
                    className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Prep Instructions</label>
                <input 
                  type="text"
                  placeholder="e.g. Fasting required for 8-10 hours"
                  value={formData.prepInstructions}
                  onChange={(e) => setFormData({...formData, prepInstructions: e.target.value})}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Key Biomarkers (Comma Separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Hemoglobin, WBC, RBC, Platelets"
                  value={formData.parameters}
                  onChange={(e) => setFormData({...formData, parameters: e.target.value})}
                  className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#00a2a4] focus:bg-white transition-all text-slate-700"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Save Package</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTestsAdmin;
