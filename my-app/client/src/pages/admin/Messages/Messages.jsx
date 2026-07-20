import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Loader2, Info } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { ConversationList } from './components/ConversationList';
import { MessageThread } from './components/MessageThread';
import toast from 'react-hot-toast';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Polling for conversation list
  const fetchConversations = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/messages/conversations`, {
        params: { filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
    const intervalId = setInterval(() => fetchConversations(false), 15000); // Poll every 15s
    return () => clearInterval(intervalId);
  }, [filter]);

  const filteredConversations = conversations.filter(c => {
    if (!search) return true;
    return c.customerId?.name?.toLowerCase().includes(search.toLowerCase()) || 
           c.customerId?.phone?.includes(search);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-indigo-500" />
            Messages
          </h1>
          <p className="text-sm text-slate-500 font-medium">Direct communication with customers</p>
        </div>
        <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-2 rounded-lg">
          <Info className="w-4 h-4" /> Polling mode (real-time WebSockets not yet configured)
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Conversation List */}
        <div className="w-1/3 min-w-[300px] border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-1 ${filter === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('Unread')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-1 ${filter === 'Unread' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Unread
              </button>
              <button 
                onClick={() => setFilter('Mine')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex-1 ${filter === 'Mine' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Mine
              </button>
            </div>
          </div>

          <ConversationList 
            conversations={filteredConversations} 
            loading={loading}
            selectedId={selectedConversationId}
            onSelect={(id) => {
              setSelectedConversationId(id);
              // Optimistically clear unread badge in UI
              setConversations(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0 } : c));
            }}
          />
        </div>

        {/* Right Panel: Active Thread */}
        <div className="flex-1 bg-slate-50 flex flex-col relative">
          {selectedConversationId ? (
            <MessageThread 
              conversationId={selectedConversationId} 
              onConversationUpdate={() => fetchConversations(false)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
