import express from 'express';
import RestockSubscription from '../models/RestockSubscription.js';
import Medicine from '../models/Medicine.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/products/:id/notify-restock
 * @desc    Subscribe to back-in-stock notification
 * @access  Private
 */
router.post('/:id/notify-restock', verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const med = await Medicine.findById(productId);
    if (!med) return res.status(404).json({ message: 'Product not found' });

    let sub = await RestockSubscription.findOne({ userId: req.user.id, productId });
    if (!sub) {
      sub = await RestockSubscription.create({
        userId: req.user.id,
        productId,
        notifiedAt: null
      });
    }

    res.json({ message: 'Subscribed to restock notifications', sub });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
