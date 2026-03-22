import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
connectDB();

const app = express();

// 1. DYNAMIC CORS PROTOCOL
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://mediquick-1.onrender.com' // YOUR FRONTEND URL
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow internal server-to-server or Postman requests (no origin)
    if (!origin) return callback(null, true);
    
    // 2. Dynamic check
    const isAllowed = allowedOrigins.some(authOrigin => origin.startsWith(authOrigin));
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked an unauthorized origin: ${origin}`);
      callback(new Error('CORS Policy: Access Denied'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Added for extra safety with JWT
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

// API ROUTES
app.use('/api/users', userRoutes); 
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/cart', cartRoutes);

// 5. CLOUD HEALTH MONITOR
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Active",
    hub: "Amritsar Hub-01",
    message: "🚀 MediQuick+ Satellite Link Established",
    timestamp: new Date().toISOString()
  });
});

/**
 * SELF-PING PROTOCOL
 * Automatically wakes up the server if it's on Render Free Tier
 */
const keepAlive = () => {
  // Use the environment variable if available, otherwise fallback to hardcoded
  const url = process.env.BACKEND_URL || `https://mediquick-53b1.onrender.com/`; 
  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log(`📡 Heartbeat: Pulse Received [Status: ${response.status}]`);
    } catch (err) {
      console.error('❌ Heartbeat Interrupted:', err.message);
    }
  }, 840000); // 14 Minutes
};

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    protocol: "Error-Log-Sync",
    stack: process.env.NODE_ENV === 'production' ? "🔒 Hidden" : err.stack,
  });
});

const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => { // Explicitly bind to 0.0.0.0 for Render
  console.log(`--- HUB ONLINE ---`);
  console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Port: ${PORT}`);
  
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
  }
});