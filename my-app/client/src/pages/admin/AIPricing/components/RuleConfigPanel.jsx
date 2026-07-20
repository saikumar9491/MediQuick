import React, { useState } from 'react';
import { Save, Loader2, Play } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

export const RuleConfigPanel = ({ rules, onRulesUpdated, onClose }) => {
  const [localRules, setLocalRules] = useState(rules);
  const [savingId, setSavingId] = useState(null);

  const handleUpdateRule = async (ruleId, updates) => {
    setSavingId(ruleId);
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/pricing/rules/${ruleId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Rule updated');
      onRulesUpdated();
      // Update local state to reflect changes instantly
      setLocalRules(prev => prev.map(r => r._id === ruleId ? { ...r, ...updates } : r));
    } catch (err) {
      toast.error('Failed to update rule');
    } finally {
      setSavingId(null);
    }
  };

  const handleThresholdChange = (ruleId, key, value) => {
    setLocalRules(prev => prev.map(r => {
      if (r._id === ruleId) {
        return { ...r, thresholds: { ...r.thresholds, [key]: Number(value) } };
      }
      return r;
    }));
  };

  const handleAdjustmentChange = (ruleId, value) => {
    setLocalRules(prev => prev.map(r => r._id === ruleId ? { ...r, adjustmentPercent: Number(value) } : r));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden mb-6 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-indigo-50/50 p-4 border-b border-indigo-100">
        <h2 className="font-bold text-indigo-900">Configuration: AI Pricing Rules Engine</h2>
        <p className="text-sm text-indigo-700 mt-1">Adjust the thresholds that drive the pricing suggestions below.</p>
      </div>
      
      <div className="p-4 space-y-4">
        {localRules.map(rule => (
          <div key={rule._id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={rule.isActive} 
                  onChange={(e) => handleUpdateRule(rule._id, { isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="font-bold text-slate-800">{rule.ruleName}</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">{rule.conditionType}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 pl-6">
                <span>Suggest a</span>
                <input 
                  type="number" value={rule.adjustmentPercent} onChange={(e) => handleAdjustmentChange(rule._id, e.target.value)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500"
                />
                <span>% price {rule.adjustmentPercent >= 0 ? 'increase' : 'decrease'}</span>
                
                <span>when</span>
                
                {rule.conditionType === 'Low Demand' && (
                  <>
                    <span>no sales in</span>
                    <input type="number" value={rule.thresholds.daysWithoutSale || 30} onChange={(e) => handleThresholdChange(rule._id, 'daysWithoutSale', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                    <span>days AND stock &gt;</span>
                    <input type="number" value={rule.thresholds.stockGreaterThan || 10} onChange={(e) => handleThresholdChange(rule._id, 'stockGreaterThan', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                  </>
                )}
                
                {rule.conditionType === 'Expiring Soon' && (
                  <>
                    <span>expiry is within</span>
                    <input type="number" value={rule.thresholds.expiryDaysLessThan || 30} onChange={(e) => handleThresholdChange(rule._id, 'expiryDaysLessThan', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                    <span>days</span>
                  </>
                )}

                {rule.conditionType === 'High Demand, Low Stock' && (
                  <>
                    <span>sold</span>
                    <input type="number" value={rule.thresholds.salesLast7DaysGreaterThan || 50} onChange={(e) => handleThresholdChange(rule._id, 'salesLast7DaysGreaterThan', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                    <span>+ units in 7 days AND stock &lt;</span>
                    <input type="number" value={rule.thresholds.stockLessThan || 20} onChange={(e) => handleThresholdChange(rule._id, 'stockLessThan', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                  </>
                )}

                {rule.conditionType === 'Overstocked' && (
                  <>
                    <span>stock &gt;</span>
                    <input type="number" value={rule.thresholds.stockGreaterThan || 100} onChange={(e) => handleThresholdChange(rule._id, 'stockGreaterThan', e.target.value)} className="w-16 px-2 py-1 border border-slate-300 rounded font-bold outline-none focus:border-indigo-500" />
                  </>
                )}

              </div>
            </div>

            <button 
              onClick={() => handleUpdateRule(rule._id, { thresholds: rule.thresholds, adjustmentPercent: rule.adjustmentPercent })}
              disabled={savingId === rule._id}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg flex items-center gap-2 shadow-sm shrink-0"
            >
              {savingId === rule._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Rule
            </button>
          </div>
        ))}
        {localRules.length === 0 && (
          <p className="text-slate-500 italic">No rules defined. Run the initialization script to seed default rules.</p>
        )}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-lg">
          Close Configuration
        </button>
        <button onClick={onRulesUpdated} className="px-5 py-2 bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 rounded-lg flex items-center gap-2">
          <Play className="w-4 h-4" /> Rerun Engine
        </button>
      </div>
    </div>
  );
};
