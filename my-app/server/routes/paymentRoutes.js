import express from 'express';
import crypto from 'crypto';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const configured = !!(keyId && keySecret);
  return { keyId, keySecret, configured };
};

/**
 * @route   GET /api/payment/config
 * @desc    Check if Razorpay credentials are configured
 * @access  Private
 */
router.get('/config', verifyToken, async (req, res) => {
  const { configured } = getRazorpayConfig();
  res.json({ configured });
});

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a Razorpay order (returns order id + key for frontend modal)
 * @access  Private
 */
router.post('/create-order', verifyToken, async (req, res) => {
  const { keyId, keySecret, configured } = getRazorpayConfig();

  if (!configured) {
    return res.status(503).json({
      message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.',
      configured: false,
    });
  }

  try {
    const { amount } = req.body; // amount in rupees
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid order amount' });
    }

    // Dynamically import Razorpay SDK
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay takes paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      configured: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ message: 'Failed to create payment order', error: err.message });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify Razorpay payment signature server-side (HMAC-SHA256)
 * @access  Private
 */
router.post('/verify', verifyToken, async (req, res) => {
  const { keySecret, configured } = getRazorpayConfig();

  if (!configured) {
    return res.status(503).json({ message: 'Razorpay is not configured', verified: false });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, message: 'Missing payment verification fields' });
    }

    // HMAC-SHA256 verification — this is the ONLY trusted signal
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ verified: false, message: 'Payment signature verification failed' });
    }

    res.json({
      verified: true,
      transactionId: razorpay_payment_id,
      message: 'Payment verified successfully',
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ verified: false, message: 'Payment verification failed', error: err.message });
  }
});

export default router;
