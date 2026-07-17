import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Activity, Zap, Award, ArrowDown, ArrowUp, Clock, FileText, Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../utils/apiConfig';

// ================= SPLINE CHART (2010 - 2016) =================
const SplineChart = () => {
  const data = [
    { label: "2010", val: 50 },
    { label: "2011", val: 30 },
    { label: "2012", val: 100 },
    { label: "2013", val: 75 },
    { label: "2014", val: 175 },
    { label: "2015", val: 60 },
    { label: "2016", val: 95 }
  ];

  const points = data.map((d, i) => {
    const x = 40 + (i / 6) * 420;
    const y = 140 - (d.val / 200) * 110;
    return { x, y };
  });
  
  let dPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  return (
    <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const y = 30 + r * 100;
        const val = Math.round(200 - r * 200);
        return (
          <g key={i}>
            <line x1="40" y1={y} x2="480" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <text x="32" y={y + 3.5} textAnchor="end" className="text-[10px] font-bold fill-slate-500">{val}</text>
          </g>
        );
      })}
      <path d={dPath} fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-[#0F766E] stroke-[2px] transition-all hover:r-5 cursor-pointer" />
          <title>{`${data[i].label}: ${data[i].val}`}</title>
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={40 + (i / 6) * 420} y="162" textAnchor="middle" className="text-[10.5px] font-bold fill-slate-500">{d.label}</text>
      ))}
    </svg>
  );
};

// ================= SPARKLINE CHARTS =================
const SparklineOrange = () => (
  <svg viewBox="0 0 100 30" className="w-full h-9 overflow-visible">
    <path d="M0,25 Q15,5 30,22 T60,2 T90,20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="90" cy="20" r="2.5" fill="#FFFFFF" />
  </svg>
);

const SparklineBlue = () => (
  <svg viewBox="0 0 100 30" className="w-full h-9 overflow-visible">
    <path d="M0,15 Q15,28 30,5 T60,22 T90,12" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
    <circle cx="90" cy="12" r="2.5" fill="#0F766E" />
  </svg>
);

