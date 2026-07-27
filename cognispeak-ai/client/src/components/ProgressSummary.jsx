import { useState, useEffect } from 'react';
import { Target, AlertTriangle } from 'lucide-react';

const ProgressSummary = () => {
  const [data, setData] = useState({ overallScore: 0, categoryScores: {}, weakAreas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch from /api/analytics using the user's JWT.
    // For now, let's simulate a network request and return mock data.
    setTimeout(() => {
      setData({
        overallScore: 68,
        categoryScores: {
          ReadAloud: 85,
          ListenRepeat: 72,
          Speaking: 60,
          Grammar: 78,
          Reading: 80,
          Email: 65,
        },
        weakAreas: ['Speaking', 'Email']
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl flex items-center justify-center h-full">
        <span className="opacity-50">Loading progress...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="text-[hsl(var(--primary))]" />
          Overall Progress
        </h3>
        <div className="text-3xl font-bold text-[hsl(var(--primary))]">
          {data.overallScore}%
        </div>
      </div>
      
      {data.weakAreas.length > 0 && (
        <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-3 text-orange-500">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Focus Areas</h4>
            <p className="text-sm opacity-90">
              Your scores in {data.weakAreas.join(' and ')} are below 80%. Consider spending extra time on these modules.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSummary;
