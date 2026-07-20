import React, { useState, useEffect } from 'react';
import { X, Loader2, Trophy, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../../../../utils/apiConfig';
import toast from 'react-hot-toast';

// Simple calculation for statistical confidence (Z-score for two proportions)
const calculateConfidence = (varA, varB) => {
  if (varA.impressions === 0 || varB.impressions === 0) return { winner: null, confidence: 0 };
  
  const pA = varA.conversions / varA.impressions;
  const pB = varB.conversions / varB.impressions;
  
  if (pA === 0 && pB === 0) return { winner: null, confidence: 0 };

  const pPool = (varA.conversions + varB.conversions) / (varA.impressions + varB.impressions);
  const se = Math.sqrt(pPool * (1 - pPool) * (1/varA.impressions + 1/varB.impressions));
  
  if (se === 0) return { winner: null, confidence: 0 };

  const z = Math.abs(pB - pA) / se;
  
  // Approximate confidence based on Z-score
  let confidence = 0;
  if (z >= 2.576) confidence = 99;
  else if (z >= 1.96) confidence = 95;
  else if (z >= 1.645) confidence = 90;
  else if (z >= 1.28) confidence = 80;
  else if (z >= 1.0) confidence = 68;
  else confidence = Math.round((z / 1.0) * 68); // Very rough approximation for low z

  const winner = pB > pA ? 'B' : (pA > pB ? 'A' : null);
  
  return { winner, confidence: Math.min(99, confidence) };
};

export const TestResultsView = ({ testId, onClose, onRefresh }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get(`${API_BASE}/api/ab-tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTest(res.data);
      } catch (err) {
        toast.error("Failed to load test details");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, onClose]);

  const handleDeclareWinner = async (variantId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.patch(`${API_BASE}/api/ab-tests/${test._id}`, { 
        status: 'Completed', 
        winningVariant: variantId 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Winner declared!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to declare winner");
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
    </div>
  );

  if (!test) return null;

  const variantA = test.variants.find(v => v.label === 'A');
  const variantB = test.variants.find(v => v.label === 'B');
  
  const statsA = {
    cr: variantA.impressions > 0 ? ((variantA.conversions / variantA.impressions) * 100).toFixed(2) : '0.00',
    rpv: variantA.impressions > 0 ? (variantA.revenueAttributed / variantA.impressions).toFixed(2) : '0.00'
  };
  const statsB = {
    cr: variantB.impressions > 0 ? ((variantB.conversions / variantB.impressions) * 100).toFixed(2) : '0.00',
    rpv: variantB.impressions > 0 ? (variantB.revenueAttributed / variantB.impressions).toFixed(2) : '0.00'
  };

  const { winner, confidence } = calculateConfidence(variantA, variantB);
  
  const hasData = variantA.impressions > 0 || variantB.impressions > 0;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800">Test Results: {test.name}</h2>
            <p className="text-xs text-slate-500 mt-1">Goal: Maximize {test.successMetric}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
          
          {!hasData ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No data yet</h3>
              <p className="text-slate-500 max-w-md mt-2">
                This test hasn't collected any impressions or conversions yet. A developer needs to integrate the frontend application to call the tracking endpoint for this test.
              </p>
              <div className="mt-4 p-3 bg-slate-100 rounded text-xs font-mono text-slate-600 border border-slate-200">
                POST /api/ab-tests/{test._id}/track
              </div>
            </div>
          ) : (
            <>
              {winner && confidence > 0 && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${confidence >= 95 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                  <Trophy className={`w-6 h-6 shrink-0 ${confidence >= 95 ? 'text-emerald-500' : 'text-blue-500'}`} />
                  <div>
                    <h3 className="font-bold text-sm">Variant {winner} is leading!</h3>
                    <p className="text-xs mt-1">
                      Based on current data, Variant {winner} is outperforming with approximately <strong>{confidence}% statistical confidence</strong>. 
                      {confidence < 95 && " (Note: Usually 95%+ is recommended before calling a definitive winner)."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* Variant A */}
                <div className={`bg-white rounded-xl border ${winner === 'A' ? 'border-indigo-400 ring-2 ring-indigo-50' : 'border-slate-200'} overflow-hidden flex flex-col`}>
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-indigo-700">Variant A (Control)</h3>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px] mt-0.5">{variantA.content}</p>
                    </div>
                    {winner === 'A' && <Trophy className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <div className="p-5 flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Impressions</p>
                      <p className="font-bold text-slate-700 text-lg">{variantA.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Conversions</p>
                      <p className="font-bold text-slate-700 text-lg">{variantA.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase">Conv. Rate</p>
                      <p className="font-black text-indigo-600 text-2xl">{statsA.cr}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue / Visitor</p>
                      <p className="font-bold text-slate-700 text-lg">₹{statsA.rpv}</p>
                    </div>
                  </div>
                  {test.status !== 'Completed' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                      <button 
                        onClick={() => handleDeclareWinner(variantA._id)}
                        className="w-full py-2 bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 font-bold text-sm text-slate-700 rounded-lg transition-colors"
                      >
                        Declare Winner & Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Variant B */}
                <div className={`bg-white rounded-xl border ${winner === 'B' ? 'border-emerald-400 ring-2 ring-emerald-50' : 'border-slate-200'} overflow-hidden flex flex-col`}>
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-emerald-700">Variant B (Challenger)</h3>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px] mt-0.5">{variantB.content}</p>
                    </div>
                    {winner === 'B' && <Trophy className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div className="p-5 flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Impressions</p>
                      <p className="font-bold text-slate-700 text-lg">{variantB.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Conversions</p>
                      <p className="font-bold text-slate-700 text-lg">{variantB.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase">Conv. Rate</p>
                      <p className="font-black text-emerald-600 text-2xl">{statsB.cr}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue / Visitor</p>
                      <p className="font-bold text-slate-700 text-lg">₹{statsB.rpv}</p>
                    </div>
                  </div>
                  {test.status !== 'Completed' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                      <button 
                        onClick={() => handleDeclareWinner(variantB._id)}
                        className="w-full py-2 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 font-bold text-sm text-slate-700 rounded-lg transition-colors"
                      >
                        Declare Winner & Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
