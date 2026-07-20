import React, { useState } from 'react';
import { Map, Users, Clock, Home } from 'lucide-react';
import { ZonesTab } from './components/ZonesTab';
import { PartnersTab } from './components/PartnersTab';
import { SLATab } from './components/SLATab';
import { HubsTab } from './components/HubsTab';

const Logistics = () => {
  const [activeTab, setActiveTab] = useState('zones');

  const tabs = [
    { id: 'zones', label: 'Delivery Zones', icon: <Map className="w-4 h-4" /> },
    { id: 'hubs', label: 'Fulfillment Hubs', icon: <Home className="w-4 h-4" /> },
    { id: 'partners', label: 'Delivery Partners', icon: <Users className="w-4 h-4" /> },
    { id: 'sla', label: 'SLA Tracking', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Logistics Command Center</h1>
        <p className="text-slate-500 font-medium">Manage delivery zones, dispatch riders, and monitor SLA compliance.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-full sm:w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-bold text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px]">
        {activeTab === 'zones' && <ZonesTab />}
        {activeTab === 'hubs' && <HubsTab />}
        {activeTab === 'partners' && <PartnersTab />}
        {activeTab === 'sla' && <SLATab />}
      </div>
    </div>
  );
};

export default Logistics;
