import React from 'react';

export const TopSearchesChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-sm text-slate-500 py-4">No search data available.</div>;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-3 mt-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-24 shrink-0 truncate text-xs font-bold text-slate-700" title={item.term}>
            {item.term}
          </div>
          <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden flex items-center">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <div className="w-12 shrink-0 text-right text-xs font-bold text-slate-500">
            {item.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
