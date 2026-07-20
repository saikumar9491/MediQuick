import React, { useState } from 'react';
import { ShieldCheck, Loader2, KeyRound, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { changePassword, deleteAccount } from '../../../api/profile';
import { useAuth } from '../../../context/AuthContext';

const SecurityTab = ({ token }) => {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Current password is required');
    if (!newPassword) return toast.error('New password is required');
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setSaving(true);
    try {
      await changePassword(token, { currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await deleteAccount(token);
      toast.success('Account successfully deleted.');
      logout();
    } catch (_) {
      toast.error('Could not delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Change Password</h2>
            <p className="text-xs text-slate-400">Keep your account secure by updating your password regularly.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs active:scale-[0.98] transition-all"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Card */}
      <div className="bg-red-50/20 rounded-2xl border border-red-150 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-red-100 pb-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Danger Zone</h2>
            <p className="text-xs text-slate-400">Permanently close and anonymize your user account.</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Closing your account is permanent. Your personal details, saved addresses, and active prescriptions will be removed. Past orders will be retained anonymized for legal and business tax records.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 rounded-xl text-xs font-semibold text-red-600 transition-colors"
            >
              Delete My Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Type <strong className="text-red-700">DELETE</strong> below to confirm account deletion. This action is irreversible.
            </p>
            <input
              type="text"
              placeholder="DELETE"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              className="w-full bg-white border border-red-200 focus:border-red-400 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;
