import React from 'react';

const UNITS = [
  'Tablet',
  'Capsule',
  'Bottle',
  'ml',
  'gm',
  'kg',
  'Pack',
  'Strip',
  'Tube',
  'Device'
];

const PricingStockSection = ({ formData, onChange, errors }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Stock</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price (MRP) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => onChange('price', e.target.value)}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.price ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Discounted Price (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => onChange('discountPrice', e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={formData.countInStock}
                  onChange={(e) => onChange('countInStock', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors ${errors.countInStock ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="0"
                />
                {errors.countInStock && <p className="mt-1 text-sm text-red-500">{errors.countInStock}</p>}
              </div>
              <select
                value={formData.unit}
                onChange={(e) => onChange('unit', e.target.value)}
                className="w-32 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) => onChange('lowStockThreshold', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
              placeholder="10"
            />
            <p className="mt-1 text-xs text-slate-500">Alerts you when stock drops below this number</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingStockSection;
