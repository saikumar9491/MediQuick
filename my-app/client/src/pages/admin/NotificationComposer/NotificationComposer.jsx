import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Plus, Bell } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { NotificationStatsStrip } from './components/NotificationStatsStrip';
import { NotificationsTable } from './components/NotificationsTable';
import { ComposeModal } from './components/ComposeModal';
import toast from 'react-hot-toast';

const NotificationComposer = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Bell className="w-7 h-7 text-sky-500" />
            Notification Composer
          </h1>
          <p className="text-sm text-slate-500 font-medium">Engage customers via Email, SMS, and Push</p>
        </div>
        <button 
          onClick={() => setIsComposeModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Notification
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <NotificationStatsStrip notifications={notifications} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
            <h2 className="font-bold text-slate-800">Campaign History</h2>
          </div>
          <NotificationsTable 
            notifications={notifications}
            loading={loading}
            onRefresh={fetchNotifications}
          />
        </div>

      </div>

      {isComposeModalOpen && (
        <ComposeModal 
          onClose={() => setIsComposeModalOpen(false)}
          onSuccess={fetchNotifications}
        />
      )}
    </div>
  );
};

export default NotificationComposer;
