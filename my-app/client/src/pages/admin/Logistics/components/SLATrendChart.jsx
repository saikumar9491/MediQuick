import React from 'react';

export const SLATrendChart = ({ data }) => {
  // Simple CSS-based bar chart for visualization without heavy dependencies
  if (!data || data.length === 0) return null;

  const maxTime = Math.max(...data.map(d => d.avgTime), 60); // min height baseline

  return (
    <div className="h-64 flex flex-col justify-end pt-4">
      <div className="flex-1 flex items-end justify-between gap-2">
        {data.map((item, i) => {
          const heightPercent = (item.avgTime / maxTime) * 100;
          return (
            <div key={i} className="flex flex-col items-center flex-1 group">
              <div 
                className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-all relative"
                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.avgTime} mins
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">{item.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
