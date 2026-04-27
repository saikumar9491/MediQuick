import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../utils/apiConfig';

const EmailUserModal = ({ isOpen, onClose, user, token }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      if (res.ok) {
        toast.success(`Email dispatched to ${user.name}`);
        setFormData({ subject: '', message: '' });
        onClose();
      } else {
        toast.error('Failed to send email');
      }
    } catch (err) {
      toast.error('Hub dispatch error');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-black uppercase italic text-gray-800">Dispatch Email</h2>
          <p className="text-[10px] font-bold text-blue-600 uppercase">Recipient: {user.name} ({user.email})</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Subject Line</label>
            <input
              type="text"
              required
              className="mt-1 w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-blue-600 focus:outline-none"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Message Payload (HTML Supported)</label>
            <textarea
              required
              rows="6"
              className="mt-1 w-full border-2 border-gray-50 bg-gray-50 p-3 text-xs font-medium focus:border-blue-600 focus:bg-white focus:outline-none rounded-sm"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              disabled={sending}
              className="flex-1 rounded-md bg-[#2874f0] py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'DISPATCHING...' : 'SEND MESSAGE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailUserModal;
