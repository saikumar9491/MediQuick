import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server, Clock, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SystemHealthStrip = () => {
  const { orders, medicines, users, loading: contextLoading } = useCommandCenter();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Connect real endpoint
        // axios.get('/api/admin/system-health')
        await new Promise(res => setTimeout(res, 300)); 
        
        setHealth({
          status: 'Operational', // Operational, Degraded, Down
          uptime: '99.98%',
          lastBackup: '2 hours ago',
          activeSessions: 14
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(contextLoading);
      }
    };
    fetchData();
  }, [orders, medicines, users, contextLoading]);

  if (loading) return null;

  return (
    <div className="bg-slate-800 text-slate-300 rounded-lg p-3 flex flex-wrap items-center justify-between text-[11px] font-bold tracking-wider uppercase animate-in fade-in duration-500 shadow-sm mt-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full animate-pulse ${health?.status === 'Operational' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <span className="text-white">API: {health?.status}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-slate-400" />
          <span>Uptime: {health?.uptime}</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Last Backup: {health?.lastBackup}</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span>Active Admins: {health?.activeSessions}</span>
        </div>
      </div>
      
      <Link to="/admin/xray" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
        <Activity className="h-3.5 w-3.5" />
        X-Ray Monitor
        <ExternalLink className="h-3 w-3 ml-0.5" />
      </Link>
    </div>
  );
};
