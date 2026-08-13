import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../../utils/apiConfig';
import { useSocket } from '../../../hooks/useSocket';
import toast from 'react-hot-toast';

const CommandCenterContext = createContext();

export const useCommandCenter = () => useContext(CommandCenterContext);

export const CommandCenterProvider = ({ children }) => {
  const [summary, setSummary] = useState({
    liveOrders: 0,
    revenueToday: 0,
    activeUsers: 0,
    activeCarts: 0,
    pendingOrders: 0,
    outForDelivery: 0,
    cancelledToday: 0,
    avgRating: 0
  });
  
  const [hourlyRevenue, setHourlyRevenue] = useState({ today: [], yesterday: [] });
  const [orderStatus, setOrderStatus] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [zoneDensity, setZoneDensity] = useState([]);
  const [insights, setInsights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Connect to Socket.IO, passing 'admin' room
  const { connected, socket } = useSocket('admin');

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const [
        summaryRes,
        hourlyRes,
        statusRes,
        categoryRes,
        productsRes,
        zoneRes,
        insightsRes,
        ordersRes,
        medicinesRes
      ] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/stats/summary`, config),
        axios.get(`${API_BASE}/api/admin/stats/revenue-hourly`, config),
        axios.get(`${API_BASE}/api/admin/stats/order-status`, config),
        axios.get(`${API_BASE}/api/admin/stats/revenue-by-category`, config),
        axios.get(`${API_BASE}/api/admin/stats/top-products`, config),
        axios.get(`${API_BASE}/api/admin/stats/zone-density`, config),
        axios.get(`${API_BASE}/api/admin/stats/insights`, config),
        axios.get(`${API_BASE}/api/orders`, config),
        axios.get(`${API_BASE}/api/medicines`)
      ]);

      setSummary(summaryRes.data);
      setHourlyRevenue(hourlyRes.data);
      setOrderStatus(statusRes.data);
      setRevenueByCategory(categoryRes.data);
      setTopProducts(productsRes.data);
      setZoneDensity(zoneRes.data);
      setInsights(insightsRes.data);
      setRecentOrders(ordersRes.data.data || ordersRes.data || []);
      setMedicines(medicinesRes.data.medicines || medicinesRes.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('stats:update', (data) => {
      setSummary(prev => ({
        ...prev,
        liveOrders: data.liveOrders,
        pendingOrders: data.pendingOrders,
        outForDelivery: data.outForDelivery
      }));
    });

    socket.on('order:new', (order) => {
      // Increment live stats
      setSummary(prev => ({
        ...prev,
        liveOrders: prev.liveOrders + 1,
        revenueToday: prev.revenueToday + order.totalAmount,
        pendingOrders: prev.pendingOrders + 1
      }));

      // Prepend to recentOrders list
      setRecentOrders(prev => [order, ...prev].slice(0, 10));

      // Trigger Toast notification
      toast.success(`🎉 New Order Placed: Order #${order._id} for ₹${order.totalAmount}`, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#1E293B',
          color: '#FFF',
          fontWeight: 'bold',
          border: '1px solid #10B981'
        }
      });

      // Update Top Products and hourly stats on new order
      fetchAllData();
    });

    socket.on('order:status-changed', (order) => {
      // Update in recentOrders list
      setRecentOrders(prev => prev.map(o => o._id === order._id ? order : o));

      toast.info(`ℹ️ Order #${order._id} moved to ${order.status}`, {
        duration: 4000,
        position: 'top-right'
      });
      
      fetchAllData();
    });

    socket.on('activity:new', (activity) => {
      setActivities(prev => {
        const id = Math.random().toString(36).substring(2, 9);
        const newEvent = {
          id,
          type: activity.type || 'info',
          title: activity.text,
          time: new Date(activity.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
          }),
          desc: activity.text
        };
        return [newEvent, ...prev].slice(0, 50);
      });
    });

    socket.on('inventory:alert', (alert) => {
      toast.error(`⚠️ Low Stock Alert: "${alert.name}" has only ${alert.stock} units left!`, {
        duration: 6000,
        position: 'top-right'
      });
      // Refresh top products or medicines list
      fetchAllData();
    });

    return () => {
      socket.off('stats:update');
      socket.off('order:new');
      socket.off('order:status-changed');
      socket.off('activity:new');
      socket.off('inventory:alert');
    };
  }, [socket]);

  return (
    <CommandCenterContext.Provider value={{
      summary,
      hourlyRevenue,
      orderStatus,
      revenueByCategory,
      topProducts,
      zoneDensity,
      insights,
      activities,
      recentOrders,
      medicines,
      loading,
      connected,
      refresh: fetchAllData
    }}>
      {children}
    </CommandCenterContext.Provider>
  );
};
