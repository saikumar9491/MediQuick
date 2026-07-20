import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Home, Briefcase, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAddresses, addAddress, editAddress, deleteAddress } from '../../../api/profile';
import AddressForm from './AddressForm';

const TYPE_ICONS = { Home, Work: Briefcase, Other: MoreHorizontal };

const AddressesTab = ({ token }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await fetchAddresses(token);
      setAddresses(data);
    } catch (_) {
      toast.error('Failed to load saved addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [token]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      let updated;
      if (editingAddress) {
        updated = await editAddress(token, editingAddress._id, formData);
        toast.success('Address updated successfully');
      } else {
        updated = await addAddress(token, formData);
        toast.success('Address added successfully');
      }
      setAddresses(updated);
      setEditingAddress(null);
      setShowAddForm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const updated = await deleteAddress(token, addressId);
      toast.success('Address deleted');
      setAddresses(updated);
    } catch (err) {
      toast.error(err.message || 'Could not delete address');
    }
  };

  const handleSetDefault = async (address) => {
    if (address.isDefault) return;
    try {
      const updated = await editAddress(token, address._id, { ...address, isDefault: true });
      toast.success('Default address updated');
      setAddresses(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to update default address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Saved Addresses</h2>
            <p className="text-xs text-slate-400">Manage your saved home, work, and shipping addresses.</p>
          </div>
        </div>

        {!showAddForm && !editingAddress && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {showAddForm || editingAddress ? (
        <div className="max-w-xl">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <AddressForm
            initialData={editingAddress}
            onSave={handleSave}
            onCancel={() => { setEditingAddress(null); setShowAddForm(false); }}
            saving={saving}
          />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10">
          <MapPin className="mx-auto text-slate-300 mb-3" size={36} strokeWidth={1.5} />
          <p className="text-sm text-slate-500 font-medium">No saved addresses found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const Icon = TYPE_ICONS[addr.type] || MapPin;
            return (
              <div
                key={addr._id}
                className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  addr.isDefault
                    ? 'border-blue-600 bg-blue-50/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full">
                    <CheckCircle2 size={10} /> Default
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    <Icon size={12} className="text-slate-400" />
                    {addr.type}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{addr.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  </p>
                  <p className="text-xs text-slate-500">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  {addr.landmark && (
                    <p className="text-[10px] text-slate-400 mt-1 italic">Landmark: {addr.landmark}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{addr.phone}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100/60 mt-4 text-xs font-semibold text-slate-500">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-blue-600 hover:underline mr-auto"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => setEditingAddress(addr)}
                    className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors ml-auto"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
