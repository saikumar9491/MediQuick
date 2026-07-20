import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  const { default: User } = await import('./models/User.js');
  const user = await User.findOne({ email: 'balisaikumar9491@gmail.com' });

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  try {
    console.log('Testing Razorpay order creation for amount ₹399...');
    const res = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount: 399
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('RESULT: Success! Razorpay order created:', res.data);
  } catch (err) {
    console.error('API Call Status:', err.response?.status);
    console.error('API Call Data:', err.response?.data);
  }

  await mongoose.disconnect();
};

run();
