import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';

const router = express.Router();

router.get('/abandoned', verifyToken, isAdmin, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 2;
    const thresholdDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const carts = await Cart.find({
      status: { $in: ['Active', 'Reminded'] },
      lastActivityAt: { $lt: thresholdDate },
      'items.0': { $exists: true } // Only carts with items
    })
    .populate('userId', 'name email phone')
    .sort({ lastActivityAt: -1 });

    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching abandoned carts", error: err.message });
  }
});

router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const carts = await Cart.find({
      lastActivityAt: { $gte: thirtyDaysAgo },
      'items.0': { $exists: true }
    });

    let totalAbandoned = 0;
    let potentialRevenueLost = 0;
    let recoveryEmailsSent = 0;
    let cartsRecovered = 0;

    carts.forEach(cart => {
      if (cart.status !== 'Recovered') {
        totalAbandoned++;
        const cartValue = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        potentialRevenueLost += cartValue;
      }
      if (cart.status === 'Reminded' || cart.recoveryEmailSentAt) {
        recoveryEmailsSent++;
      }
      if (cart.status === 'Recovered') {
        cartsRecovered++;
      }
    });

    res.json({ totalAbandoned, potentialRevenueLost, recoveryEmailsSent, cartsRecovered });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart stats", error: err.message });
  }
});

router.post('/:id/send-reminder', verifyToken, isAdmin, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Simulate sending email
    cart.status = 'Reminded';
    cart.recoveryEmailSentAt = new Date();
    await cart.save();

    res.json({ message: "Reminder sent successfully", cart });
  } catch (err) {
    res.status(500).json({ message: "Error sending reminder", error: err.message });
  }
});

export default router;
