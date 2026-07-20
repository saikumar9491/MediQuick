import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import DeliveryPartner from './models/DeliveryPartner.js';
import Coupon from './models/Coupon.js';
import Cart from './models/Cart.js';
import Campaign from './models/Campaign.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediquick');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

const simulateGrowthAndFleet = async () => {
  try {
    console.log('Clearing old Fleet, Coupon, and Campaign data...');
    await Vehicle.deleteMany({});
    await Coupon.deleteMany({});
    await Campaign.deleteMany({});
    
    // Make sure we have some users and riders
    const users = await User.find().limit(5);
    const riders = await DeliveryPartner.find().limit(5);

    // 1. FLEET
    console.log('Creating Vehicles...');
    const vehicles = [
      { plateNumber: 'MH-12-AB-1234', type: 'Bike', status: 'Active', assignedRiderId: riders[0]?._id, nextServiceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { plateNumber: 'KA-01-XY-9999', type: 'Scooter', status: 'Maintenance Due', assignedRiderId: riders[1]?._id, nextServiceDue: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { plateNumber: 'DL-04-CC-5555', type: 'Van', status: 'Active', assignedRiderId: riders[2]?._id, nextServiceDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { plateNumber: 'UP-16-ZZ-7777', type: 'Bike', status: 'Out of Service', nextServiceDue: new Date() },
    ];
    await Vehicle.insertMany(vehicles);

    // 2. COUPONS
    console.log('Creating Coupons...');
    const coupons = [
      { code: 'WELCOME50', discountType: 'Flat', discountValue: 50, minOrderValue: 200, validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true, usageLimit: 1000, usedCount: 150 },
      { code: 'SUMMER20', discountType: 'Percentage', discountValue: 20, maxDiscountCap: 200, minOrderValue: 500, validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true, usageLimit: 500, usedCount: 450 },
      { code: 'FLASHSALE', discountType: 'Percentage', discountValue: 10, maxDiscountCap: 100, minOrderValue: 0, validTo: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isActive: false, usageLimit: 100, usedCount: 100 }
    ];
    const insertedCoupons = await Coupon.insertMany(coupons);

    // 3. CAMPAIGNS
    console.log('Creating Campaigns...');
    const campaigns = [
      { name: 'Welcome Offer Reminder', type: 'Email', targetAudience: 'All Customers', message: 'Use WELCOME50 for ₹50 off your next order!', status: 'Active', linkedCouponId: insertedCoupons[0]._id, metrics: { sent: 5000, opened: 2500, clicked: 500, converted: 150 } },
      { name: 'Inactive User Reactivation', type: 'SMS', targetAudience: 'Inactive 30+ Days', message: 'We miss you! Here is a 20% discount on medicines.', status: 'Scheduled', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), linkedCouponId: insertedCoupons[1]._id },
      { name: 'Flash Sale Alert', type: 'Push', targetAudience: 'Specific Zone', message: 'Flash sale happening now!', status: 'Completed', metrics: { sent: 10000, opened: 4000, clicked: 1200, converted: 800 } }
    ];
    await Campaign.insertMany(campaigns);

    // 4. MOCK ORDERS (for coupon redemptions and stats)
    console.log('Simulating Orders...');
    const Order = (await import('./models/Order.js')).default;
    
    // Create some orders using the coupons
    if (users.length >= 3) {
      const orders = [
        { userId: users[0]._id, totalAmount: 800, discountApplied: 50, couponId: insertedCoupons[0]._id, paymentMethod: 'Card', status: 'Delivered', orderType: 'online', shippingAddress: { pincode: "111", building: "B", area: "A" }, items: [{ name: 'Test', price: 800, quantity: 1 }] },
        { userId: users[1]._id, totalAmount: 1000, discountApplied: 200, couponId: insertedCoupons[1]._id, paymentMethod: 'UPI', status: 'Delivered', orderType: 'online', shippingAddress: { pincode: "111", building: "B", area: "A" }, items: [{ name: 'Test', price: 1000, quantity: 1 }] },
        { userId: users[2]._id, totalAmount: 600, discountApplied: 120, couponId: insertedCoupons[1]._id, paymentMethod: 'Cash on Delivery', status: 'Confirmed', orderType: 'online', shippingAddress: { pincode: "111", building: "B", area: "A" }, items: [{ name: 'Test', price: 600, quantity: 1 }] },
      ];
      await Order.insertMany(orders);
    }

    // 5. ABANDONED CARTS
    console.log('Simulating Abandoned Carts...');
    if (users.length >= 3) {
      await Cart.deleteMany({}); // clear existing
      const carts = [
        { userId: users[0]._id, items: [{ _id: 'med1', name: 'Paracetamol', price: 50, quantity: 2 }], status: 'Active', lastActivityAt: new Date(Date.now() - 5 * 60 * 60 * 1000) }, // 5 hrs ago (Abandoned)
        { userId: users[1]._id, items: [{ _id: 'med2', name: 'Vitamin C', price: 150, quantity: 1 }], status: 'Reminded', lastActivityAt: new Date(Date.now() - 25 * 60 * 60 * 1000), recoveryEmailSentAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // Reminded
        { userId: users[2]._id, items: [{ _id: 'med3', name: 'Cough Syrup', price: 100, quantity: 3 }], status: 'Active', lastActivityAt: new Date(Date.now() - 10 * 60 * 1000) } // 10 mins ago (Active, not abandoned)
      ];
      await Cart.insertMany(carts);
    }

    console.log('✅ Simulation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error simulating data:', error);
    process.exit(1);
  }
};

connectDB().then(simulateGrowthAndFleet);
