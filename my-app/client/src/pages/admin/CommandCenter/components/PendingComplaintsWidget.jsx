import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { RefreshCw, MessageSquare } from 'lucide-react';

export const PendingComplaintsWidget = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        setComplaints([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Card className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm font-black text-slate-800">Pending Complaints</h3>
        </div>
        <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">
          {complaints.length} Open
        </span>
      </div>
      
      <div className="p-2 flex-1 relative min-h-[250px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
          </div>
        ) : complaints.length > 0 ? (
          <div className="space-y-1">
            {complaints.map(complaint => (
              <div key={complaint.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500">#{complaint.id}</span>
                    <p className="text-xs font-bold text-slate-700">{complaint.customer}</p>
                    <Badge variant={getPriorityVariant(complaint.priority)} className="ml-2 scale-90 origin-left">
                      {complaint.priority}
                    </Badge>
                  </div>
                  <p className="text-xs font-black text-slate-800 mt-1 truncate">{complaint.issue}</p>
                </div>
                <Button variant="outline" size="sm" className="whitespace-nowrap flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare className="h-8 w-8 mb-3 text-slate-200" />
            <p className="text-xs font-bold">No pending complaints!</p>
          </div>
        )}
      </div>
    </Card>
  );
};
