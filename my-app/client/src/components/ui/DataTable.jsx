import React from 'react';
export const DataTable = ({ columns, data, keyField = 'id', emptyMessage = 'No records found.' }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 ${col.className || ''}`}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length > 0 ? data.map((row, i) => (
            <tr key={row[keyField] || i} className="hover:bg-slate-50/50 transition-colors">
              {columns.map((col, j) => (
                <td key={j} className={`px-6 py-4 ${col.cellClassName || ''}`}>
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
};
