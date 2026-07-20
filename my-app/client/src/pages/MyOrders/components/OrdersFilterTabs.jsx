import React from 'react';

const Tabs = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' }
];

const OrdersFilterTabs = ({ activeTab, onTabSelect }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-150">
      {Tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabSelect(tab.id)}
          className={`px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrdersFilterTabs;
