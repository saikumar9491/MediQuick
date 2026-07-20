import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const CouponModal = ({ coupon, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discountType: coupon?.discountType || 'Percentage',
    discountValue: coupon?.discountValue || '',
    minOrderValue: coupon?.minOrderValue || 0,
    maxDiscountCap: coupon?.maxDiscountCap || '',
    usageLimit: coupon?.usageLimit || '',
    perCustomerLimit: coupon?.perCustomerLimit || 1,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().slice(0,16) : new Date().toISOString().slice(0,16),
    validTo: coupon?.validTo ? new Date(coupon.validTo).toISOString().slice(0,16) : '',
    applicableTo: coupon?.applicableTo || 'All',
    applicableCategoryIds: coupon?.applicableCategoryIds?.map(c => c._id || c) || [],
    newCustomersOnly: coupon?.newCustomersOnly || false,
    isActive: coupon ? coupon.isActive : true
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (catId) => {
    setFormData(prev => {
      const isSelected = prev.applicableCategoryIds.includes(catId);
      return {
        ...prev,
        applicableCategoryIds: isSelected 
          ? prev.applicableCategoryIds.filter(id => id !== catId)
          : [...prev.applicableCategoryIds, catId]
      };
    });
  };

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = 'MQ';
    for (let i = 0; i < 6; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.validTo || !formData.validFrom) {
      toast.error('Please fill required fields');
      return;
    }
    if (new Date(formData.validTo) <= new Date(formData.validFrom)) {
      toast.error('Valid To must be after Valid From');
      return;
    }
    if (formData.applicableTo === 'Categories' && formData.applicableCategoryIds.length === 0) {
      toast.error('Select at least one category');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = { ...formData };
      if (!payload.usageLimit) payload.usageLimit = null;
      if (payload.discountType === 'Flat') payload.maxDiscountCap = null;
      if (payload.applicableTo === 'All') payload.applicableCategoryIds = [];

      if (coupon && coupon._id) { // If it has _id, it's an edit. If not, it might be a duplicate being created as new.
        await axios.patch(`${API_BASE}/api/coupons/${coupon._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Coupon updated");
      } else {
        await axios.post(`${API_BASE}/api/coupons`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Coupon created");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-lg font-black text-slate-800">
            {(coupon && coupon._id) ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          
          {/* Section: Basic Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Basic Details</h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Coupon Code *</label>
              <div className="flex gap-2">
                <input 
                  type="text" name="code" required
                  value={formData.code} onChange={handleChange}
                  placeholder="e.g. SUMMER50"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="button" onClick={handleGenerateCode}
                  className="px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Generate Random Code
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Discount Type *</label>
                <select 
                  name="discountType" value={formData.discountType} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Discount Value *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {formData.discountType === 'Flat' ? '₹' : '%'}
                  </span>
                  <input 
                    type="number" name="discountValue" required min="1"
                    value={formData.discountValue} onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Min Order Value (₹) *</label>
                <input 
                  type="number" name="minOrderValue" min="0" required
                  value={formData.minOrderValue} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold text-slate-600 mb-1 ${formData.discountType === 'Flat' ? 'opacity-50' : ''}`}>Max Discount Cap (₹)</label>
                <input 
                  type="number" name="maxDiscountCap" min="1"
                  value={formData.maxDiscountCap} onChange={handleChange}
                  disabled={formData.discountType === 'Flat'}
                  placeholder={formData.discountType === 'Flat' ? "N/A for Flat discount" : "e.g. 500"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section: Constraints */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Rules & Constraints</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Total Usage Limit</label>
                <input 
                  type="number" name="usageLimit" min="1"
                  value={formData.usageLimit} onChange={handleChange}
                  placeholder="Leave blank for unlimited"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Per Customer Limit</label>
                <input 
                  type="number" name="perCustomerLimit" min="1"
                  value={formData.perCustomerLimit} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Valid From *</label>
                <input 
                  type="datetime-local" name="validFrom" required
                  value={formData.validFrom} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Valid To *</label>
                <input 
                  type="datetime-local" name="validTo" required
                  value={formData.validTo} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">Applicable To</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" name="applicableTo" value="All"
                    checked={formData.applicableTo === 'All'} onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  All Products
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" name="applicableTo" value="Categories"
                    checked={formData.applicableTo === 'Categories'} onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  Specific Categories
                </label>
              </div>

              {formData.applicableTo === 'Categories' && (
                <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-slate-50 grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-100 p-1.5 rounded">
                      <input 
                        type="checkbox" 
                        checked={formData.applicableCategoryIds.includes(cat._id)}
                        onChange={() => handleCategoryToggle(cat._id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      {cat.name}
                    </label>
                  ))}
                  {categories.length === 0 && <span className="text-xs text-slate-500 col-span-2">No categories found.</span>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" name="newCustomersOnly"
                  checked={formData.newCustomersOnly} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">New Customers Only</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" name="isActive"
                  checked={formData.isActive} onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">Coupon is Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Coupon
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
