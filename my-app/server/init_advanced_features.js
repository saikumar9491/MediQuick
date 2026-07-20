import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PricingRule from './models/PricingRule.js';
import ABTest from './models/ABTest.js';
import Notification from './models/Notification.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediquick');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const initAdvancedFeatures = async () => {
  await connectDB();
  
  try {
    console.log('Clearing old advanced feature data...');
    await PricingRule.deleteMany({});
    await ABTest.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding Pricing Rules...');
    const rules = [
      {
        ruleName: 'Clear Expiring Stock',
        conditionType: 'Expiring Soon',
        thresholds: { expiryDaysLessThan: 45 },
        adjustmentPercent: -20,
        isActive: true
      },
      {
        ruleName: 'Boost Slow Movers',
        conditionType: 'Low Demand',
        thresholds: { daysWithoutSale: 30, stockGreaterThan: 10 },
        adjustmentPercent: -10,
        isActive: true
      },
      {
        ruleName: 'Capitalize on High Demand',
        conditionType: 'High Demand, Low Stock',
        thresholds: { salesLast7DaysGreaterThan: 30, stockLessThan: 20 },
        adjustmentPercent: 5,
        isActive: true
      },
      {
        ruleName: 'Liquidate Overstock',
        conditionType: 'Overstocked',
        thresholds: { stockGreaterThan: 200 },
        adjustmentPercent: -15,
        isActive: true
      }
    ];
    await PricingRule.insertMany(rules);

    console.log('Seeding A/B Tests...');
    const tests = [
      {
        name: 'Homepage Banner Color',
        description: 'Testing if a red banner converts better than blue',
        type: 'Banner',
        status: 'Completed',
        trafficSplit: 50,
        successMetric: 'Conversion Rate',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        variants: [
          { label: 'A', content: 'blue-banner.jpg', impressions: 14500, conversions: 420, revenueAttributed: 210000 },
          { label: 'B', content: 'red-banner.jpg', impressions: 14200, conversions: 510, revenueAttributed: 260000 }
        ]
      },
      {
        name: 'Checkout Flow Notification',
        description: 'Testing copy for cart abandonment',
        type: 'Notification Copy',
        status: 'Running',
        trafficSplit: 50,
        successMetric: 'Click-through Rate',
        startDate: new Date(),
        variants: [
          { label: 'A', content: '"Forgot something?"', impressions: 0, conversions: 0, revenueAttributed: 0 },
          { label: 'B', content: '"Your items are waiting!"', impressions: 0, conversions: 0, revenueAttributed: 0 }
        ]
      }
    ];
    // Find the winner for the completed one
    const abTests = await ABTest.insertMany(tests);
    await ABTest.findByIdAndUpdate(abTests[0]._id, { winningVariant: abTests[0].variants[1]._id });

    console.log('Seeding Notifications...');
    const notifs = [
      {
        title: 'Summer Health Sale!',
        message: 'Get 20% off all vitamins and supplements this week only.',
        channels: ['email', 'push'],
        audienceType: 'All',
        status: 'Sent',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        recipientCount: 5240,
        deliveredCount: 5100
      },
      {
        title: 'Your Prescription is Expiring',
        message: 'Renew now to avoid delays in your next refill.',
        channels: ['sms'],
        audienceType: 'Segment',
        audienceFilter: 'Inactive 30+ days',
        status: 'Draft'
      }
    ];
    await Notification.insertMany(notifs);

    console.log('✅ Advanced features initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
};

initAdvancedFeatures();
