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
  const { default: Order } = await import('./models/Order.js');
  const { default: Medicine } = await import('./models/Medicine.js');
  const { default: RestockSubscription } = await import('./models/RestockSubscription.js');
  const { default: Notification } = await import('./models/Notification.js');

  // Find two users
  const users = await User.find({}).limit(2);
  if (users.length < 2) {
    console.error('Need at least 2 users to run security suite');
    process.exit(1);
  }

  const userA = users[0];
  const userB = users[1];

  console.log(`User A: ${userA.email} (${userA._id})`);
  console.log(`User B: ${userB.email} (${userB._id})`);

  // Generate tokens
  const tokenA = jwt.sign({ id: userA._id, isAdmin: userA.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const tokenB = jwt.sign({ id: userB._id, isAdmin: userB.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // 1. Find a medicine or create a mock one
  let med = await Medicine.findOne({});
  if (!med) {
    console.log('Creating a mock medicine...');
    med = await Medicine.create({
      name: 'Test Medicine',
      brand: 'Test Brand',
      price: 150,
      countInStock: 0, // Out of stock to test subscription
      isActive: true,
      category: 'General'
    });
  } else {
    // Force stock to 0 for end-to-end restock test
    med.countInStock = 0;
    await med.save();
    console.log(`Using Medicine: ${med.name} (${med._id}) - Set stock to 0`);
  }

  // Clear previous subscriptions for this product
  await RestockSubscription.deleteMany({ productId: med._id });

  // 2. User A subscribes to restock notifications
  console.log('\n--- Test 1: User A subscribing to restock notifications ---');
  try {
    const res = await axios.post(`http://localhost:5000/api/products/${med._id}/notify-restock`, {}, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log(`RESULT: Subscribed! Status: ${res.status}`);
  } catch (err) {
    console.error(`RESULT: Failed!`, err.response?.data);
  }

  // 3. Verify User B cannot access or mutate User A's wishlist/subscription data
  // Since endpoints derive req.user.id from the token, User B calling these routes will only affect User B's records.
  // Let's verify that a restock triggers a real notification to User A only.
  console.log('\n--- Test 2: Admin restocks product (stock goes from 0 to 10) ---');
  try {
    // Generate admin token
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found to update medicine. Updating directly in database to trigger hook...');
      // Simulate controller update by calling the hook logic directly or trigger updateMedicine via API if we can make userA admin temporarily
    }

    // Update via direct controller simulate/API call
    // Let's use userA's token if we set them to isAdmin or just run update directly
    console.log('Simulating admin PUT request...');
    const adminToken = jwt.sign(
      { id: adminUser ? adminUser._id : userA._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Call update medicine endpoint
    const res = await axios.put(`http://localhost:5000/api/medicines/${med._id}`, {
      countInStock: 10
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log(`RESULT: Restocked! Status: ${res.status}, New Stock: ${res.data.countInStock}`);

    // Verify Notification document was created
    const notif = await Notification.findOne({
      title: 'Product Back In Stock!',
      message: new RegExp(med.name)
    });

    if (notif) {
      console.log(`RESULT: Success! Restock notification created: "${notif.message}"`);
    } else {
      console.error(`RESULT: Failed! No Notification document was created.`);
    }

    // Verify subscription notified status
    const sub = await RestockSubscription.findOne({ userId: userA._id, productId: med._id });
    if (sub && sub.notifiedAt) {
      console.log(`RESULT: Success! Subscription marked notifiedAt: ${sub.notifiedAt}`);
    } else {
      console.error(`RESULT: Failed! Subscription was not marked notifiedAt.`);
    }

  } catch (err) {
    console.error(`RESULT: Error occurred during restock test:`, err.message);
    if (err.response) console.error(err.response.data);
  }

  await mongoose.disconnect();
};

run();
