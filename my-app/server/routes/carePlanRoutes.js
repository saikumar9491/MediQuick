import express from 'express';
import CarePlan from '../models/CarePlan.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all available Care Plan tiers
// @route   GET /api/care-plan/plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = await CarePlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user's active subscription status
// @route   GET /api/care-plan/my-subscription
// @access  Private
router.get('/my-subscription', verifyToken, async (req, res) => {
  try {
    const activeSub = await Subscription.findOne({
      customerId: req.user.id,
      status: 'Active',
      renewalDate: { $gte: new Date() }
    }).populate('planId');

    res.json(activeSub || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Subscribe / Purchase Care Plan
// @route   POST /api/care-plan/subscribe
// @access  Private
router.post('/subscribe', verifyToken, async (req, res) => {
  const { planId, razorpayOrderId, razorpayPaymentId } = req.body;

  try {
    const plan = await CarePlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Selected Care Plan tier not found' });
    }

    // Cancel any existing active subscriptions first
    await Subscription.updateMany(
      { customerId: req.user.id, status: 'Active' },
      { status: 'Cancelled' }
    );

    // Calculate renewal date (Monthly = 30 days, Annual = 365 days)
    const startDate = new Date();
    const renewalDate = new Date();
    if (plan.tier === 'monthly') {
      renewalDate.setDate(startDate.getDate() + 30);
    } else {
      renewalDate.setDate(startDate.getDate() + 365);
    }

    const subscription = new Subscription({
      customerId: req.user.id,
      planId: plan._id,
      planName: plan.name,
      tier: plan.tier,
      amountPaid: plan.price,
      status: 'Active',
      startDate,
      renewalDate,
      paymentMethod: 'Razorpay',
      razorpayOrderId,
      razorpayPaymentId
    });

    const createdSub = await subscription.save();

    // Mark isCareMember on user document if applicable
    await User.findByIdAndUpdate(req.user.id, { isCareMember: true });

    res.status(201).json(createdSub);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    1-Click Subscription Cancellation
// @route   POST /api/care-plan/cancel
// @access  Private
router.post('/cancel', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      customerId: req.user.id,
      status: 'Active'
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    subscription.status = 'Cancelled';
    const updated = await subscription.save();

    await User.findByIdAndUpdate(req.user.id, { isCareMember: false });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all subscriptions (Admin)
// @route   GET /api/care-plan/admin/subscriptions
// @access  Private/Admin
router.get('/admin/subscriptions', verifyToken, isAdmin, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('customerId', 'name email phone')
      .populate('planId', 'name tier price')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
