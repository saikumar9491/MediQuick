import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, logout, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Amritsar Hub, Punjab',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || 'Amritsar Hub, Punjab',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_BASE}/api/users/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
        alert('Medical Identity Updated ✅');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Update failed. Check Hub connection.');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#a855f7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-12 sm:pb-16 lg:pb-20 pt-24 sm:pt-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 sm:mb-12 lg:mb-16 gap-5 sm:gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              My <span className="text-[#a855f7]">Profile</span>
            </h1>
            <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[3px] sm:tracking-[6px] mt-3 sm:mt-4">
              MediQuick Digital Health ID • Secure Access
            </p>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`w-full md:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-widest transition-all shadow-xl active:scale-95 ${
              isEditing
                ? 'bg-[#22c55e] text-white shadow-green-100'
                : 'bg-[#a855f7] text-white shadow-purple-100 hover:rotate-1'
            }`}
          >
            {isEditing ? '✔ Save Records' : '✎ Edit Identity'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* AVATAR SECTION */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] p-6 sm:p-8 lg:p-12 text-center border border-gray-100 relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#a855f7]/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-[24px] sm:rounded-[30px] lg:rounded-[40px] mx-auto flex items-center justify-center text-4xl sm:text-5xl font-black text-[#a855f7] shadow-2xl border border-gray-50 mb-6 sm:mb-8 group-hover:scale-110 transition-transform">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>

                {isEditing ? (
                  <input
                    className="w-full bg-white border-2 border-[#a855f7] rounded-xl px-4 py-2.5 sm:py-3 text-center font-black uppercase italic tracking-tighter outline-none text-lg sm:text-xl text-gray-900"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase italic tracking-tighter break-words">
                    {formData.name || 'N/A'}
                  </h2>
                )}

                <p className="text-[#00dfc4] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-widest mt-3 italic">
                  Verified Pro Patient
                </p>
              </div>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] border-2 border-gray-50 p-6 sm:p-8 lg:p-12 shadow-sm relative">
              <h3 className="text-[#a855f7] font-black uppercase text-[10px] sm:text-xs tracking-[2px] sm:tracking-[4px] mb-8 sm:mb-10 lg:mb-12 flex items-center gap-3 sm:gap-4">
                <span className="w-8 sm:w-12 h-1 bg-[#a855f7] rounded-full"></span>
                Secure Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 sm:gap-y-10 gap-x-8 sm:gap-x-12">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold outline-none focus:ring-2 ring-purple-100"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-black text-gray-800 break-all">{formData.email}</p>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Phone Line
                  </label>
                  {isEditing ? (
                    <input
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold outline-none focus:ring-2 ring-purple-100"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-black text-gray-800 break-words">
                      +91 {formData.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK DASHBOARD LINKS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Orders', icon: '📦', path: '/my-orders' },
                { label: 'Saved', icon: '❤️', path: '/wishlist' },
                { label: 'Logout', icon: '🔌', action: handleLogout, color: 'text-red-500' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action || (() => navigate(item.path))}
                  className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-[22px] sm:rounded-[26px] lg:rounded-[30px] border border-transparent hover:border-gray-200 hover:bg-white transition-all text-center group min-h-[110px] sm:min-h-[125px]"
                >
                  <span className="text-2xl sm:text-3xl block mb-2 group-hover:scale-125 transition-transform">
                    {item.icon}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tight ${
                      item.color || 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;