import { useCommandCenter } from '../CommandCenterContext';
import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const AnnouncementsBanner = () => {
  const { insights } = useCommandCenter();
  const [dismissed, setDismissed] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Generate notification list from both hardcoded system updates and dynamic AI insights
    const systemAlerts = [
      { id: 'sys-1', type: 'info', message: 'System maintenance scheduled for tonight at 2:00 AM IST.' }
    ];

    const dynamicInsights = (insights || []).map((ins, index) => {
      // Decide styling type based on content keywords
      let type = 'info';
      if (ins.text.includes('low in stock') || ins.text.includes('abandoned')) {
        type = 'warning';
      } else if (ins.text.includes('lower than')) {
        type = 'critical';
      }

      return {
        id: `insight-${index}`,
        type,
        message: ins.text
      };
    });

    setItems([...dynamicInsights, ...systemAlerts]);
  }, [insights]);

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id]);
  };

  const getVariantStyles = (type) => {
    switch(type) {
      case 'warning': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'critical': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const visibleItems = items.filter(item => !dismissed.includes(item.id));

  if (visibleItems.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-in fade-in duration-500 slide-in-from-top-4">
      {visibleItems.map(item => (
        <div 
          key={item.id} 
          className={`flex items-start justify-between p-4 border rounded-xl shadow-sm ${getVariantStyles(item.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(item.type)}
            <p className="text-sm font-bold mt-0.5">{item.message}</p>
          </div>
          <button 
            onClick={() => handleDismiss(item.id)}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
};
