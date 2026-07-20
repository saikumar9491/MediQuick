import React, { useState } from 'react';

export const ProductTabs = ({ medicine }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'uses', label: 'Uses & Benefits' },
    { id: 'howToUse', label: 'How to Use' },
    { id: 'safety', label: 'Safety Information' },
    { id: 'ingredients', label: 'Ingredients' }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'description':
        return medicine.description || 'No description available.';
      case 'uses':
        if (medicine.usesAndBenefits) return medicine.usesAndBenefits;
        return medicine.description 
          ? `Derived from description: ${medicine.description.slice(0, 300)}...`
          : 'Information not yet available for this product.';
      case 'howToUse':
        return medicine.howToUse || 'Information not yet available for this product.';
      case 'safety':
        return medicine.safetyInformation || 'Information not yet available for this product.';
      case 'ingredients':
        return medicine.ingredients || medicine.salt 
          ? `Active Ingredients: ${medicine.salt || medicine.ingredients}`
          : 'Information not yet available for this product.';
      default:
        return '';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-2xs">
      {/* Clean Tab Navigation (Underline style, transparent background, no box headers) */}
      <div className="flex border-b border-slate-100 bg-transparent px-4 sm:px-6 overflow-x-auto gap-4 sm:gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 text-[10px] font-medium uppercase tracking-widest border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8 text-sm text-slate-550 leading-relaxed min-h-[140px]">
        {getTabContent() === 'Information not yet available for this product.' ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-400">
            <span className="text-xl mb-1">🔬</span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Information not yet available for this product</p>
          </div>
        ) : (
          <div className="whitespace-pre-line font-normal text-slate-500 leading-relaxed">
            {getTabContent()}
          </div>
        )}
      </div>
    </div>
  );
};
