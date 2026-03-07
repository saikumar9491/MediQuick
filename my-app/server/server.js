import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';

// 1. Load Environment Variables FIRST
dotenv.config();

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. --- DYNAMIC CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://mediquick-53b1.onrender.com', // Backend
  'https://mediquick-1.onrender.com'      // Frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked an origin: ${origin}`);
      return callback(new Error('CORS Policy: This origin is not allowed'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 4. --- MIDDLEWARE ---
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true })); // Allows URL-encoded data

// 5. --- API ROUTES ---
app.use('/api/users', userRoutes); 
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// 6. --- HEALTH CHECK / ROOT ROUTE ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Healthy",
    message: "🚀 MediQuick+ API is running and healthy on the cloud!",
    timestamp: new Date().toISOString()
  });
});

// 7. --- GLOBAL ERROR HANDLER (Bonus for unique apps) ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 8. --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  🔗 Local: http://localhost:${PORT}
  🌟 Mode: ${process.env.NODE_ENV || 'development'}
  `);
});