import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js'; // Added User model to clear cart
import { verifyToken } from '../middleware/authMiddleware.js'; // Ensure security

const router = express.Router();

/**
 * @desc    Create New Order & Clear Hub Cart
 * @route   POST /api/orders
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    // 1. Create and save the order
    const newOrder = new Order({
      ...req.body,
      userId: req.user.id // Use the ID from the verified token for security
    });
    const savedOrder = await newOrder.save();

    // 2. CRITICAL HUB LOGIC: Clear the cart in the User collection
    // This prevents the "Double Cart" bug where items stay in the cart after purchase
    await User.findByIdAndUpdate(req.user.id, {
      $set: { cart: [] }
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Placement Error:", err.message);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

/**
 * @desc    Get User Orders for Tracking Page
 * @route   GET /api/orders/user/:userId
 * @access  Private
 */
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    // Ensure the user is only requesting their own orders
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized access to orders" });
    }

    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;