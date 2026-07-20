import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile } from '../../../api/profile';

const MyProfileTab = ({ profile, token, onProfileUpdate }) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [dob, setDob] = useState(profile?.dob ? new Date(profile.dob).toISOString().split('T')[0] : '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setDob(profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');
    if (!phone.trim()) return toast.error('Phone is required');

    setSaving(true);
    try {
      const updated = await updateProfile(token, { name, dob: dob || null, phone, email });
      toast.success('Profile updated successfully');
      onProfileUpdate(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">My Profile</h2>
          <p className="text-xs text-slate-400">Manage your personal account credentials and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <User size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Mail size={16} className="text-slate-400" />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Phone size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* DOB */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-medium">Date of Birth (Optional)</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-400">Used for age verification on restricted drug checkouts.</p>
        </div>

        {/* Save CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfileTab;
