import React from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Earnings', value: '$1,280', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Total Bookings', value: '48', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-100' },
  { label: 'New Clients', value: '12', icon: Users, color: 'text-secondary-600', bg: 'bg-secondary-100' },
  { label: 'Growth', value: '+15%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function ProviderDashboard() {
  return (
    <div className="pt-24 pb-20 px-6 bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Provider Dashboard</h1>
            <p className="text-slate-500">Welcome back, John! Here's how your business is doing.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add New Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Requests */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Recent Requests</h3>
              <button className="text-primary-600 font-bold text-sm">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((req) => (
                <div key={req} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">JD</div>
                    <div>
                      <p className="font-bold text-slate-900">Jane Doe</p>
                      <p className="text-xs text-slate-500">Home Cleaning • 2h ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all">Accept</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Your Services</h3>
              <button className="text-primary-600 font-bold text-sm">Manage</button>
            </div>
            <div className="p-6 space-y-6">
              {[
                { name: 'Home Cleaning', price: '$49.99', status: 'Active' },
                { name: 'Deep AC Repair', price: '$80.00', status: 'Active' },
              ].map((service) => (
                <div key={service.name} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
                    <div>
                      <p className="font-bold text-slate-900">{service.name}</p>
                      <p className="text-xs text-slate-500">{service.price}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
