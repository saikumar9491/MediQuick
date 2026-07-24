import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, MapPin, FileText, Star, Heart, Bell, Shield, LogOut, ChevronRight, Menu, Activity, Stethoscope, Crown } from 'lucide-react';
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
import MyLabBookingsTab from './components/MyLabBookingsTab';
import MyAppointmentsTab from './components/MyAppointmentsTab';
import MyCarePlanTab from './components/MyCarePlanTab';

const Profile = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
    { id: 'lab-bookings', label: 'Lab Bookings', icon: Activity, component: MyLabBookingsTab },
    { id: 'appointments', label: 'Doctor Consultations', icon: Stethoscope, component: MyAppointmentsTab },
    { id: 'care-plan', label: 'My Care Plan', icon: Crown, component: MyCarePlanTab },
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
        
        {/* MOBILE PROFILE HEADER (Full 11-Tab Navigation & Identity) */}
        <div className="block md:hidden bg-white border border-slate-200/80 rounded-3xl p-4 mb-5 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-full bg-[#0057FF] text-white flex items-center justify-center font-black text-base select-none shadow-xs shrink-0">
                {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-900 leading-tight truncate">
                  {profile?.name || 'User Profile'}
                </h2>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {profile?.email || profile?.addresses?.[0]?.city || 'MediQuick Member'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-[#EF4444] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shrink-0"
              title="Logout"
            >
              <LogOut size={12} />
              <span>Exit</span>
            </button>
          </div>

          {/* Horizontal Scrollable Tab Pills for ALL 11 Sections */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar pb-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold shrink-0 transition-all active:scale-95 ${
                    isSelected 
                      ? 'bg-[#0057FF] text-white shadow-2xs' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={12} className={isSelected ? 'text-white' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* SIDEBAR NAVIGATION (Desktop Only) */}
          <aside className="hidden md:block w-60 flex-shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
                    onClick={() => { setActiveTab(tab.id); }}
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
