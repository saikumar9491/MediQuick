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

// Load Env & Connect Database
dotenv.config();
connectDB();

const app = express();

/**
 * 1. DYNAMIC CORS PROTOCOL
 * Includes all possible local development ports and Render production URLs.
 */
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5175', 
  'http://localhost:3000',
  'https://mediquick-53b1.onrender.com', 
  'https://mediquick-1.onrender.com'      
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow internal server pings, Postman, or mobile apps (where origin is undefined)
    if (!origin) return callback(null, true);
    
    const isWhitelisted = allowedOrigins.includes(origin);
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // 2. Logic: Allow if whitelisted OR if we are in local development mode
    if (isWhitelisted || isDevelopment) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked an unauthorized origin: ${origin}`);
      callback(new Error('CORS Policy: Access Denied'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// 2. MIDDLEWARE FOR DATA PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. STATIC STORAGE PROTOCOL (For medicine and prescription images)
app.use('/uploads', express.static('uploads'));

/**
 * 4. MASTER HUB ROUTES
 * Ensure these match your actual folder structure in the 'routes' directory.
 */
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
 * KEEP-ALIVE PROTOCOL
 * Prevents Render's free tier from putting the server to sleep.
 */
const keepAlive = () => {
  const url = `https://mediquick-53b1.onrender.com/`; 
  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log(`📡 Heartbeat: Pulse Received [Status: ${response.status}]`);
    } catch (err) {
      console.error('❌ Heartbeat Interrupted:', err.message);
    }
  }, 840000); // 14 minutes
};

// 6. GLOBAL ERROR SHIELD
app.use((err, req, res, next) => {
  // If the error was a CORS error, status might already be set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    protocol: "Error-Log-Sync",
    // Hide stack trace in production for security
    stack: process.env.NODE_ENV === 'production' ? "🔒 Hidden" : err.stack,
  });
});

// 7. SERVER INITIALIZATION
const PORT = process.env.PORT || 5000; 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- PROTOCOL START ---`);
  console.log(`🚀 Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Server Port: ${PORT}`);
  console.log(`🛡️  CORS Mode: ${process.env.NODE_ENV !== 'production' ? 'Open (Dev)' : 'Restricted (Prod)'}`);
  console.log(`----------------------`);
  
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
  }
});