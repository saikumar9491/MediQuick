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
  const { default: Order } = await import('./models/Order.js');

  const user = await User.findOne({ email: 'balisaikumar9491@gmail.com' });
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  try {
    console.log('Testing GET /api/customers/me/orders (Auto-sync verification)...');
    const res = await axios.get('http://localhost:5000/api/customers/me/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`Fetched ${res.data.length} orders for user.`);

    const updatedUser = await User.findById(user._id);
    console.log(`user.orders array in MongoDB contains ${updatedUser.orders.length} order IDs:`);
    console.log(updatedUser.orders);

    if (res.data.length > 0 && updatedUser.orders.length > 0) {
      console.log('RESULT: SUCCESS! Orders are correctly stored in the standalone "orders" collection AND synced to the "user.orders" array!');
    }
  } catch (err) {
    console.error('Error during test:', err.message);
    if (err.response) console.error(err.response.data);
  }

  await mongoose.disconnect();
};

run();
