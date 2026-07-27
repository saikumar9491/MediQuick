import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Target, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/analytics/history');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
        calculateInsights(data.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const calculateInsights = (data) => {
    if (data.length === 0) return;
    
    // Collect all weak areas
    const allWeaknesses = data.flatMap(d => d.weakAreas);
    const weakCounts = allWeaknesses.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    
    // Sort weaknesses by frequency
    const sortedWeaknesses = Object.entries(weakCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
      
    setWeaknesses(sortedWeaknesses.slice(0, 3));

    // Calculate strengths (modules with high averages)
    const moduleScores = {};
    data.forEach(d => {
      if (!moduleScores[d.module]) {
        moduleScores[d.module] = { total: 0, count: 0 };
      }
      moduleScores[d.module].total += d.scoreBreakdown.overall;
      moduleScores[d.module].count += 1;
    });

    const sortedStrengths = Object.entries(moduleScores)
      .map(([mod, stats]) => ({ module: mod, avg: stats.total / stats.count }))
      .filter(item => item.avg >= 80)
      .sort((a, b) => b.avg - a.avg)
      .map(item => item.module);

    setStrengths(sortedStrengths.slice(0, 3));
  };

  if (loading) {
    return <div className="p-12 text-center text-lg opacity-70">Loading Dashboard...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
        <p className="opacity-70 mb-8">You haven't completed any modules yet. Take a test to see your analytics!</p>
      </div>
    );
  }

  // Prepare data for Radar Chart (Averages per module)
  const radarDataMap = {};
  history.forEach(item => {
    if (!radarDataMap[item.module]) {
      radarDataMap[item.module] = { subject: item.module, A: 0, count: 0, fullMark: 100 };
    }
    radarDataMap[item.module].A += item.scoreBreakdown.overall;
    radarDataMap[item.module].count += 1;
  });
  const radarData = Object.values(radarDataMap).map(d => ({
    ...d,
    A: Math.round(d.A / d.count)
  }));

  // Prepare data for Bar Chart (Recent history)
  const barData = history.slice(0, 10).reverse().map(item => ({
    name: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.scoreBreakdown.overall,
    module: item.module
  }));

  const averageScore = Math.round(history.reduce((acc, curr) => acc + curr.scoreBreakdown.overall, 0) / history.length);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in">
      <header>
        <h1 className="text-4xl font-bold mb-2">Performance Dashboard</h1>
        <p className="opacity-70 text-lg">Track your progress and AI-generated insights.</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-full">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase">Total Tests</div>
            <div className="text-2xl font-black">{history.length}</div>
          </div>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-full">
            <Target size={24} />
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase">Avg Score</div>
            <div className="text-2xl font-black">{averageScore}%</div>
          </div>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase">Top Strength</div>
            <div className="text-lg font-bold line-clamp-1">{strengths[0] || 'Keep practicing!'}</div>
          </div>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
            <Award size={24} />
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase">Needs Focus</div>
            <div className="text-lg font-bold line-clamp-1">{weaknesses[0] || 'None detected!'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <div className="lg:col-span-1 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-6">Skill Profile</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--foreground)/0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--foreground)/0.1)', color: 'hsl(var(--foreground))' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-6">Recent History (Last 10 Tests)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--foreground)/0.5)" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--foreground)/0.5)" />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--foreground)/0.05)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--foreground)/0.1)', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-green-500">Core Strengths</h3>
          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="opacity-70">Complete more modules scoring 80%+ to build your strengths profile.</p>
          )}
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-red-500">Areas for Improvement</h3>
          {weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="opacity-70">Great job! No consistent weaknesses detected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
