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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Product Tagline / Short Descriptor
          </label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors text-sm"
            placeholder="e.g., Dermatologist Recommended, Non-drowsy formulation, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Display Attributes (Max 2 for card rendering)
          </label>
          <p className="text-xs text-slate-400 mb-2">Provide key-value pairs appropriate for this product type (e.g. Skin Type: All, SPF: 50, Dosage: 1 Tablet, Strength: 650mg).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((index) => {
              const attr = (formData.displayAttributes && formData.displayAttributes[index]) || { label: '', value: '' };
              return (
                <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Label (e.g. SPF)"
                      value={attr.label || ''}
                      onChange={(e) => {
                        const nextAttrs = [...(formData.displayAttributes || [{ label: '', value: '' }, { label: '', value: '' }])];
                        nextAttrs[index] = { ...nextAttrs[index], label: e.target.value };
                        onChange('displayAttributes', nextAttrs);
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. 50+)"
                      value={attr.value || ''}
                      onChange={(e) => {
                        const nextAttrs = [...(formData.displayAttributes || [{ label: '', value: '' }, { label: '', value: '' }])];
                        nextAttrs[index] = { ...nextAttrs[index], value: e.target.value };
                        onChange('displayAttributes', nextAttrs);
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Key Features / Bullet Points (Max 3)
          </label>
          <p className="text-xs text-slate-400 mb-2">Provide brief, high-impact descriptors (e.g. Lightweight, Non-Sticky, For All Skin Types).</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => {
              const feats = formData.keyFeatures || ['', '', ''];
              return (
                <input
                  key={index}
                  type="text"
                  placeholder={`Feature Bullet ${index + 1}`}
                  value={feats[index] || ''}
                  onChange={(e) => {
                    const nextFeats = [...(formData.keyFeatures || ['', '', ''])];
                    nextFeats[index] = e.target.value;
                    onChange('keyFeatures', nextFeats);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsSection;
