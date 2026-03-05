import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; 
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';

dotenv.config();

// Connect to MongoDB using the updated Atlas URI
connectDB();

const app = express();

// --- DYNAMIC CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://mediquick-53b1.onrender.com', // Your backend URL
  // --- ADD YOUR NEW FRONTEND RENDER LINK BELOW ---
  'https://mediquick-1.onrender.com' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); 

// API Routes
app.use('/api/users', userRoutes); 
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Health Check / Root Route
app.get('/', (req, res) => {
  res.send('🚀 MediQuick+ API is running and healthy on the cloud!');
});

// Use the PORT from environment variables (important for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));