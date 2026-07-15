import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js'; // Added User model to clear cart
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'; // Ensure security

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

/**
 * @desc    Get All Orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
});

/**
 * @desc    Update Order Status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
});

export default router;