import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
connectDB();

const app = express();

// 1. SECURITY & PARSING MIDDLEWARE
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000',
  'https://mediquick-53b1.onrender.com', // Backend
  'https://mediquick-1.onrender.com'      // Frontend
];

app.use(cors({
  origin: function (origin, callback) {
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. STATIC FILES
// This allows your frontend to view uploaded prescriptions via URL
app.use('/uploads', express.static('uploads'));

// 3. API ROUTES
app.use('/api/users', userRoutes); 
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/cart', cartRoutes);

// 4. HEALTH CHECK
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Healthy",
    message: "🚀 MediQuick+ API is running and healthy on the cloud!",
    timestamp: new Date().toISOString()
  });
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});