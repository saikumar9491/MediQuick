import express from 'express';
import Order from '../models/Order.js'; // Added .js extension

const router = express.Router();

// Create New Order - This clears the cart in frontend on success
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

// Get User Orders - This makes orders appear on the Tracking Page
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router; // Changed to export default