import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { PricingStatsStrip } from './components/PricingStatsStrip';
import { SuggestionsTable } from './components/SuggestionsTable';
import { RuleConfigPanel } from './components/RuleConfigPanel';
import toast from 'react-hot-toast';

const AIPricing = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/pricing/rules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(res.data);
    } catch (err) {
      toast.error('Failed to load rules');
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/pricing/suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuggestions(res.data);
    } catch (err) {
      toast.error('Failed to calculate suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
    fetchSuggestions();
  }, []);

  const handleApply = async (medId, newPrice) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/pricing/apply/${medId}`, { newPrice }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Price updated successfully');
      setSuggestions(prev => prev.filter(s => s.medicineId !== medId));
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  const handleDismiss = (medId) => {
    setSuggestions(prev => prev.filter(s => s.medicineId !== medId));
  };

  const handleRefresh = () => {
    fetchRules();
    fetchSuggestions();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-indigo-600" />
            AI Pricing Engine
          </h1>
          <p className="text-sm text-slate-500 font-medium">Smart pricing suggestions based on stock, demand, and expiry rules</p>
        </div>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors border border-indigo-200"
        >
          <Sparkles className="w-5 h-5" />
          {showConfig ? 'Hide Configuration' : 'Configure Rules'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {showConfig && (
          <RuleConfigPanel 
            rules={rules} 
            onRulesUpdated={handleRefresh} 
            onClose={() => setShowConfig(false)} 
          />
        )}

        {!showConfig && (
          <>
            <PricingStatsStrip suggestions={suggestions} />
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-xl">
                <h2 className="font-bold text-slate-800">Pending Suggestions ({suggestions.length})</h2>
              </div>
              <SuggestionsTable 
                suggestions={suggestions}
                loading={loading}
                onApply={handleApply}
                onDismiss={handleDismiss}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AIPricing;
