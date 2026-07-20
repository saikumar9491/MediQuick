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
  const Complaint = (await import('./models/Complaint.js')).default;
  const User = (await import('./models/User.js')).default;
  const Order = (await import('./models/Order.js')).default;

  let users = await User.find({ isAdmin: false }).limit(3);
  if (users.length === 0) {
    console.log('No users found. Creating a mock customer...');
    await User.create([
      { name: 'Mock Customer 1', email: 'mock1@example.com', password: 'password', phone: '1112223334', isAdmin: false, role: 'Admin' },
      { name: 'Mock Customer 2', email: 'mock2@example.com', password: 'password', phone: '1112223335', isAdmin: false, role: 'Admin' }
    ]);
    users = await User.find({ isAdmin: false }).limit(3);
  }

  const admins = await User.find({ isAdmin: true });
  const adminId = admins.length > 0 ? admins[0]._id : null;

  const orders = await Order.find().limit(2);

  console.log('Creating mock complaints...');
  await Complaint.deleteMany({}); // clear existing

  const mockComplaints = [
    {
      customerId: users[0]._id,
      orderId: orders.length > 0 ? orders[0]._id : undefined,
      category: 'Delivery Delay',
      priority: 'High',
      status: 'New',
      description: 'My order is 2 hours late and the rider is not answering the phone. This is urgent medicine.',
      images: []
    },
    {
      customerId: users[1 % users.length]._id,
      orderId: orders.length > 1 ? orders[1]._id : undefined,
      category: 'Damaged Item',
      priority: 'Medium',
      status: 'In Progress',
      description: 'The syrup bottle arrived broken in the package. Can I get a replacement?',
      assignedTo: adminId,
      internalNotes: [{ text: 'Called rider, he confirmed box was crushed during transit.', adminName: 'System Admin' }]
    },
    {
      customerId: users[2 % users.length]._id,
      category: 'Product Quality',
      priority: 'Low',
      status: 'Resolved',
      description: 'The tablet strip has one tablet missing.',
      resolutionNotes: 'Refunded the amount for one strip to user wallet.',
      assignedTo: adminId,
      resolvedAt: new Date(),
      statusHistory: [{ status: 'Resolved', changedAt: new Date() }]
    },
    {
      customerId: users[0]._id,
      category: 'Prescription Issue',
      priority: 'Urgent',
      status: 'Escalated',
      description: 'Your doctor rejected my prescription but it is valid!',
    }
  ];

  await Complaint.create(mockComplaints);

  console.log('✅ Mock complaints inserted. Check the Complaints page.');
  process.exit(0);
};

simulate();
