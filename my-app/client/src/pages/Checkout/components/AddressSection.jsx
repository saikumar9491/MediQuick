import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, XCircle, Loader2, Plus, Home, Briefcase, MoreHorizontal, AlertCircle } from 'lucide-react';
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
  const [lookupLoading, setLookupLoading] = useState(false);

  // Pre-fill name/phone from user (safely cleaning "N/A" phone strings)
  useEffect(() => {
    const rawPhone = user?.phone && user.phone !== 'N/A' ? user.phone.replace(/\D/g, '') : '';
    setFormData(prev => ({ 
      ...prev, 
      name: user?.name || '', 
      phone: rawPhone 
    }));
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
    if (typeof onServiceabilityChange === 'function') {
      onServiceabilityChange(result);
    }
  };

  const handleFormPincodeChange = async (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: clean }));

    if (clean.length === 6) {
      // Check hub delivery serviceability
      checkPincode(clean);

      // Auto-fetch State, City & Landmark from India Postal API
      setLookupLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            state: po.State || prev.state,
            city: po.District || po.Block || po.Name || prev.city,
            landmark: prev.landmark ? prev.landmark : (po.Name || ''),
          }));
        }
      } catch (err) {
        console.error('Postal API lookup error:', err);
      } finally {
        setLookupLoading(false);
      }
    }
  };

  const handlePhoneChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: clean }));
  };

  // Phone Validation: 10 digits starting with 6-9
  const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone);
  const formPincodeStatus = serviceability[formData.pincode];
  const isServiceable = formPincodeStatus?.result?.isServiceable;

  const handleSaveAddress = async () => {
    if (!isPhoneValid) return;
    if (formData.pincode.length === 6 && formPincodeStatus?.result && !isServiceable) return;

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
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-xs font-medium text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer"
        >
          <Plus size={14} /> Add New Address
        </button>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">New Address</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                placeholder="Full Name"
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Phone Number with validation */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                placeholder="10-digit mobile number"
                onChange={e => handlePhoneChange(e.target.value)}
                maxLength={10}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none transition-colors ${
                  formData.phone && !isPhoneValid ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-400'
                }`}
              />
              {formData.phone && !isPhoneValid && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle size={10} /> Enter valid 10-digit mobile number (starts with 6-9)
                </p>
              )}
            </div>

            {/* Pincode with Auto-Lookup & Serviceability */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.pincode}
                  placeholder="6-digit Pincode"
                  onChange={e => handleFormPincodeChange(e.target.value)}
                  maxLength={6}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
                {lookupLoading && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Address Line 1</label>
              <input
                type="text"
                value={formData.addressLine1}
                placeholder="House/Flat No, Building"
                onChange={e => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Address Line 2 */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Address Line 2 (optional)</label>
              <input
                type="text"
                value={formData.addressLine2}
                placeholder="Street, Colony"
                onChange={e => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Landmark (optional) */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Landmark (optional)</label>
              <input
                type="text"
                value={formData.landmark}
                placeholder="Landmark (optional)"
                onChange={e => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* City (Auto-filled) */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                placeholder="City (Autofilled)"
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {/* State (Auto-filled) */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                placeholder="State (Autofilled)"
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Pincode Serviceability & Location Status Badge */}
          {formData.pincode.length === 6 && (
            <div className="p-3 rounded-lg border bg-white text-xs font-medium space-y-1">
              {(lookupLoading || formPincodeStatus?.loading) ? (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Loader2 size={13} className="animate-spin text-blue-600" />
                  <span>Fetching postal details & checking delivery serviceability...</span>
                </div>
              ) : formPincodeStatus?.result?.isServiceable ? (
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle size={14} className="shrink-0" />
                  <span>
                    Delivery Available to {formData.city || 'your area'}{formData.state ? `, ${formData.state}` : ''} · Expected {formPincodeStatus.result.deliveryDateString}
                  </span>
                </div>
              ) : formPincodeStatus?.result ? (
                <div className="flex items-center gap-1.5 text-red-500 font-semibold">
                  <XCircle size={14} className="shrink-0" />
                  <span>Delivery NOT available for pincode {formData.pincode}. Please enter a serviceable pincode.</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Address Type */}
          <div className="flex gap-2 pt-1">
            {['Home', 'Work', 'Other'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type }))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  formData.type === type ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >{type}</button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={
                savingAddress || 
                !formData.name || 
                !isPhoneValid || 
                !formData.addressLine1 || 
                formData.pincode.length !== 6 || 
                !formData.city || 
                !formData.state ||
                (formPincodeStatus?.result && !formPincodeStatus.result.isServiceable)
              }
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              {savingAddress ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Save & Use This Address'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
