import React from 'react';
import { Layers } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminPlaceholder = () => {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop().replace('-', ' ');

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight capitalize">{pathName}</h2>
          <p className="text-sm font-semibold text-slate-500">Module is currently being scaffolded.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[400px] border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white shadow-sm">
        <Layers className="h-12 w-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-bold text-slate-700 capitalize">{pathName} Console</h3>
        <p className="text-sm">This page will connect to existing backend APIs via Axios.</p>
        <p className="text-xs mt-2 text-slate-400">Path: {location.pathname}</p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
