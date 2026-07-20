import React, { useState } from 'react';
import { Home, Briefcase, MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressForm = ({ initialData, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'Home',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    isDefault: !!initialData?.isDefault
  });

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Full Name is required');
    if (!formData.phone.trim()) return toast.error('Phone number is required');
    if (!formData.addressLine1.trim()) return toast.error('Address Line 1 is required');
    if (!formData.city.trim()) return toast.error('City is required');
    if (!formData.state.trim()) return toast.error('State is required');
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      return toast.error('A valid 6-digit Pincode is required');
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type buttons */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address Type</label>
        <div className="flex gap-2">
          {[
            { label: 'Home', icon: Home },
            { label: 'Work', icon: Briefcase },
            { label: 'Other', icon: MoreHorizontal }
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleChange('type', label)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                formData.type === label
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
          <input
            type="text"
            placeholder="10-digit number"
            value={formData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Address line 1 */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flat, House no., Building, Company</label>
        <input
          type="text"
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={e => handleChange('addressLine1', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
        />
      </div>

      {/* Address line 2 */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area, Street, Sector, Village</label>
        <input
          type="text"
          placeholder="Address Line 2 (Optional)"
          value={formData.addressLine2}
          onChange={e => handleChange('addressLine2', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Landmark */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Landmark</label>
          <input
            type="text"
            placeholder="e.g. Near Apollo Hospital"
            value={formData.landmark}
            onChange={e => handleChange('landmark', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">6-Digit Pincode</label>
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit number"
            value={formData.pincode}
            onChange={e => handleChange('pincode', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* City */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</label>
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={e => handleChange('city', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        {/* State */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State</label>
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={e => handleChange('state', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={e => handleChange('isDefault', e.target.checked)}
          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
        />
        <label htmlFor="isDefault" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
          Set as Default Delivery Address
        </label>
      </div>

      {/* Form CTAs */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
