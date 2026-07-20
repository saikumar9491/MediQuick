import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, './.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
};

const simulate = async () => {
  await connectDB();
  const Return = (await import('./models/Return.js')).default;
  const User = (await import('./models/User.js')).default;
  const Order = (await import('./models/Order.js')).default;

  let users = await User.find({ isAdmin: false }).limit(3);
  if (users.length === 0) {
    console.log('No users found. Creating a mock customer...');
    await User.create([
      { name: 'Mock Customer 1', email: 'mock1@example.com', password: 'password', phone: '1112223334', isAdmin: false, role: 'Admin' }
    ]);
    users = await User.find({ isAdmin: false }).limit(1);
  }

  let orders = await Order.find().limit(3);
  if (orders.length === 0) {
    console.log('No orders found. Creating a mock order...');
    await Order.create({
      userId: users[0]._id,
      customerName: users[0].name,
      customerPhone: users[0].phone,
      totalAmount: 500,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      status: 'Delivered',
      items: [
        { name: 'Paracetamol', price: 100, quantity: 2 },
        { name: 'Vitamin C', price: 150, quantity: 2 }
      ],
      shippingAddress: { pincode: '123456', building: 'Test', area: 'Test Area' }
    });
    orders = await Order.find().limit(3);
  }

  console.log('Creating mock return requests...');
  await Return.deleteMany({}); // clear existing

  const mockReturns = [
    {
      orderId: orders[0]._id,
      customerId: users[0]._id,
      items: [{
        productId: orders[0].items[0]?.productId || new mongoose.Types.ObjectId(),
        name: orders[0].items[0]?.name || 'Test Item 1',
        quantity: 1,
        unitPrice: orders[0].items[0]?.price || 100,
        refundAmount: orders[0].items[0]?.price || 100
      }],
      reason: 'Damaged Item',
      status: 'Requested',
      description: 'The box was completely crushed and the blister pack is torn.',
      images: []
    },
    {
      orderId: orders.length > 1 ? orders[1]._id : orders[0]._id,
      customerId: users.length > 1 ? users[1]._id : users[0]._id,
      items: [{
        productId: new mongoose.Types.ObjectId(),
        name: 'Whey Protein 1kg',
        quantity: 1,
        unitPrice: 2000,
        refundAmount: 2000
      }],
      reason: 'Wrong Item Delivered',
      status: 'Under Review',
      description: 'I ordered chocolate flavor but got vanilla.',
      images: []
    },
    {
      orderId: orders.length > 2 ? orders[2]._id : orders[0]._id,
      customerId: users[0]._id,
      items: [{
        productId: new mongoose.Types.ObjectId(),
        name: 'Blood Pressure Monitor',
        quantity: 1,
        unitPrice: 1500,
        refundAmount: 1500
      }],
      reason: 'Quality Issue',
      status: 'Approved',
      description: 'The machine is not turning on despite new batteries.',
      images: [],
      reviewedAt: new Date(),
      statusHistory: [{ status: 'Approved', changedAt: new Date() }]
    },
    {
      orderId: orders[0]._id,
      customerId: users[0]._id,
      items: [{
        productId: new mongoose.Types.ObjectId(),
        name: 'Bandages 100pk',
        quantity: 2,
        unitPrice: 250,
        refundAmount: 500
      }],
      reason: 'Changed Mind',
      status: 'Refunded',
      description: 'No longer need these.',
      refundMethod: 'Razorpay',
      refundReference: 'rfnd_1234567890',
      refundedAt: new Date(),
      reviewedAt: new Date(Date.now() - 86400000), // 1 day ago
      statusHistory: [
        { status: 'Approved', changedAt: new Date(Date.now() - 86400000) },
        { status: 'Refunded', changedAt: new Date() }
      ]
    }
  ];

  await Return.create(mockReturns);

  console.log('✅ Mock returns inserted. Check the Returns & Refunds page.');
  process.exit(0);
};

simulate();
