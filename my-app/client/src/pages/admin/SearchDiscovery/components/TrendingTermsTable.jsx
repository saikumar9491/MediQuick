import React from 'react';
import { TrendingUp } from 'lucide-react';

export const TrendingTermsTable = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="flex-1 flex justify-center items-center text-sm text-slate-500 py-12">
      No trending search terms to display.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white">
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
            <th className="p-3">Search Term</th>
            <th className="p-3">Current Week</th>
            <th className="p-3 text-right">Growth</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-emerald-50/50 transition-colors bg-white">
              <td className="p-3 font-bold text-slate-800 text-sm">{item.term}</td>
              <td className="p-3 font-bold text-slate-600">{item.current.toLocaleString()}</td>
              <td className="p-3 text-right">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] rounded">
                  <TrendingUp className="w-3 h-3" /> +{item.growth}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
