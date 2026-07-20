import express from 'express';
import { getProductsSummaryStats } from '../controllers/medicineController.js';
// Add authentication/authorization middleware here if needed
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

import Order from '../models/Order.js';

// GET /api/admin/stats/products-summary
router.get('/stats/products-summary', getProductsSummaryStats);

// GET /api/admin/stats/orders-summary
router.get('/stats/orders-summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stats] = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          ordersToday: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" }
          ],
          pendingProcessing: [
            { $match: { status: { $in: ['Placed', 'Confirmed', 'Processing'] } } },
            { $count: "count" }
          ],
          outForDelivery: [
            { $match: { status: 'Out for Delivery' } },
            { $count: "count" }
          ],
          cancelled: [
            { $match: { status: 'Cancelled' } },
            { $count: "count" }
          ]
        }
      }
    ]);

    res.json({
      totalOrders: stats.totalOrders[0]?.count || 0,
      ordersToday: stats.ordersToday[0]?.count || 0,
      pendingProcessing: stats.pendingProcessing[0]?.count || 0,
      outForDelivery: stats.outForDelivery[0]?.count || 0,
      cancelled: stats.cancelled[0]?.count || 0
    });
  } catch (err) {
    console.error("Error fetching orders stats:", err);
    res.status(500).json({ message: "Error fetching orders stats" });
  }
});

export default router;
