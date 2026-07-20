import React from 'react';

export const SearchVolumeTrend = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-sm text-slate-500 py-4">No trend data available.</div>;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="mt-4 flex items-end justify-between h-48 gap-1">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 group">
          <div className="w-full flex justify-center relative">
            <div 
              className="w-full max-w-[20px] bg-sky-200 group-hover:bg-sky-500 rounded-t-sm transition-all duration-300 relative"
              style={{ height: `${Math.max(4, (item.count / maxCount) * 160)}px` }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none transition-opacity">
                {item.count} searches
              </div>
            </div>
          </div>
          {/* Show dates sparsely if many points */}
          {(data.length <= 14 || i % Math.ceil(data.length/7) === 0) && (
            <div className="text-[9px] font-bold text-slate-400 mt-2 rotate-45 origin-left">
              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
