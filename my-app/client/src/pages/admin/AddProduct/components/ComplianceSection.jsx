import React from 'react';

const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Cream',
  'Ointment',
  'Injection',
  'Drops',
  'Powder',
  'Device',
  'Other'
];

const ComplianceSection = ({ formData, onChange, errors }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Regulatory & Compliance</h2>
      
      <div className="space-y-6">
        {/* Prescription Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <h3 className="text-sm font-medium text-slate-900">Requires Prescription <span className="text-red-500">*</span></h3>
            <p className="text-xs text-slate-500 mt-1">Users will be required to upload a valid prescription to purchase this item.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.needsRx}
              onChange={(e) => onChange('needsRx', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dosage Form
            </label>
            <select
              value={formData.dosageForm}
              onChange={(e) => onChange('dosageForm', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {DOSAGE_FORMS.map(form => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Strength / Dosage
            </label>
            <input
              type="text"
              value={formData.strength}
              onChange={(e) => onChange('strength', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
              placeholder="e.g. 500mg, 5% w/w"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Batch Number
            </label>
            <input
              type="text"
              value={formData.batchNumber}
              onChange={(e) => onChange('batchNumber', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
              placeholder="e.g. BATCH-A1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Manufacturing Date
            </label>
            <input
              type="date"
              value={formData.manufacturingDate}
              onChange={(e) => onChange('manufacturingDate', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => onChange('expiryDate', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.expiryDate ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSection;
