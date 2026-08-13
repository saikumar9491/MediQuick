// src/routes/adminStats.js
import express from 'express';
import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

/** Helper to get IST date boundaries */
const startOfTodayIST = () => {
  const now = new Date();
  // get UTC+5:30 offset in ms
  const offset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + offset);
  istNow.setUTCHours(0, 0, 0, 0);
  return new Date(istNow.getTime() - offset);
};

/** 1. Summary stats (8 KPI cards) */
router.get('/summary', async (req, res) => {
  try {
    const todayStart = startOfTodayIST();

    const [liveOrders, revenueToday, activeUsers, activeCarts, pendingOrders, outForDelivery, cancelledToday, avgRating] = await Promise.all([
      // Live Orders Today
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      // Revenue Today (non‑cancelled orders)
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(r => (r[0]?.total ?? 0)),
      // Active Users – assume User sessions are stored in a collection called "sessions"
      // For demo we count online users via a placeholder collection "onlineSessions"
      mongoose.connection.collection('onlineSessions').estimatedDocumentCount(),
      // Active Carts (items updated in last 30 min)
      Cart.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, items: { $ne: [] } }),
      // Pending Orders (Placed or Confirmed)
      Order.countDocuments({ status: { $in: ['Placed', 'Confirmed'] } }),
      // Out for Delivery
      Order.countDocuments({ status: 'Out for Delivery' }),
      // Cancelled Today
      Order.countDocuments({ status: 'Cancelled', createdAt: { $gte: todayStart } }),
      // Avg Rating Today (approved reviews inside Medicine)
      Medicine.aggregate([
        { $unwind: '$reviews' },
        { $match: { 'reviews.createdAt': { $gte: todayStart }, 'reviews.isApproved': true } },
        { $group: { _id: null, avg: { $avg: '$reviews.rating' } } }
      ]).then(r => (r[0]?.avg ?? 0))
    ]);

    res.json({
      liveOrders,
      revenueToday,
      activeUsers,
      activeCarts,
      pendingOrders,
      outForDelivery,
      cancelledToday,
      avgRating: Number(avgRating.toFixed(2))
    });
  } catch (err) {
    console.error('Summary stats error:', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

/** 2. Revenue hourly (today) */
router.get('/revenue-hourly', async (req, res) => {
  try {
    const todayStart = startOfTodayIST();
    const pipeline = [
      { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt", timezone: "+05:30" }
          },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ];
    const todayData = await Order.aggregate(pipeline);
    // Yesterday for comparison
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayPipeline = [
      { $match: { createdAt: { $gte: yesterdayStart, $lt: todayStart }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt", timezone: "+05:30" }
          },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ];
    const yesterdayData = await Order.aggregate(yesterdayPipeline);
    res.json({ today: todayData, yesterday: yesterdayData });
  } catch (err) {
    console.error('Revenue hourly error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

/** 3. Order status distribution */
router.get('/order-status', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    const data = await Order.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Order status error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

/** 4. Revenue by category */
router.get('/revenue-by-category', async (req, res) => {
  try {
    const pipeline = [
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'medicines',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'medicine'
        }
      },
      { $unwind: '$medicine' },
      {
        $group: {
          _id: '$medicine.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $project: { category: '$_id', revenue: 1, _id: 0 } }
    ];
    const data = await Order.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Revenue by category error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

/** 5. Top products */
router.get('/top-products', async (req, res) => {
  const range = req.query.range || 'today'; // today|7d|30d
  const now = new Date();
  let start;
  if (range === 'today') start = startOfTodayIST();
  else if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  else start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  try {
    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          unitsSold: { $sum: '$items.quantity' }
        }
      },
      { $lookup: { from: 'medicines', localField: '_id', foreignField: '_id', as: 'medicine' } },
      { $unwind: '$medicine' },
      { $project: { productId: '$_id', name: '$medicine.name', unitsSold: 1, stock: '$medicine.countInStock' } },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 }
    ];
    const data = await Order.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Top products error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

/** 6. Zone density (heatmap) */
router.get('/zone-density', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$deliveryPincode', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'pincodes', // assume a collection with city and coords
          localField: '_id',
          foreignField: 'pincode',
          as: 'info'
        }
      },
      { $unwind: '$info' },
      {
        $project: {
          pincode: '$_id',
          city: '$info.city',
          lat: '$info.lat',
          lng: '$info.lng',
          count: 1,
          _id: 0
        }
      }
    ];
    const data = await Order.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error('Zone density error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

/** 7. Insights */
router.get('/insights', async (req, res) => {
  try {
    // a few simple rule‑based insights
    const todayStart = startOfTodayIST();
    const [todayRev, yesterdayRev] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(todayStart.getTime() - 24 * 60 * 60 * 1000), $lt: todayStart }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);
    const revenueChange = ((todayRev[0]?.total ?? 0) - (yesterdayRev[0]?.total ?? 0)) / ((yesterdayRev[0]?.total ?? 1)) * 100;

    const cartAbandoned = await Cart.countDocuments({ items: { $ne: [] }, updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    const lowStock = await Medicine.countDocuments({ countInStock: { $lt: 7 } });

    const insights = [];
    insights.push({ text: `Revenue is ${revenueChange.toFixed(1)}% ${revenueChange >= 0 ? 'higher' : 'lower'} than yesterday.` });
    insights.push({ text: `${cartAbandoned} customers abandoned carts today.` });
    insights.push({ text: `${lowStock} products are low in stock (≤6 units).` });
    // add more as needed
    res.json(insights);
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ message: 'Failed' });
  }
});

export default router;
