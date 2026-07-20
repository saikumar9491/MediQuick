import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../../utils/apiConfig';

const CommandCenterContext = createContext();

export const useCommandCenter = () => useContext(CommandCenterContext);

export const CommandCenterProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('userToken');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [ordersRes, medicinesRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/orders`, config),
          axios.get(`${API_BASE}/api/medicines`),
          axios.get(`${API_BASE}/api/users`, config).catch(() => ({ data: [] }))
        ]);
        
        setOrders(ordersRes.data.data || ordersRes.data || []);
        setMedicines(medicinesRes.data.medicines || medicinesRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error("Error fetching command center data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CommandCenterContext.Provider value={{ orders, medicines, users, loading }}>
      {children}
    </CommandCenterContext.Provider>
  );
};
