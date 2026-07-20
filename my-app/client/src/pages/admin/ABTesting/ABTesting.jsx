import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlaskConical, Plus } from 'lucide-react';
import { API_BASE } from '../../../utils/apiConfig';
import { ABStatsStrip } from './components/ABStatsStrip';
import { TestsTable } from './components/TestsTable';
import { CreateTestModal } from './components/CreateTestModal';
import { TestResultsView } from './components/TestResultsView';
import toast from 'react-hot-toast';

const ABTesting = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE}/api/ab-tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    } catch (err) {
      toast.error('Failed to load A/B tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-indigo-600" />
            A/B Testing
          </h1>
          <p className="text-sm text-slate-500 font-medium">Design experiments and analyze performance</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Test
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <ABStatsStrip tests={tests} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <TestsTable 
            tests={tests}
            loading={loading}
            onRowClick={setSelectedTestId}
            onRefresh={fetchTests}
          />
        </div>

      </div>

      {isCreateModalOpen && (
        <CreateTestModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchTests}
        />
      )}

      {selectedTestId && (
        <TestResultsView 
          testId={selectedTestId}
          onClose={() => setSelectedTestId(null)}
          onRefresh={fetchTests}
        />
      )}

    </div>
  );
};

export default ABTesting;