const AdminCommandCenter = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy products", done: false, time: "8 mins left" },
    { id: 2, text: "Reply to emails", done: false, time: "" },
    { id: 3, text: "Write blog post", done: false, time: "20 hours left" },
    { id: 4, text: "Wash my car", done: true, time: "" },
    { id: 5, text: "Buy antivirus", done: false, time: "" },
    { id: 6, text: "Jane's Happy Birthday", done: false, time: "" }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, done: false, time: "" }]);
    setNewTaskText("");
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-xs text-[#1F2937]">
      {/* Header info */}
      <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Command Center</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Control Hub / Main</p>
        </div>
      </div>

      {/* Group 1: 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Revenue Today */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">256</h3>
            <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-teal-50 text-[8px] font-black text-teal-600 uppercase tracking-wider">Revenue Today</span>
          </div>
          <div className="h-12 w-12 bg-teal-50 rounded-xl text-teal-600 flex items-center justify-center">
            <Leaf className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Stock Index */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">8451</h3>
            <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-blue-50 text-[8px] font-black text-blue-600 uppercase tracking-wider">20% Stock</span>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-xl text-blue-600 flex items-center justify-center">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: New Customer */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">31%</h3>
            <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-rose-50 text-[8px] font-black text-rose-600 uppercase tracking-wider">New 20% Customer</span>
          </div>
          <div className="h-12 w-12 bg-rose-50 rounded-xl text-rose-500 flex items-center justify-center">
            <Zap className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Profit */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-none">158</h3>
            <span className="inline-block mt-2.5 px-2 py-0.5 rounded bg-orange-50 text-[8px] font-black text-orange-600 uppercase tracking-wider">₹145 Profit</span>
          </div>
          <div className="h-12 w-12 bg-orange-50 rounded-xl text-orange-500 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Group 2: Visitors & Earnings + Statistics Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Unique Visitors & Monthly Earnings */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Unique Visitors</span>
            <div className="flex items-center gap-2 mt-1">
              <h4 className="text-2xl font-black text-slate-800">652</h4>
              <ArrowDown className="h-4.5 w-4.5 text-rose-500" />
            </div>
            <span className="block text-[9px] text-slate-400 font-bold tracking-wide mt-1.5">36% From Last 6 Months</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Monthly Earnings</span>
            <div className="flex items-center gap-2 mt-1">
              <h4 className="text-2xl font-black text-slate-800">5963</h4>
              <ArrowUp className="h-4.5 w-4.5 text-emerald-500" />
            </div>
            <span className="block text-[9px] text-slate-400 font-bold tracking-wide mt-1.5">36% From Last 6 Months</span>
          </div>
        </div>

        {/* Right Column: Statistics splined spline chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Statistics</h4>
          </div>
          <div className="h-36 w-full mt-2">
            <SplineChart />
          </div>
        </div>
      </div>

      {/* Group 3: 2x2 grid stats + sparklines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2x2 Grid block */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm lg:col-span-2 grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] border-collapse">
          {/* Top Left */}
          <div className="p-4 flex items-start gap-4">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 border border-rose-100">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-black">₹1584.78</h5>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Earned this month</span>
            </div>
          </div>

          {/* Top Right */}
          <div className="p-4 flex items-start gap-4">
            <div className="p-2.5 bg-orange-50 rounded-xl text-[#F97316] border border-orange-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-black">152 Hours</h5>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spent this month</span>
            </div>
          </div>

          {/* Bottom Left */}
          <div className="p-4 flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500 border border-purple-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-black">54 Tasks</h5>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed this month</span>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="p-4 flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-[#22C55E] border border-emerald-100">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-black">6 Projects</h5>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Done this month</span>
            </div>
          </div>
        </div>

        {/* Sparkline cards */}
        <div className="grid grid-cols-2 gap-6 lg:col-span-1">
          {/* Month Sales Sparkline */}
          <div className="bg-[#0F766E] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-teal-100 uppercase tracking-wider block">Month sales</span>
              <h4 className="text-xl font-black mt-1">2362</h4>
            </div>
            <div className="mt-3">
              <SparklineOrange />
            </div>
          </div>

          {/* Products Sparkline */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Products</span>
              <h4 className="text-xl font-black text-slate-800 mt-1">985</h4>
            </div>
            <div className="mt-3">
              <SparklineBlue />
            </div>
          </div>
        </div>
      </div>

      {/* Group 4: Bottom checklists & logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks checklist */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Tasks</h4>
              <span className="text-[10px] text-teal-600 font-black cursor-pointer hover:underline">SHOW MORE</span>
            </div>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between text-xs font-semibold">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => handleToggleTask(t.id)}
                      className="rounded border-[#E5E7EB] text-teal-600 focus:ring-teal-500"
                    />
                    <span className={t.done ? "line-through text-slate-400 font-medium" : "text-slate-700"}>{t.text}</span>
                  </label>
                  {t.time && (
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-[9px] font-black text-teal-600 uppercase border border-teal-100">{t.time}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2.5 mt-5 pt-4 border-t border-slate-100">
            <input
              type="text"
              required
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Type your task..."
              className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] transition-colors">ADD</button>
          </form>
        </div>

        {/* Customer details log */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Customer details</h4>
            <div className="flex gap-3 text-[10px] font-black">
              <span className="text-slate-400 cursor-pointer">SALE STATS</span>
              <span className="text-teal-600 border-b-2 border-teal-600 pb-2.5 cursor-pointer">LATEST SALES</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[260px] overflow-y-auto custom-scrollbar">
            {[
              { name: "John Deo", time: "12 hour", desc: "[#1183] Workaround for OS X selects printing bug", sub: "Chrome fixed the bug several versions ago, thus rendering this..." },
              { name: "James Win", time: "16 hour", desc: "[#1249] Vertically center carousel controls", sub: "Try any carousel control and reduce the screen width below..." },
              { name: "Jems William", time: "40 hour", desc: "[#1254] Inaccurate small pagination height", sub: "The height of pagination elements is not consistent with..." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-slate-50 text-slate-700 font-bold border border-slate-200 flex items-center justify-center uppercase text-[10px] flex-shrink-0">
                  {item.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.time}</span>
                  </div>
                  <p className="font-black text-slate-700 mt-1 truncate">{item.desc}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg font-bold uppercase tracking-wider text-[9px] mt-4 border border-slate-200 transition-colors">
            SHOW MORE
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCommandCenter;
