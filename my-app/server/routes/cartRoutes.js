import express from 'express';
const router = express.Router();
import Cart from '../models/Cart.js';

// Fetch specific user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Update or Create user cart
router.post('/update', async (req, res) => {
  const { userId, items } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error saving cart" });
  }
});

export default router;