import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2, Plus, Home, Briefcase, MoreHorizontal } from 'lucide-react';
import { getDeliveryEstimate } from '../../../api/checkout';
import { API_BASE } from '../../../utils/apiConfig';

const TYPE_ICONS = { Home: Home, Work: Briefcase, Other: MoreHorizontal };

const EMPTY_FORM = {
  name: '', phone: '', addressLine1: '', addressLine2: '',
  landmark: '', city: '', state: '', pincode: '', type: 'Home',
};

export const AddressSection = ({ user, token, selectedAddress, onAddressSelect, onServiceabilityChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [serviceability, setServiceability] = useState({}); // { [pincode]: { loading, result } }
  const [savingAddress, setSavingAddress] = useState(false);

  // Pre-fill name/phone from user
  useEffect(() => {
    setFormData(prev => ({ ...prev, name: user?.name || '', phone: user?.phone || '' }));
  }, [user]);

  // When selected address changes, check its pincode
  useEffect(() => {
    if (selectedAddress?.pincode) {
      checkPincode(selectedAddress.pincode);
    }
  }, [selectedAddress?.pincode]);

  const checkPincode = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;
    setServiceability(prev => ({ ...prev, [pincode]: { loading: true, result: null } }));
    const result = await getDeliveryEstimate(pincode);
    setServiceability(prev => ({ ...prev, [pincode]: { loading: false, result } }));
    onServiceabilityChange(result);
  };

  const handleFormPincodeChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: clean }));
    if (clean.length === 6) checkPincode(clean);
  };

  const handleSaveAddress = async () => {
    const required = ['name', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const missing = required.filter(f => !formData[f]?.trim());
    if (missing.length) return;

    setSavingAddress(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/address/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        const addrs = updatedUser.addresses || updatedUser;
        const newAddr = Array.isArray(addrs) ? addrs[addrs.length - 1] : addrs;
        if (newAddr) {
          onAddressSelect(newAddr);
          checkPincode(newAddr.pincode);
        }
        setShowForm(false);
        setFormData(EMPTY_FORM);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingAddress(false);
    }
  };

  const addresses = user?.addresses || [];
  const formPincodeStatus = serviceability[formData.pincode];

  return (
    <div className="space-y-4">
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((addr, idx) => {
            const Icon = TYPE_ICONS[addr.type] || Home;
            const pincodeStatus = serviceability[addr.pincode];
            const isSelected = selectedAddress && (
              selectedAddress._id === addr._id ||
              (selectedAddress.addressLine1 === addr.addressLine1 && selectedAddress.pincode === addr.pincode)
            );
            return (
              <div
                key={addr._id || idx}
                onClick={() => { onAddressSelect(addr); checkPincode(addr.pincode); }}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{addr.type}</span>
                      {addr.isDefault && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">Default</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-800">{addr.name || user?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}{addr.landmark ? ` (${addr.landmark})` : ''}
                    </p>
                    <p className="text-xs text-slate-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{addr.phone}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                    {isSelected && <div className="w-full h-full rounded-full flex items-center justify-center"><CheckCircle size={12} className="text-white" /></div>}
                  </div>
                </div>

                {/* Serviceability badge */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {pincodeStatus?.loading ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Loader2 size={12} className="animate-spin" /> Checking delivery...
                      </div>
                    ) : pincodeStatus?.result?.isServiceable ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <CheckCircle size={12} />
                        Delivery available · {pincodeStatus.result.deliveryDateString}
                        {pincodeStatus.result.hubName && <span className="text-slate-400 font-normal">· via {pincodeStatus.result.hubName}</span>}
                      </div>
                    ) : pincodeStatus?.result ? (
                      <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                        <XCircle size={12} /> We don't deliver to this pincode yet
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Address */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-xs font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
        >
          <Plus size={14} /> Add New Address
        </button>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">New Address</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'name', label: 'Full Name', span: 2 },
              { key: 'phone', label: 'Phone Number', type: 'tel' },
              { key: 'pincode', label: 'Pincode', type: 'tel', onChange: handleFormPincodeChange },
              { key: 'addressLine1', label: 'Address Line 1', span: 2, placeholder: 'House/Flat No, Building' },
              { key: 'addressLine2', label: 'Address Line 2 (optional)', span: 2, placeholder: 'Street, Colony' },
              { key: 'landmark', label: 'Landmark (optional)' },
              { key: 'city', label: 'City' },
              { key: 'state', label: 'State' },
            ].map(({ key, label, span, placeholder, type, onChange }) => (
              <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                <input
                  type={type || 'text'}
                  value={formData[key]}
                  placeholder={placeholder || label}
                  onChange={e => onChange ? onChange(e.target.value) : setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Pincode serviceability inline */}
          {formData.pincode.length === 6 && formPincodeStatus && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${
              formPincodeStatus.loading ? 'text-slate-400' :
              formPincodeStatus.result?.isServiceable ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {formPincodeStatus.loading ? <><Loader2 size={12} className="animate-spin" /> Checking...</> :
               formPincodeStatus.result?.isServiceable
                ? <><CheckCircle size={12} /> Delivery available — {formPincodeStatus.result.deliveryDateString}</>
                : <><XCircle size={12} /> Not serviceable</>}
            </div>
          )}

          {/* Address Type */}
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map(type => (
              <button
                key={type}
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                  formData.type === type ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >{type}</button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveAddress}
              disabled={savingAddress || !formData.name || !formData.addressLine1 || !formData.pincode || !formData.city}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {savingAddress ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Save & Use This Address'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
