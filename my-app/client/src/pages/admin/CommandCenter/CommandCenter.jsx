import React, { useState, useEffect } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Import all 17 sub-components
import { AnnouncementsBanner } from './components/AnnouncementsBanner';
import { KPICards } from './components/KPICards';
import { TrendChart } from './components/TrendChart';
import { OrderStatusChart } from './components/OrderStatusChart';
import { TopProductsChart } from './components/TopProductsChart';
import { ZoneHeatmapWidget } from './components/ZoneHeatmapWidget';
import { RevenueBreakdown } from './components/RevenueBreakdown';
import { DeliveryPerformance } from './components/DeliveryPerformance';
import { RecentOrdersTable } from './components/RecentOrdersTable';
import { LowStockWidget } from './components/LowStockWidget';
import { ActivityFeed } from './components/ActivityFeed';
import { PendingComplaintsWidget } from './components/PendingComplaintsWidget';
import { PrescriptionApprovalsWidget } from './components/PrescriptionApprovalsWidget';
import { TopCustomersWidget } from './components/TopCustomersWidget';
import { SearchTrendsWidget } from './components/SearchTrendsWidget';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { SystemHealthStrip } from './components/SystemHealthStrip';

import { CommandCenterProvider } from './CommandCenterContext';
import ErrorBoundary from './ErrorBoundary';

const CommandCenter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Live clock every second
    return () => clearInterval(timer);
  }, []);

  return (
    <ErrorBoundary>
      <CommandCenterProvider>
      <div className="space-y-6 pb-12">
        {/* 1. Announcements Banner */}
        <AnnouncementsBanner />

        {/* 2. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Command Center</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Welcome back, Admin — here's what's happening today
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right hidden sm:block min-w-[120px]">
              <p className="text-sm font-bold text-slate-700">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs font-black text-blue-600">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="warning">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* 3. KPI Cards Row (Responsive Grid handled in component) */}
        <KPICards />

        {/* 4. Charts Row 1: Trends & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendChart />
          </div>
          <div className="lg:col-span-1">
            <OrderStatusChart />
          </div>
        </div>

        {/* 5. Charts Row 2: Top Products & Zone Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProductsChart />
          <ZoneHeatmapWidget />
        </div>

        {/* 6. Charts Row 3: Revenue Breakdown & Delivery Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueBreakdown />
          <DeliveryPerformance />
        </div>

        {/* 7. Recent Orders Table */}
        <RecentOrdersTable />

        {/* 8. Alerts & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LowStockWidget />
          <ActivityFeed />
        </div>

        {/* 9. Pending Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PendingComplaintsWidget />
          <PrescriptionApprovalsWidget />
        </div>

        {/* 10. Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCustomersWidget />
          <SearchTrendsWidget />
        </div>

        {/* 11. Quick Actions Panel */}
        <QuickActionsPanel />

        {/* 12. System Health Strip */}
        <SystemHealthStrip />
      </div>
    </CommandCenterProvider>
    </ErrorBoundary>
  );
};

export default CommandCenter;
