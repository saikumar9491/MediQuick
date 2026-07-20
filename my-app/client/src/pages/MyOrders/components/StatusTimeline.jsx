import React from 'react';
import { CheckCircle2, Clock, Truck, Package, ShieldAlert } from 'lucide-react';

const STEPS = [
  { status: 'Placed', label: 'Order Placed', icon: Clock },
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'Processing', label: 'Processing', icon: Package },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
];

const StatusTimeline = ({ currentStatus, updatedAt, statusHistory = [] }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-xs">
        <ShieldAlert size={16} />
        <div>
          <p className="font-semibold">Order Cancelled</p>
          {updatedAt && (
            <p className="text-[10px] text-red-500 mt-0.5">
              Cancelled on {new Date(updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Find step index of current status
  const currentIdx = STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="py-4 space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const StepIcon = step.icon;

          // Find if there is timestamp in statusHistory
          const historyItem = statusHistory.find(h => h.status === step.status);
          const timestamp = historyItem?.timestamp || (isCurrent ? updatedAt : null);

          return (
            <div key={step.status} className="relative flex gap-4 items-start">
              {/* Timeline Indicator dot */}
              <div className={`absolute -left-6 w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 transition-all ${
                isDone
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {isDone ? (
                  <CheckCircle2 size={11} className="stroke-[3]" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-slate-350 bg-slate-300 rounded-full" />
                )}
              </div>

              {/* Step info */}
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className={`text-xs font-semibold ${isDone ? 'text-slate-800' : 'text-slate-400'} ${isCurrent ? 'text-blue-600 font-bold' : ''}`}>
                    {step.label}
                  </h4>
                  {timestamp && (
                    <span className="text-[9px] text-slate-400">
                      {new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-[10px] text-blue-500 font-medium mt-0.5">Current Status</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
