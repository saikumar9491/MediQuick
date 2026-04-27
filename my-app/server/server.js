import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

// Route Imports
import userRoutes from './routes/userRoutes.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// ⚙️ INITIALIZATION
dotenv.config();

const app = express();

// --- Serverless Database Connection Middleware ---
app.use(async (req, res, next) => {
  try {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState !== 1) {
      console.log('📡 Re-establishing Hub Link...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('🛰️ Satellite Link Failure:', error);
    res.status(503).json({ 
      status: "Offline", 
      message: "Amritsar Hub is temporarily unreachable. Please try again." 
    });
  }
});

/**
 * 1. DYNAMIC CORS PROTOCOL
 * Includes local development ports and production URLs.
 */
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5175', 
  'http://localhost:3000',
  'https://mediquick-53b1.onrender.com', 
  'https://mediquick-1.onrender.com',
  'https://server-wheat-nine-72.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    
    const isWhitelisted = allowedOrigins.includes(origin);
    const isDevelopment = process.env.NODE_ENV !== 'production';

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

/**
 * 2. CORE MIDDLEWARE
 */
app.use(express.json({ limit: '10mb' })); // Increased limit for prescription uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder for Image storage
// NOTE: On Vercel (serverless), the filesystem is read-only.
// Uploaded files via multer will NOT persist between requests.
// For production file storage, use Cloudinary or AWS S3.
app.use('/uploads', express.static('uploads'));

/**
 * 3. MASTER HUB ROUTES
 */
app.use('/api/users', userRoutes); 
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/cart', cartRoutes);

/**
 * 4. CLOUD HEALTH MONITOR
 */
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Active",
    hub: "Amritsar Hub-01",
    platform: process.env.VERCEL ? "Vercel Serverless" : "Persistent Server",
    message: "🚀 MediQuick+ Satellite Link Established",
    timestamp: new Date().toISOString()
  });
});

/**
 * 4.5. SYSTEM DEBUG PROTOCOL
 */
app.get('/debug', (req, res) => {
  res.status(200).json({
    dbState: mongoose.connection.readyState,
    status: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    env: process.env.NODE_ENV,
    hasMongoUri: !!(process.env.MONGODB_URI || process.env.MONGO_URI),
    uriStart: (process.env.MONGODB_URI || process.env.MONGO_URI || "").substring(0, 20) + "..."
  });
});

/**
 * 5. KEEP-ALIVE PROTOCOL
 * Pings the server every 14 minutes to prevent Render sleep mode.
 * Only runs in a persistent server environment (not Vercel serverless).
 */
const keepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || `https://mediquick-53b1.onrender.com/`; 
  
  setInterval(async () => {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`📡 Heartbeat: Pulse Received [Status: ${response.status}]`);
    } catch (err) {
      console.error('❌ Heartbeat Interrupted:', err.message);
    }
  }, 840000); // 14 minutes
};

/**
 * 6. FALLBACK ROUTE (404)
 * Catch-all for undefined routes to provide better diagnostic feedback.
 */
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `🛰️ Route Not Found: [${req.method}] ${req.originalUrl}`,
    suggestion: "Check API documentation or verify the endpoint path."
  });
});

/**
 * 7. GLOBAL ERROR SHIELD
 */
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    protocol: "Error-Log-Sync",
    stack: process.env.NODE_ENV === 'production' ? "🔒 Hidden" : err.stack,
  });
});

/**
 * 7. SERVER STARTUP
 * When running locally (not on Vercel), start a persistent HTTP server.
 * On Vercel, the app is exported and used as a serverless handler.
 */
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  const PORT = process.env.PORT || 5000; 
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- PROTOCOL START ---`);
    console.log(`🚀 Hub Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Satellite Port: ${PORT}`);
    console.log(`🛡️  Security Mode: ${process.env.NODE_ENV !== 'production' ? 'Open (Dev)' : 'Shielded (Prod)'}`);
    console.log(`----------------------`);
    
    if (process.env.NODE_ENV === 'production') {
      keepAlive();
    }
  });
}

// Export the app for Vercel serverless usage
export default app;