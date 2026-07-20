import React, { useState } from 'react';
import { Check, X, Loader2, Edit2, Save } from 'lucide-react';

export const SuggestionsTable = ({ suggestions, loading, onApply, onDismiss }) => {
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  if (suggestions.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-slate-500 py-12">
      No pricing suggestions at this time.
    </div>
  );

  const handleEditClick = (s) => {
    setEditingId(s.medicineId);
    setEditPrice(s.suggestedPrice);
  };

  const handleSaveClick = (s) => {
    if (!editPrice || isNaN(editPrice) || Number(editPrice) <= 0) return;
    onApply(s.medicineId, Number(editPrice));
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-4">Product</th>
            <th className="p-4">Current Price</th>
            <th className="p-4">Suggested Price</th>
            <th className="p-4">Reason</th>
            <th className="p-4">Est. Impact</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {suggestions.map(s => {
            const isEditing = editingId === s.medicineId;
            return (
              <tr key={s.medicineId} className="hover:bg-slate-50 transition-colors bg-white">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt={s.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm max-w-[200px] truncate">{s.name}</p>
                      <p className="text-xs text-slate-500">Stock: {s.stock}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-500 line-through">₹{s.currentPrice}</span>
                </td>
                <td className="p-4">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">₹</span>
                      <input 
                        type="number" 
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 px-2 py-1 border border-indigo-300 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <span className="font-black text-indigo-600 text-lg flex items-center gap-1">
                      ₹{s.suggestedPrice}
                      <button onClick={() => handleEditClick(s)} className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors ml-1">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded block w-max">
                    {s.reason}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-bold text-sm ${s.potentialImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {s.potentialImpact >= 0 ? '+' : '-'}₹{Math.abs(s.potentialImpact).toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onDismiss(s.medicineId)} 
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Dismiss
                    </button>
                    {isEditing ? (
                      <button 
                        onClick={() => handleSaveClick(s)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => onApply(s.medicineId, s.suggestedPrice)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3 h-3" /> Apply
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
