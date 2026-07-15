import express from 'express';
import Coupon from '../models/Coupon.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get All Coupons
 * @route   GET /api/coupons
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons", error: err.message });
  }
});

/**
 * @desc    Create Coupon (Admin)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;
    
    // Check if coupon already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      expiryDate,
      isActive: true
    });
    
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error creating coupon", error: err.message });
  }
});

/**
 * @desc    Update Coupon Toggle State / Details (Admin)
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, discount, expiryDate, isActive } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (code) coupon.code = code.toUpperCase();
    if (discount !== undefined) coupon.discount = discount;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (isActive !== undefined) coupon.isActive = isActive;

    const updated = await coupon.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating coupon", error: err.message });
  }
});

/**
 * @desc    Delete Coupon (Admin)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon successfully removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon", error: err.message });
  }
});

export default router;
