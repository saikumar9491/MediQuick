import React from 'react';

const MedicalDetailsSection = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Medical & Pharmacy Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Uses & Benefits
          </label>
          <textarea
            value={formData.usesAndBenefits || ''}
            onChange={(e) => onChange('usesAndBenefits', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-y text-sm"
            placeholder="Key uses and clinical benefits..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            How to Use
          </label>
          <textarea
            value={formData.howToUse || ''}
            onChange={(e) => onChange('howToUse', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-y text-sm"
            placeholder="Dosage, frequency, and administrative instructions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Safety Information & Storage Warnings
          </label>
          <textarea
            value={formData.safetyInformation || ''}
            onChange={(e) => onChange('safetyInformation', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-y text-sm"
            placeholder="Contraindications, side effects, precautions, and storage guidelines..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ingredients & Active Composition
          </label>
          <textarea
            value={formData.ingredients || ''}
            onChange={(e) => onChange('ingredients', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-y text-sm"
            placeholder="Detailed salt breakdown and inactive ingredients..."
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsSection;
