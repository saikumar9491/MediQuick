import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Stethoscope, Leaf, ShieldCheck } from 'lucide-react';

const QuickAccessGrid = () => {
  const navigate = useNavigate();

  const services = [
    { name: 'Lab Tests', icon: FlaskConical, path: '/lab-tests', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { name: 'Consult Doctor', icon: Stethoscope, path: '/consult', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Ayurveda', icon: Leaf, path: '/ayurveda', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Care Plan', icon: ShieldCheck, path: '/care-plan', color: 'bg-teal-50 text-teal-600 border-teal-100' }
  ];

  return (
    <div className="bg-white py-4 px-4 border-b border-slate-100">
      <div className="grid grid-cols-4 gap-3.5">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.name}
              onClick={() => navigate(svc.path)}
              className="flex flex-col items-center gap-1.5 focus:outline-none active:scale-95 transition-all select-none"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${svc.color} shadow-3xs`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-extrabold text-slate-650 tracking-tight text-center leading-tight uppercase">
                {svc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
