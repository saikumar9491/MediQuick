import React from 'react';
import { Send, Clock, Inbox, MailOpen } from 'lucide-react';

export const NotificationStatsStrip = ({ notifications }) => {
  if (!notifications) return <div className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>;

  const sent = notifications.filter(n => n.status === 'Sent');
  const scheduled = notifications.filter(n => n.status === 'Scheduled');
  const sentToday = sent.filter(n => new Date(n.sentAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Sent Today</p>
          <p className="text-xl font-black text-sky-500">{sentToday}</p>
        </div>
        <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center">
          <Send className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Campaigns</p>
          <p className="text-xl font-black text-slate-800">{notifications.length}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <Inbox className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Scheduled / Drafts</p>
          <p className="text-xl font-black text-slate-800">{scheduled.length + notifications.filter(n=>n.status==='Draft').length}</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between opacity-50">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Open Rate</p>
          <p className="text-xl font-black text-slate-800">--%</p>
        </div>
        <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
          <MailOpen className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
