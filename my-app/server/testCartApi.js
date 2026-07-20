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
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  const { default: User } = await import('./models/User.js');
  const { default: Medicine } = await import('./models/Medicine.js');

  const user = await User.findOne({ email: 'balisaikumar9491@gmail.com' });
  const med = await Medicine.findOne({ name: /Pilgrim Tea Tree/i });

  if (!user || !med) {
    console.error('User or product not found');
    process.exit(1);
  }

  console.log(`Using User: ${user.email} (${user._id})`);
  console.log(`Using Product: ${med.name} (${med._id}) - Stock: ${med.countInStock}, Active: ${med.isActive}`);

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  try {
    console.log('\nTesting POST /api/cart/items...');
    const res = await axios.post('http://localhost:5000/api/cart/items', {
      productId: med._id.toString(),
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`RESULT: Success! Status: ${res.status}, Data:`, JSON.stringify(res.data).substring(0, 100));
  } catch (err) {
    console.error(`RESULT: Failed! Status: ${err.response?.status}`);
    console.error('Response Data:', err.response?.data);
  }

  await mongoose.disconnect();
};

run();
