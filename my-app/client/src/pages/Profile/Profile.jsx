import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, FileText, Star, Heart, Bell, Shield, LogOut, ChevronRight, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { fetchProfile } from '../../api/profile';

import MyProfileTab from './components/MyProfileTab';
import MyOrdersTab from './components/MyOrdersTab';
import AddressesTab from './components/AddressesTab';
import PrescriptionsTab from './components/PrescriptionsTab';
import ReviewsTab from './components/ReviewsTab';
import WishlistTab from './components/WishlistTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';
import SecurityTab from './components/SecurityTab';

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile(token);
        setProfile(data);
      } catch (_) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User, component: MyProfileTab },
    { id: 'orders', label: 'My Orders', icon: Package, component: MyOrdersTab },
    { id: 'addresses', label: 'Addresses', icon: MapPin, component: AddressesTab },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, component: PrescriptionsTab },
    { id: 'reviews', label: 'My Reviews', icon: Star, component: ReviewsTab },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, component: WishlistTab },
    { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationPreferencesTab },
    { id: 'security', label: 'Change Password', icon: Shield, component: SecurityTab }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);
  const ActiveComponent = currentTab?.component || MyProfileTab;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header mobile menu toggle */}
        <div className="md:hidden flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2">
            {currentTab && <currentTab.icon size={18} className="text-blue-600" />}
            <span className="text-sm font-semibold text-slate-800">{currentTab?.label}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Menu size={16} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* SIDEBAR NAVIGATION */}
          <aside className={`w-full md:w-60 flex-shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Portal</p>
              <h3 className="text-sm font-bold text-slate-800 mt-1 truncate">{profile?.name}</h3>
              <p className="text-[10px] text-slate-400 truncate">{profile?.email}</p>
            </div>

            <nav className="p-2 space-y-0.5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight size={12} className={`opacity-0 ${activeTab === tab.id ? 'opacity-40' : ''}`} />
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors pt-3 border-t border-slate-100"
              >
                <LogOut size={14} className="text-red-500" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* CONTENT PANEL */}
          <main className="flex-1 w-full min-w-0">
            <ActiveComponent
              profile={profile}
              token={token}
              onProfileUpdate={(updated) => setProfile(updated)}
            />
          </main>
        </div>

      </div>
    </div>
  );
};

export default Profile;
