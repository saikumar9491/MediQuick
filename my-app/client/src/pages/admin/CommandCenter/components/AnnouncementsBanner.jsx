import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const AnnouncementsBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Connect real endpoint
        // axios.get('/api/admin/announcements')
        await new Promise(res => setTimeout(res, 200)); 
        
        setAnnouncements([
          { id: 'ann-1', type: 'warning', message: '5 new prescription approvals need review immediately.' },
          { id: 'ann-2', type: 'info', message: 'System maintenance scheduled for tonight at 2:00 AM IST.' }
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id]);
  };

  const getVariantStyles = (type) => {
    switch(type) {
      case 'warning': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'critical': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-in fade-in duration-500 slide-in-from-top-4">
      {visibleAnnouncements.map(announcement => (
        <div 
          key={announcement.id} 
          className={`flex items-start justify-between p-4 border rounded-xl shadow-sm ${getVariantStyles(announcement.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(announcement.type)}
            <p className="text-sm font-bold mt-0.5">{announcement.message}</p>
          </div>
          <button 
            onClick={() => handleDismiss(announcement.id)}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
};
