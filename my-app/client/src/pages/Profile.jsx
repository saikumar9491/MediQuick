import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Wallet, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  Save, 
  X,
  Plus,
  History,
  Activity,
  Heart,
  Settings,
  Bell,
  Stethoscope,
  ClipboardList,
  Zap,
  Trash2,
  CheckCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../utils/apiConfig';
import { toast } from 'react-hot-toast';

const Minus = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Profile = () => {
  const { user, token, logout, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch User Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user && token) {
        try {
          const res = await fetch(`${API_BASE}/api/orders/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (Array.isArray(data)) {
            setOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user, token]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
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
        setUser({ ...user, ...updatedUser });
        setIsEditing(false);
        toast.success('Medical Identity Updated ✅');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Update failed. Check connection.');
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/address/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
      if (res.ok) {
        const updatedAddresses = await res.json();
        setUser({ ...user, addresses: updatedAddresses });
        toast.success('Address Added Successfully 📍');
      }
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/address/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedAddresses = await res.json();
        setUser({ ...user, addresses: updatedAddresses });
        toast.success('Address Removed');
      }
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  const handleChangePassword = async (passwords) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password Updated Successfully 🔐');
        return true;
      } else {
        toast.error(data.message || 'Failed to update password');
        return false;
      }
    } catch (err) {
      toast.error('Connection failed');
      return false;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#00a2a4] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Secure Health Profile...</p>
      </div>
    );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'identity', label: 'Medical ID', icon: ShieldCheck },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wallet', label: 'Health Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20 lg:pt-24 px-4 sm:px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-28">
            <div className="flex flex-col items-center mb-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl font-black text-[#00a2a4] border-2 border-slate-100 mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-teal-50">
                  {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : (user?.name?.charAt(0).toUpperCase() || '?')}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-xl shadow-lg border border-slate-100 text-[#00a2a4]">
                  <ShieldCheck size={16} fill="currentColor" fillOpacity={0.1} />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic text-center leading-tight">
                {user?.name || 'User Profile'}
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Verified Pro Member
              </p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? 'bg-[#00a2a4] text-white shadow-lg shadow-teal-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#00a2a4]'
                  }`}
                >
                  <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[12px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut size={18} strokeWidth={3} />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* MOBILE NAVIGATION TABS */}
        <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 mb-2 -mx-4 px-4 sticky top-16 bg-slate-50/80 backdrop-blur-xl py-4 z-40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id 
                ? 'bg-[#00a2a4] text-white shadow-xl shadow-teal-100 scale-95' 
                : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {activeTab === 'dashboard' && <DashboardSection user={user} navigate={navigate} orders={orders} ordersLoading={ordersLoading} />}
              {activeTab === 'identity' && (
                <IdentitySection 
                  isEditing={isEditing} 
                  setIsEditing={setIsEditing} 
                  formData={formData} 
                  setFormData={setFormData} 
                  handleSave={handleSave} 
                />
              )}
              {activeTab === 'addresses' && <AddressesSection addresses={user?.addresses || []} handleAddAddress={handleAddAddress} handleRemoveAddress={handleRemoveAddress} />}
              {activeTab === 'wallet' && <WalletSection />}
              {activeTab === 'settings' && <SettingsSection handleLogout={handleLogout} handleChangePassword={handleChangePassword} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const DashboardSection = ({ user, navigate, orders, ordersLoading }) => (
  <div className="space-y-8">
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          Welcome back, <span className="text-[#00a2a4]">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
          Your Health Hub is Synced & Secure
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
          Join <span className="text-[#00a2a4]">12k+</span> Active Members
        </p>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Total Orders', value: ordersLoading ? '...' : orders.length.toString(), icon: Package, color: 'teal', path: '/my-orders' },
        { label: 'Health Score', value: '850', icon: Activity, color: 'orange', path: '#' },
        { label: 'Wishlist', value: (user?.wishlist?.length || 0).toString().padStart(2, '0'), icon: Heart, color: 'pink', path: '/wishlist' },
      ].map((stat, i) => (
        <div 
          key={i} 
          onClick={() => navigate(stat.path)}
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
        >
          <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors ${
            stat.color === 'teal' ? 'bg-teal-50 text-teal-600' : 
            stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-pink-50 text-pink-600'
          }`}>
            <stat.icon size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
          <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Recent Orders Summary */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="text-[#00a2a4]" size={18} />
            Recent Activity
          </h3>
          <button onClick={() => navigate('/my-orders')} className="text-[10px] font-black text-[#00a2a4] uppercase tracking-widest hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {orders.length > 0 ? orders.slice(0, 3).map((order) => (
            <div key={order._id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer" onClick={() => navigate('/my-orders')}>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Package size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{order.status || 'Processing'} • ₹{order.totalAmount}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-[#00a2a4] transition-colors" />
            </div>
          )) : (
            <p className="text-center py-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No recent orders found</p>
          )}
        </div>
      </div>

      {/* Health Reminders */}
      <div className="bg-[#00a2a4] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-100">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8">
            <Bell size={18} />
            Medicine Reminders
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white text-[#00a2a4] flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-black uppercase italic">Multivitamin Pro</p>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Next dose: 08:30 PM</p>
              </div>
            </div>
            <button className="w-full bg-white text-[#00a2a4] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
              Add New Reminder +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IdentitySection = ({ isEditing, setIsEditing, formData, setFormData, handleSave }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Medical <span className="text-[#00a2a4]">Identity</span></h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Your encrypted health credentials</p>
      </div>
      <button
        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
          isEditing
            ? 'bg-[#22c55e] text-white shadow-green-100'
            : 'bg-white text-slate-900 border border-slate-100 hover:bg-slate-50'
        }`}
      >
        {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Identity</>}
      </button>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* ID Card Mockup */}
      <div className="xl:col-span-1">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group h-full min-h-[350px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00a2a4]/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <ShieldCheck size={18} fill="white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest italic">MediQuick+ ID</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Activity size={18} />
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-1 truncate">
                {formData.name || 'Anonymous Patient'}
              </h3>
              <p className="text-[9px] font-bold text-teal-400 uppercase tracking-[0.3em] mb-8">Premium Health Tier</p>
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Patient ID</p>
                  <p className="text-[11px] font-mono tracking-widest uppercase">MQ-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Verified Since</p>
                  <p className="text-[11px] font-black">MAY 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Full Name', key: 'name', type: 'text', icon: User },
              { label: 'Email Address', key: 'email', type: 'email', icon: Bell },
              { label: 'Phone Line', key: 'phone', type: 'tel', icon: Activity },
              { label: 'Location Hub', key: 'address', type: 'text', icon: MapPin },
            ].map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <field.icon size={12} className="text-[#00a2a4]" />
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type={field.type}
                    disabled={field.key === 'email'}
                    className={`w-full bg-slate-50 border-2 border-transparent focus:border-[#00a2a4] rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all text-slate-800 ${field.key === 'email' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  />
                ) : (
                  <div className="px-6 py-4 rounded-2xl bg-slate-50/50 border border-transparent">
                    <p className="text-sm font-black text-slate-800">{formData[field.key] || 'Not Set'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Summary */}
        <div className="bg-orange-50 rounded-[32px] p-6 border border-orange-100 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">2-Step Verification Active</p>
            <p className="text-[11px] text-orange-900/60 font-bold">Your account is protected by hardware-grade encryption.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AddressesSection = ({ addresses, handleAddAddress, handleRemoveAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ type: 'Home', address: '', phone: '', isDefault: false });

  const submitAdd = (e) => {
    e.preventDefault();
    if (!newAddr.address || !newAddr.phone) return toast.error('Fill required fields');
    handleAddAddress(newAddr);
    setShowAddForm(false);
    setNewAddr({ type: 'Home', address: '', phone: '', isDefault: false });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Saved <span className="text-[#ff6f61]">Addresses</span></h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Manage your delivery hubs</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#00a2a4] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-100 active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-[40px] border border-[#00a2a4] shadow-xl shadow-teal-50 overflow-hidden"
          >
            <form onSubmit={submitAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hub Type</label>
                <select 
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4]"
                  value={newAddr.type}
                  onChange={e => setNewAddr({...newAddr, type: e.target.value})}
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Hub</label>
                <input 
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4]"
                  placeholder="+91 XXXXX XXXXX"
                  value={newAddr.phone}
                  onChange={e => setNewAddr({...newAddr, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Physical Address</label>
                <textarea 
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4] min-h-[100px]"
                  placeholder="Street, Landmark, City, State, Pincode"
                  value={newAddr.address}
                  onChange={e => setNewAddr({...newAddr, address: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  className="w-5 h-5 accent-[#00a2a4]"
                  checked={newAddr.isDefault}
                  onChange={e => setNewAddr({...newAddr, isDefault: e.target.checked})}
                />
                <label htmlFor="isDefault" className="text-xs font-bold text-slate-600 uppercase tracking-widest">Set as Primary Location</label>
              </div>
              <div className="md:col-span-2 flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-[#00a2a4] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Confirm Location</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-8 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length > 0 ? addresses.map((addr) => (
          <div key={addr._id} className={`bg-white p-8 rounded-[40px] border transition-all relative group cursor-pointer ${
            addr.isDefault ? 'border-[#00a2a4] shadow-xl shadow-teal-50' : 'border-slate-100 hover:border-slate-200'
          }`}>
            {addr.isDefault && (
              <div className="absolute top-6 right-6 bg-teal-50 text-[#00a2a4] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <CheckCircle size={10} /> Primary
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${addr.isDefault ? 'bg-[#00a2a4] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-[#00a2a4] group-hover:text-white'}`}>
              <MapPin size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-2">{addr.type}</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">{addr.address}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase">{addr.phone}</p>
              <button 
                onClick={() => handleRemoveAddress(addr._id)}
                className="p-2 text-red-100 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="md:col-span-2 text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <MapPin size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No physical locations synced yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WalletSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Health <span className="text-[#00a2a4]">Wallet</span></h2>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Credits, rewards and transaction history</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-[#00a2a4] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Available Balance</p>
          <h3 className="text-5xl font-black italic tracking-tighter mb-10">₹0.00</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-white text-[#00a2a4] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              Top Up Wallet
            </button>
            <p className="text-[9px] text-center font-bold opacity-60 uppercase tracking-widest">Locked for Secure Transactions</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
          <History className="text-[#00a2a4]" size={18} />
          Transaction Hub
        </h3>
        <div className="space-y-4">
          <p className="text-center py-20 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">No transactions recorded</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsSection = ({ handleLogout, handleChangePassword }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password too short (min 6 chars)');
    
    const success = await handleChangePassword({ 
      oldPassword: passwords.oldPassword, 
      newPassword: passwords.newPassword 
    });
    
    if (success) {
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Account <span className="text-slate-500">Settings</span></h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Preferences and system configuration</p>
      </div>

      <AnimatePresence>
        {showPasswordForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-[40px] border border-[#00a2a4] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Key className="text-[#00a2a4]" size={18} />
                Secure Password Update
              </h3>
              <button onClick={() => setShowPasswordForm(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500"><X size={18} /></button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Old Hub Password</label>
                <input 
                  type={showOld ? 'text' : 'password'}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4]"
                  value={passwords.oldPassword}
                  onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                  required
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 bottom-4 text-slate-300">{showOld ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Secure Password</label>
                <input 
                  type={showNew ? 'text' : 'password'}
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4]"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 bottom-4 text-slate-300">{showNew ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm New Hub Password</label>
                <input 
                  type="password"
                  className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-[#00a2a4]"
                  value={passwords.confirmPassword}
                  onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#00a2a4] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-50 active:scale-95 transition-all">
                Finalize New Password
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-2">
        <button 
          onClick={() => setShowPasswordForm(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <Key size={18} />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-widest text-slate-600">Change Account Password</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900" />
        </button>

        {[
          { label: 'Security Center', icon: ShieldCheck, color: 'text-slate-600' },
          { label: 'Notification Preferences', icon: Bell, color: 'text-slate-600' },
          { label: 'Privacy & Data Protection', icon: Activity, color: 'text-slate-600' },
          { label: 'Connected Medical Devices', icon: Settings, color: 'text-slate-600' },
          { label: 'Deactivate Account Hub', icon: X, color: 'text-red-500' },
        ].map((item, i) => (
          <button 
            key={i} 
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${item.color}`}>
                <item.icon size={18} />
              </div>
              <span className={`text-[12px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900" />
          </button>
        ))}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-all group mt-6 border border-red-100 bg-red-50/20"
        >
          <div className="flex items-center gap-4 text-red-600">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut size={18} strokeWidth={3} />
            </div>
            <span className="text-[12px] font-black uppercase tracking-widest">Secure Logout</span>
          </div>
          <ChevronRight size={16} className="text-red-300 group-hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default Profile;