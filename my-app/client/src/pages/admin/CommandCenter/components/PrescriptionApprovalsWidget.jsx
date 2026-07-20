import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RefreshCw, FileSignature, Check, X } from 'lucide-react';

export const PrescriptionApprovalsWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        setPrescriptions([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileSignature className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-black text-slate-800">Prescriptions Awaiting Approval</h3>
        </div>
        <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
          {prescriptions.length} Pending
        </span>
      </div>
      
      <div className="p-2 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-2">
            {prescriptions.map(prx => (
              <div key={prx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-start gap-4 mb-3 sm:mb-0">
                  <div className="w-12 h-16 bg-slate-200 rounded-md border border-slate-300 flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden group cursor-pointer">
                    {/* Mock thumbnail */}
                    <div className="w-full h-2 bg-slate-300 mt-1"></div>
                    <div className="w-3/4 h-1 bg-slate-300 mt-1"></div>
                    <div className="w-5/6 h-1 bg-slate-300 mt-1"></div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-[8px] text-white font-bold">View</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-slate-800">{prx.customer}</p>
                      <span className="text-[10px] font-bold text-slate-400">{prx.date}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-1">Order: <span className="text-blue-600 font-bold">{prx.orderId}</span></p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{prx.doctor}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1 sm:flex-none bg-blue-600">
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <FileSignature className="h-8 w-8 mb-3 text-slate-200" />
            <p className="text-xs font-bold">No pending prescriptions!</p>
          </div>
        )}
      </div>
    </Card>
  );
};
