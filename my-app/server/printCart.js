import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  const { default: User } = await import('./models/User.js');
  const { default: Cart } = await import('./models/Cart.js');

  const user = await User.findOne({ email: 'balisaikumar9491@gmail.com' });
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    console.log('No cart found in database');
  } else {
    console.log('Cart Items in DB:', JSON.stringify(cart.items, null, 2));
  }

  await mongoose.disconnect();
};

run();
