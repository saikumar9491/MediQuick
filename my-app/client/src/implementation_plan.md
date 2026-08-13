# Command Center Dashboard Implementation Plan

## Goal Description
Create a world‑class real‑time **Admin Command Center** for MediQuick. The page will display live operational data across the business using React, TailwindCSS, Recharts, Leaflet, Socket.IO and a Node/Express/MongoDB backend. All date handling must use the IST timezone (+05:30). The dashboard replaces the existing static admin view with a live, grid‑based layout that mirrors modern e‑commerce operational dashboards (Amazon, Blinkit, Zepto, Apollo 24|7).

## User Review Required
> [!IMPORTANT]
> This implementation introduces a brand‑new route, new backend endpoints, Socket.IO infrastructure, and several new UI components. Review the high‑level architecture and confirm acceptance before we commit to code changes.

## Open Questions
> [!WARNING]
> - **Authentication model**: Should the Command Center be protected by existing admin auth middleware, or does it need a dedicated role check?
> - **Socket.IO URL**: Is the client expected to connect to the same origin (`/socket.io`) or a separate sub‑domain?
> - **Deployment environment**: Are you using Vite for the frontend build? If so, ensure Vite proxy settings forward `/socket.io` to the Express server.
> - **Map provider token**: Leaflet can use OpenStreetMap tiles without a key, but do you require a specific tile provider (e.g., Mapbox) that needs an access token?

## Proposed Changes
---
### 1. Frontend Structure (`/client/src/pages/CommandCenter`)
- **CommandCenter.jsx** – top‑level page assembling all widgets, establishing Socket.IO connection via `useSocket` hook.
- **components/** – new folder containing individual widgets:
  - `KPICards.jsx`
  - `RevenueChart.jsx`
  - `LiveOrdersFeed.jsx`
  - `OrderStatusChart.jsx`
  - `SalesByCategoryChart.jsx`
  - `TopMedicines.jsx`
  - `DeliveryHeatmap.jsx`
  - `AIInsightsWidget.jsx`
  - `InventoryAlerts.jsx`
  - `RecentOrdersTable.jsx`
  - `CustomerActivityTimeline.jsx`
  - `NotificationsPanel.jsx`
  - `QuickActionsBar.jsx`
- **hooks/useSocket.js** – reusable hook that creates a Socket.IO client, exposes connection state (`connected`, `reconnecting`), and provides emit/listen helpers.
- **api/admin/stats.js** – wrappers around fetch calls for the REST endpoints (summary, revenue‑hourly, order‑status, etc.).

### 2. Backend Additions (`/server`)
- **server.js** – integrate Socket.IO (share same HTTP server), expose events:
  - `stats:update` (every 10 s)
  - `order:new`
  - `order:status-changed`
  - `notification:new`
  - `activity:new`
  - `inventory:alert`
- **routes/adminStats.js** – new Express router exposing:
  - `GET /api/admin/stats/summary`
  - `GET /api/admin/stats/revenue-hourly`
  - `GET /api/admin/stats/order-status`
  - `GET /api/admin/stats/revenue-by-category`
  - `GET /api/admin/stats/top-products`
  - `GET /api/admin/stats/zone-density`
  - `GET /api/admin/insights`
- **MongoDB aggregation pipelines** – all date transformations use IST timezone via `$dateToString` with `timezone: "+05:30"`.
- **Socket.IO emitters** – after each write operation (order create, status update, stock change, etc.) emit the appropriate real‑time events.

### 3. UI Design (Tailwind + Recharts + Leaflet)
- **Header** – live indicator, timestamp, refresh/export buttons, IST date display.
- **KPI Cards** – 8 cards, each with count‑up animation (use `react-countup`), sparkline (Recharts `LineChart` tiny), border colors.
- **RevenueChart** – `LineChart` with two series (today vs yesterday), area fill, tooltip.
- **LiveOrdersFeed** – vertical list, `framer-motion` slide‑down animation for new items.
- **OrderStatusChart** – horizontal bar chart (`BarChart`) with animated widths.
- **SalesByCategoryChart** – `PieChart`/`DonutChart` with legend, click handler to filter recent orders.
- **TopMedicines** – list with progress bar, toggle for range, restock button.
- **DeliveryHeatmap** – Leaflet map centered on India, circle markers sized by order volume, color‑coded urgency, popup details.
- **AIInsightsWidget** – rule‑based bullets rendered from `/api/admin/insights`.
- **InventoryAlerts** – tabbed view, flashing critical items, restock button.
- **RecentOrdersTable** – live‑updated rows, status dropdown, pagination.
- **CustomerActivityTimeline** – timeline list with colored dots, real‑time socket pushes.
- **NotificationsPanel** – slide‑in panel from right, badge count, `react-hot-toast` for toast alerts.
- **QuickActionsBar** – fixed bottom strip with icon buttons linking to admin routes.

### 4. Real‑Time Flow
1. On page mount, `useSocket` connects, emits `join:admin`.
2. Server sends `stats:update` → KPICards refresh.
3. Order events (`order:new`, `order:status-changed`) update LiveOrdersFeed, RecentOrdersTable, OrderStatusChart.
4. Inventory alerts stream to InventoryAlerts widget and toast notifications.
5. Activity events push to CustomerActivityTimeline.
6. Reconnection handling displays a yellow banner and falls back to polling every 30 s.

### 5. Verification Plan
- **Automated Tests** – unit tests for aggregation pipelines (Jest + Supertest). Mock dates to ensure IST calculations.
- **Manual Verification** – after deployment, open `/admin/command-center` and confirm:
  1. KPI numbers match MongoDB counts (run the three verification queries).
  2. Revenue chart shows at least one data point.
  3. Live Orders Feed displays a newly created order in real time.
  4. AI Insights list displays three real‑time bullets.
- **Performance** – ensure Socket.IO traffic stays under 200 KB/min for typical admin load.

---
**Next Steps**
- Await your approval of this implementation plan.
- Once approved, we will begin scaffolding the frontend route, backend sockets, and aggregation endpoints.
