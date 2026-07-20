const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'client', 'src');
const UI_DIR = path.join(SRC, 'components', 'ui');
const CMD_DIR = path.join(SRC, 'pages', 'admin', 'CommandCenter');
const COMP_DIR = path.join(CMD_DIR, 'components');

[UI_DIR, CMD_DIR, COMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const uiComponents = {
  'Card.jsx': `import React from 'react';
export const Card = ({ children, className = '' }) => (
  <div className={\`bg-white rounded-xl shadow-sm border border-slate-200 \${className}\`}>
    {children}
  </div>
);`,

  'Badge.jsx': `import React from 'react';
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-orange-50 text-orange-600 border-orange-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    secondary: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return (
    <span className={\`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border \${variants[variant]} \${className}\`}>
      {children}
    </span>
  );
};`,

  'Button.jsx': `import React from 'react';
export const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '' }) => {
  const base = "inline-flex items-center justify-center font-bold transition-all rounded-lg";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
  };
  return (
    <button onClick={onClick} className={\`\${base} \${sizes[size] || sizes.md} \${variants[variant] || variants.primary} \${className}\`}>
      {children}
    </button>
  );
};`,

  'DataTable.jsx': `import React from 'react';
export const DataTable = ({ columns, data, keyField = 'id', emptyMessage = 'No records found.' }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={\`px-6 py-4 \${col.className || ''}\`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length > 0 ? data.map((row, i) => (
            <tr key={row[keyField] || i} className="hover:bg-slate-50/50 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className={\`px-6 py-4 \${col.cellClassName || ''}\`}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};`
};

for (const [name, content] of Object.entries(uiComponents)) {
  fs.writeFileSync(path.join(UI_DIR, name), content);
}

const widgets = [
  'AnnouncementsBanner', 'KPICards', 'TrendChart', 'OrderStatusChart', 'TopProductsChart', 
  'ZoneHeatmapWidget', 'RevenueBreakdown', 'DeliveryPerformance', 'RecentOrdersTable', 
  'LowStockWidget', 'ActivityFeed', 'PendingComplaintsWidget', 'PrescriptionApprovalsWidget', 
  'TopCustomersWidget', 'SearchTrendsWidget', 'QuickActionsPanel', 'SystemHealthStrip'
];

widgets.forEach(widget => {
  const content = `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../../components/ui/Card';
import { RefreshCw } from 'lucide-react';

export const ${widget} = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Connect real endpoint
        // const response = await axios.get('/api/admin/stats/placeholder');
        await new Promise(res => setTimeout(res, 600)); // Mock delay
        setData({ mock: true });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="h-48 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-black text-slate-800 mb-4">${widget}</h3>
      <p className="text-xs text-slate-500">Component scaffolded successfully. Data loaded.</p>
    </Card>
  );
};
`;
  fs.writeFileSync(path.join(COMP_DIR, `${widget}.jsx`), content);
});

console.log("Scaffolding complete!");
