import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { PlusCircle, Zap, Bell, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActionsPanel = () => {
  const actions = [
    { 
      title: 'Add Product', 
      icon: <PlusCircle className="h-5 w-5" />, 
      path: '/admin/add-product', 
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200' 
    },
    { 
      title: 'Create Flash Sale', 
      icon: <Zap className="h-5 w-5" />, 
      path: '/admin/flash-deals', 
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-200' 
    },
    { 
      title: 'Send Notification', 
      icon: <Bell className="h-5 w-5" />, 
      path: '/admin/notifications', 
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-200' 
    },
    { 
      title: 'Support Console', 
      icon: <LifeBuoy className="h-5 w-5" />, 
      path: '/admin/support', 
      color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-200' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {actions.map((action, idx) => (
        <Link key={idx} to={action.path}>
          <Card className={`p-4 flex flex-col items-center justify-center text-center transition-all border border-transparent cursor-pointer h-full ${action.color}`}>
            <div className="mb-2">
              {action.icon}
            </div>
            <span className="text-xs font-black tracking-wide">{action.title}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
};
