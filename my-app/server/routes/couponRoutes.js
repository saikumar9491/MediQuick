import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

const router = express.Router();

/**
 * @route   POST /api/coupons/validate
 * @desc    Validate a coupon code for a given cart subtotal (public, auth required)
 * @access  Private (any logged-in user)
 */
router.post('/validate', verifyToken, async (req, res) => {
  try {
    const { code, subtotal, cartCategories = [] } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const now = new Date();
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active' });
    if (now < coupon.validFrom) return res.status(400).json({ message: 'This coupon is not yet valid' });
    if (now > coupon.validTo) return res.status(400).json({ message: 'This coupon has expired' });

    // Min order check
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order of ₹${coupon.minOrderValue} required for this coupon`,
      });
    }

    // Global usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    // Per-customer usage limit
    const userUsageCount = await Order.countDocuments({
      userId: req.user.id,
      couponId: coupon._id,
    });
    if (userUsageCount >= coupon.perCustomerLimit) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    // New customers only
    if (coupon.newCustomersOnly) {
      const orderCount = await Order.countDocuments({ userId: req.user.id });
      if (orderCount > 0) {
        return res.status(400).json({ message: 'This coupon is for new customers only' });
      }
    }

    // Category restriction
    if (coupon.applicableTo === 'Categories' && coupon.applicableCategoryIds.length > 0) {
      const couponCatIds = coupon.applicableCategoryIds.map(id => id.toString());
      const hasMatch = cartCategories.some(cat => couponCatIds.includes(cat));
      if (!hasMatch) {
        return res.status(400).json({ message: 'This coupon is not applicable to items in your cart' });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'Percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountCap) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountCap);
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    res.json({
      valid: true,
      couponId: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      message: `Coupon applied! You save ₹${discountAmount}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error validating coupon', error: err.message });
  }
});

// GET /api/coupons
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type, sortBy = 'validTo', sortOrder = 'asc' } = req.query;
    const query = {};

    if (search) {
      query.code = new RegExp(search, 'i');
    }
    
    if (type && type !== 'All') {
      query.discountType = type;
    }

    if (status && status !== 'All') {
      const now = new Date();
      if (status === 'Active') {
        query.isActive = true;
        query.validFrom = { $lte: now };
        query.validTo = { $gt: now };
      } else if (status === 'Scheduled') {
        query.validFrom = { $gt: now };
      } else if (status === 'Expired') {
        query.validTo = { $lte: now };
      } else if (status === 'Inactive') {
        query.isActive = false;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortParams = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const coupons = await Coupon.find(query)
      .populate('applicableCategoryIds', 'name')
      .sort(sortParams)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Coupon.countDocuments(query);

    res.json({
      coupons,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons", error: err.message });
  }
});

// GET /api/coupons/stats/summary
router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const now = new Date();
    
    const active = await Coupon.countDocuments({ 
      isActive: true, 
      validFrom: { $lte: now },
      validTo: { $gt: now } 
    });

    const expiringSoon = await Coupon.countDocuments({ 
      isActive: true, 
      validTo: { 
        $gt: now,
        $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
      } 
    });

    // Aggregate Orders to get total redemptions, revenue, and discount
    const orderStats = await Order.aggregate([
      { $match: { couponId: { $exists: true, $ne: null } } },
      { $group: {
          _id: null,
          totalRedemptions: { $sum: 1 },
          revenueGenerated: { $sum: "$totalAmount" },
          totalDiscountGiven: { $sum: "$discountApplied" }
      }}
    ]);

    const stats = orderStats[0] || { totalRedemptions: 0, revenueGenerated: 0, totalDiscountGiven: 0 };

    res.json({ 
      active, 
      totalRedemptions: stats.totalRedemptions, 
      revenueGenerated: stats.revenueGenerated, 
      totalDiscountGiven: stats.totalDiscountGiven,
      expiringSoon 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupon stats", error: err.message });
  }
});

// GET /api/coupons/:id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('applicableCategoryIds', 'name');
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    // Fetch redemption history
    const history = await Order.find({ couponId: coupon._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 redemptions

    res.json({ coupon, history });
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupon details", error: err.message });
  }
});

// POST /api/coupons
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(400).json({ message: "Error creating coupon", error: err.message });
  }
});

// PATCH /api/coupons/:id
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // If they are changing the code, check uniqueness
    if (req.body.code) {
      const existing = await Coupon.findOne({ code: req.body.code.toUpperCase(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: "Error updating coupon", error: err.message });
  }
});

// DELETE /api/coupons/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.usedCount > 0) {
      return res.status(400).json({ message: "Cannot delete a coupon that has been used. Please deactivate it instead." });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon", error: err.message });
  }
});

export default router;
