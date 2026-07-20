import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ZeroResultsTable = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-sm text-slate-500 py-12">
      No zero-result searches found! Good job.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white">
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-3">Search Term</th>
            <th className="p-3">Count</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-amber-50/50 transition-colors bg-white group">
              <td className="p-3 font-bold text-slate-800 text-sm">{item.term}</td>
              <td className="p-3 font-bold text-amber-600">{item.count.toLocaleString()}</td>
              <td className="p-3 text-right">
                <button 
                  onClick={() => navigate(`/admin/products/add?name=${encodeURIComponent(item.term)}`)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] rounded transition-all flex items-center gap-1 ml-auto"
                >
                  <Plus className="w-3 h-3" /> Add Product
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
