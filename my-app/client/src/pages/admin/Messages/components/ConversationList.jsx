import React from 'react';
import { Loader2, User } from 'lucide-react';

export const ConversationList = ({ conversations, loading, selectedId, onSelect }) => {
  if (loading && conversations.length === 0) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (conversations.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-sm text-slate-500 p-4 text-center">
      No conversations found.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
      {conversations.map(c => {
        const isSelected = selectedId === c._id;
        const hasUnread = c.unreadCount > 0;
        
        return (
          <div 
            key={c._id} 
            onClick={() => onSelect(c._id)}
            className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'bg-white hover:bg-slate-50 border-l-4 border-transparent'}`}
          >
            <div className="flex items-start gap-3">
              {c.customerId?.image ? (
                <img src={c.customerId.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex justify-center items-center shrink-0">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-sm truncate pr-2 ${hasUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                    {c.customerId?.name || 'Unknown User'}
                  </h3>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(c.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-xs truncate flex-1 ${hasUnread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {c.lastMessage || 'No messages yet'}
                  </p>
                  {hasUnread && (
                    <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
