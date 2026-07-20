import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateNotificationPreferences } from '../../../api/profile';

const NotificationPreferencesTab = ({ profile, token, onProfileUpdate }) => {
  const [preferences, setPreferences] = useState({
    orderUpdates: profile?.notificationPreferences?.orderUpdates ?? true,
    promotionalOffers: profile?.notificationPreferences?.promotionalOffers ?? true,
    prescriptionReminders: profile?.notificationPreferences?.prescriptionReminders ?? true,
    priceDropAlerts: profile?.notificationPreferences?.priceDropAlerts ?? true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.notificationPreferences) {
      setPreferences({
        orderUpdates: profile.notificationPreferences.orderUpdates ?? true,
        promotionalOffers: profile.notificationPreferences.promotionalOffers ?? true,
        prescriptionReminders: profile.notificationPreferences.prescriptionReminders ?? true,
        priceDropAlerts: profile.notificationPreferences.priceDropAlerts ?? true
      });
    }
  }, [profile]);

  const handleToggle = async (key) => {
    const nextPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(nextPrefs); // Optimistic UI update

    try {
      const updated = await updateNotificationPreferences(token, nextPrefs);
      onProfileUpdate({ ...profile, notificationPreferences: updated });
    } catch (_) {
      toast.error('Failed to update preference');
      setPreferences(preferences); // Revert on failure
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Bell size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Notification Preferences</h2>
          <p className="text-xs text-slate-400">Choose how you want to receive alerts, updates, and offers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'orderUpdates',
            title: 'Order Status Updates',
            desc: 'Get notified via SMS/Email about your order placement, shipping, tracking, and delivery.'
          },
          {
            key: 'promotionalOffers',
            title: 'Promotional Offers & Newsletters',
            desc: 'Receive alerts about flash sales, seasonal discounts, coupons, and health wellness blogs.'
          },
          {
            key: 'prescriptionReminders',
            title: 'Prescription Expiry Reminders',
            desc: 'Alerts when your uploaded prescriptions are approaching their expiry dates or need refills.'
          },
          {
            key: 'priceDropAlerts',
            title: 'Wishlist Price Drops',
            desc: 'Instant notifications if products in your wishlist receive price drop discounts.'
          }
        ].map(({ key, title, desc }) => (
          <div key={key} className="flex gap-4 justify-between items-start p-3 hover:bg-slate-50/50 rounded-xl transition-all">
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-800">{title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{desc}</p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => handleToggle(key)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                preferences[key] ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences[key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferencesTab;
