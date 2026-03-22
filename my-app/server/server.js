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

// 1. DYNAMIC CORS PROTOCOL
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5175', // Port for your current local session
  'http://localhost:3000',
  'https://mediquick-53b1.onrender.com', 
  'https://mediquick-1.onrender.com'      
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow internal server pings or Postman (where origin is undefined)
    if (!origin) return callback(null, true);
    
    const isWhitelisted = allowedOrigins.includes(origin);
    
    // Allow whitelisted in production, allow all in development
    if (isWhitelisted || process.env.NODE_ENV !== 'production') {
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

// --- NOTE: app.options('*') REMOVED to prevent the PathError crash in VS Code ---

// 2. MIDDLEWARE FOR DATA PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. STATIC STORAGE PROTOCOL
app.use('/uploads', express.static('uploads'));

// 4. MASTER HUB ROUTES
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
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    protocol: "Error-Log-Sync",
    stack: process.env.NODE_ENV === 'production' ? "🔒 Hidden" : err.stack,
  });
});

// 7. SERVER INITIALIZATION
const PORT = process.env.PORT || 5000; 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- PROTOCOL START ---`);
  console.log(`🚀 Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Server Port: ${PORT}`);
  console.log(`----------------------`);
  
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
  }
});