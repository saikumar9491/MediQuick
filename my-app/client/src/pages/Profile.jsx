import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for Profile Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Member",
    email: user?.email || "",
    phone: user?.phone || "98765-43210",
    address: "Amritsar Hub, Punjab"
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    // Place API logic here to save to MongoDB
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-10 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              My <span className="text-[#a855f7]">Profile</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[6px] mt-4">
              MediQuick Digital Health ID • Secure Access
            </p>
          </div>
          
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
              isEditing 
              ? 'bg-[#22c55e] text-white shadow-green-100' 
              : 'bg-[#a855f7] text-white shadow-purple-100 hover:rotate-2'
            }`}
          >
            {isEditing ? '✔ Save Records' : '✎ Edit Identity'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* AVATAR SECTION */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 rounded-[50px] p-12 text-center border border-gray-100 relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#a855f7]/10 rounded-full blur-3xl transition-colors duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-32 h-32 bg-white rounded-[40px] mx-auto flex items-center justify-center text-5xl font-black text-[#a855f7] shadow-2xl border border-gray-50 mb-8 group-hover:scale-110 transition-transform">
                  {formData.name.charAt(0)}
                </div>
                
                {isEditing ? (
                  <input 
                    className="w-full bg-white border-2 border-[#a855f7] rounded-xl px-4 py-2 text-center font-black uppercase italic tracking-tighter outline-none text-xl"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                ) : (
                  <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">{formData.name}</h2>
                )}
                
                <p className="text-[#00dfc4] text-[10px] font-black uppercase tracking-widest mt-3 italic">Verified Pro Patient</p>
              </div>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[50px] border-2 border-gray-50 p-12 shadow-sm relative">
              <h3 className="text-[#a855f7] font-black uppercase text-xs tracking-[4px] mb-12 flex items-center gap-4">
                 <span className="w-12 h-1 bg-[#a855f7] rounded-full"></span> Secure Data
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-purple-100"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-black text-gray-800">{formData.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Line</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-purple-100"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-black text-gray-800">+91 {formData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK DASHBOARD LINKS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Orders', icon: '📦', path: '/my-orders' },
                 { label: 'Saved', icon: '❤️', path: '/wishlist' },
                 { label: 'Logout', icon: '🔌', action: handleLogout, color: 'text-red-500' }
               ].map((item, i) => (
                 <button 
                  key={i}
                  onClick={item.action || (() => navigate(item.path))}
                  className="bg-gray-50 p-6 rounded-[30px] border border-transparent hover:border-gray-200 hover:bg-white transition-all text-center group"
                 >
                   <span className="text-2xl block mb-2 group-hover:scale-125 transition-transform">{item.icon}</span>
                   <span className={`text-[10px] font-black uppercase tracking-tighter ${item.color || 'text-gray-900'}`}>{item.label}</span>
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