import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Megaphone, Plus } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { MarketingStatsStrip } from './components/MarketingStatsStrip';
import { CampaignsTable } from './components/CampaignsTable';
import { CampaignModal } from './components/CampaignModal';
import toast from 'react-hot-toast';

const Marketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/marketing/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching marketing stats', err);
    }
  };

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/marketing/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data);
    } catch (err) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleOpenAdd = () => {
    setSelectedCampaign(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCampaign(c);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchStats();
    fetchCampaigns();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-blue-600" />
            Marketing Campaigns
          </h1>
          <p className="text-sm text-slate-500 font-medium">Broadcast targeted promotions via Email, SMS, and Push</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <MarketingStatsStrip stats={stats} />
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <CampaignsTable 
            campaigns={campaigns}
            loading={loading}
            onEdit={handleOpenEdit}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {isModalOpen && (
        <CampaignModal 
          campaign={selectedCampaign}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default Marketing;
