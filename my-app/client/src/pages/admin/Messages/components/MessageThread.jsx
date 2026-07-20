import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2, User, Phone, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const MessageThread = ({ conversationId, onConversationUpdate }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const fetchThread = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/messages/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversation(res.data.conversation);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch thread');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread(true);
    const intervalId = setInterval(() => fetchThread(false), 5000); // Poll thread faster
    return () => clearInterval(intervalId);
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.post(`${API_BASE}/api/messages/conversations/${conversationId}/send`, {
        text: inputText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, res.data]);
      setInputText('');
      onConversationUpdate(); // Update list to show new last message
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/messages/conversations/${conversationId}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Conversation resolved');
      fetchThread();
      onConversationUpdate();
    } catch (err) {
      toast.error('Failed to resolve');
    }
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (!conversation) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          {conversation.customerId?.image ? (
            <img src={conversation.customerId.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex justify-center items-center shrink-0">
              <User className="w-5 h-5 text-slate-500" />
            </div>
          )}
          <div>
            <h2 className="font-black text-slate-800 leading-tight">{conversation.customerId?.name || 'Unknown User'}</h2>
            <div className="flex gap-3 text-xs text-slate-500 font-medium">
              {conversation.customerId?.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {conversation.customerId.phone}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          {conversation.status === 'Resolved' ? (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] uppercase rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Resolved
            </span>
          ) : (
            <button 
              onClick={handleResolve}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8 font-medium">No messages in this conversation yet.</div>
        ) : (
          messages.map(msg => {
            const isAdmin = msg.sender === 'Admin';
            return (
              <div key={msg._id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isAdmin 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <div className="text-[10px] font-medium text-slate-400 mt-1 mx-1">
                  {isAdmin && msg.senderId?.name ? `You (${msg.senderId.name}) • ` : ''}
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {conversation.status !== 'Resolved' && (
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
            <button 
              type="submit" 
              disabled={sending || !inputText.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 w-16 shadow-sm"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
