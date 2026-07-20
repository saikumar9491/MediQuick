import React, { useState } from 'react';
import { Send, User as UserIcon } from 'lucide-react';

export const InternalNotesThread = ({ notes, onAddNote, submitting }) => {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote('');
  };

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
      <div className="p-3 bg-white border-b border-slate-200 font-black text-slate-800 text-sm">
        Internal Team Notes
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-slate-800">{note.adminName}</span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            No internal notes yet.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type an internal note..."
          className="flex-1 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-10 custom-scrollbar"
          rows={1}
        />
        <button
          type="submit"
          disabled={!newNote.trim() || submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 shrink-0 self-end flex items-center justify-center w-10 h-10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
