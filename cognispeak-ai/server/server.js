const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); // Load .env before other modules

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const speechRoutes = require('./routes/speech');
const grammarRoutes = require('./routes/grammar');
const readingRoutes = require('./routes/reading');
const emailRoutes = require('./routes/email');
const vocabRoutes = require('./routes/vocab');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/vocab', vocabRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cognispeak')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
