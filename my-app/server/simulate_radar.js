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
  const DeliveryZone = (await import('./models/DeliveryZone.js')).default;
  const DeliveryPartner = (await import('./models/DeliveryPartner.js')).default;
  const Order = (await import('./models/Order.js')).default;

  const zones = await DeliveryZone.find();
  if (zones.length === 0) {
    console.log('No zones found. Create one in the Logistics page first.');
    process.exit(1);
  }
  const zone = zones[0];

  let riders = await DeliveryPartner.find({ zoneId: zone._id });
  if (riders.length < 2) {
    console.log('Creating mock riders...');
    await DeliveryPartner.create([
      { name: 'Simulated Rider 1', phone: '9999999991', zoneId: zone._id, status: 'delivering' },
      { name: 'Simulated Rider 2', phone: '9999999992', zoneId: zone._id, status: 'on-duty' }
    ]);
    riders = await DeliveryPartner.find({ zoneId: zone._id });
  }

  // Base coordinates (e.g. central Delhi)
  const baseLat = 28.6139;
  const baseLng = 77.2090;

  // Update riders with random locations around the base
  for (const rider of riders) {
    rider.currentLocation = {
      lat: baseLat + (Math.random() - 0.5) * 0.05,
      lng: baseLng + (Math.random() - 0.5) * 0.05,
      updatedAt: new Date()
    };
    rider.status = 'delivering';
    await rider.save();
  }

  console.log('✅ Riders updated with locations.');

  // Find or create some orders and assign them
  const orders = await Order.find({ orderType: { $ne: 'pos' } }).limit(2);
  if (orders.length > 0) {
    for (let i = 0; i < orders.length; i++) {
      orders[i].status = 'Out for Delivery';
      orders[i].zoneId = zone._id;
      orders[i].riderId = riders[i % riders.length]._id;
      
      if (!orders[i].shippingAddress) {
        orders[i].shippingAddress = { building: 'Mock Building', pincode: '110001', city: 'Delhi' };
      }
      // Add fake coords for destination
      orders[i].shippingAddress.coordinates = {
        lat: baseLat + (Math.random() - 0.5) * 0.08,
        lng: baseLng + (Math.random() - 0.5) * 0.08
      };
      
      // Simulate one being old (at risk)
      if (i === 0) {
        orders[i].createdAt = new Date(Date.now() - 40 * 60000); // 40 mins ago
      } else {
        orders[i].createdAt = new Date(Date.now() - 10 * 60000); // 10 mins ago
      }
      
      await orders[i].save();
    }
    console.log('✅ Orders updated for delivery.');
  } else {
    console.log('No online orders found to simulate. Please place an order in the store first.');
  }

  console.log('Simulation complete! Check the Live Radar page.');
  process.exit(0);
};

simulate();
