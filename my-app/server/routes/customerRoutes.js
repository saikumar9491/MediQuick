import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import Wishlist from '../models/Wishlist.js';
import RestockSubscription from '../models/RestockSubscription.js';
import ViewHistory from '../models/ViewHistory.js';
import Medicine from '../models/Medicine.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ─── Profile Details ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/customers/me
 * @desc    Get logged-in user profile details
 * @access  Private
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PATCH /api/customers/me
 * @desc    Update profile info (name, dob, phone, email)
 * @access  Private
 */
router.patch('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, dob, phone, email } = req.body;

    if (name) user.name = name;
    if (dob) user.dob = dob;

    // Simple validation of credentials
    if (phone && phone !== user.phone) {
      if (!/^\+?[0-9]{10,14}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone format' });
      }
      user.phone = phone;
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      user.email = email.toLowerCase();
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/customers/me/orders
 * @desc    Get user's past orders
 * @access  Private
 */
router.get('/me/orders', verifyToken, async (req, res) => {
  try {
    const userObjId = mongoose.Types.ObjectId.isValid(req.user.id) 
      ? new mongoose.Types.ObjectId(req.user.id) 
      : req.user.id;

    const orders = await Order.find({
      $or: [
        { userId: req.user.id },
        { userId: userObjId }
      ]
    }).sort({ createdAt: -1 });

    // Auto-sync user.orders array in MongoDB if out of sync
    if (orders.length > 0) {
      const orderIds = orders.map(o => o._id);
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { orders: { $each: orderIds } }
      });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/customers/me/orders/:orderId
 * @desc    Get details of a specific order
 * @access  Private
 */
router.get('/me/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Addresses ───────────────────────────────────────────────────────────────

/**
 * @route   GET /api/customers/me/addresses
 * @desc    Get user saved addresses
 * @access  Private
 */
router.get('/me/addresses', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/customers/me/addresses
 * @desc    Add new address
 * @access  Private
 */
router.post('/me/addresses', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { type, name, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push({
      type, name, phone, addressLine1, addressLine2, landmark, city, state, pincode,
      isDefault: user.addresses.length === 0 ? true : !!isDefault
    });

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PATCH /api/customers/me/addresses/:addressId
 * @desc    Edit existing address
 * @access  Private
 */
router.patch('/me/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const { type, name, phone, addressLine1, addressLine2, landmark, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
      addr.isDefault = true;
    } else {
      addr.isDefault = !!isDefault;
    }

    if (type) addr.type = type;
    if (name) addr.name = name;
    if (phone) addr.phone = phone;
    if (addressLine1) addr.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) addr.addressLine2 = addressLine2;
    if (landmark !== undefined) addr.landmark = landmark;
    if (city) addr.city = city;
    if (state) addr.state = state;
    if (pincode) addr.pincode = pincode;

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/customers/me/addresses/:addressId
 * @desc    Delete saved address
 * @access  Private
 */
router.delete('/me/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeOrders = await Order.find({
      userId: req.user.id,
      status: { $in: ['Placed', 'Processing', 'Out for Delivery'] },
      'shippingAddress._id': req.params.addressId
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({
        message: 'This address cannot be deleted as it is being used by a pending order.'
      });
    }

    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Prescriptions ───────────────────────────────────────────────────────────

/**
 * @route   GET /api/customers/me/prescriptions
 * @desc    Get user uploaded prescriptions
 * @access  Private
 */
router.get('/me/prescriptions', verifyToken, async (req, res) => {
  try {
    const rxList = await Prescription.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(rxList);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/customers/me/prescriptions
 * @desc    Pre-upload new prescription
 * @access  Private
 */
router.post('/me/prescriptions', verifyToken, async (req, res) => {
  try {
    const { prescriptionUrl, fileName, fileSize } = req.body;
    if (!prescriptionUrl) {
      return res.status(400).json({ message: 'Prescription URL/data is required' });
    }

    const rx = await Prescription.create({
      userId: req.user.id,
      prescriptionUrl,
      fileName: fileName || 'prescription.png',
      fileSize: fileSize || 0,
      status: 'Pending Review'
    });

    res.status(201).json(rx);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/customers/me/reviews
 * @desc    Get customer written reviews
 * @access  Private
 */
router.get('/me/reviews', verifyToken, async (req, res) => {
  try {
    const { default: Medicine } = await import('../models/Medicine.js');
    const medicines = await Medicine.find({ 'reviews.user': req.user.id }).select('name brand image reviews');
    
    const userReviews = [];
    medicines.forEach(med => {
      if (med.reviews && med.reviews.length > 0) {
        med.reviews.forEach(rev => {
          if (rev.user && rev.user.toString() === req.user.id.toString()) {
            userReviews.push({
              _id: rev._id,
              medicineId: {
                _id: med._id,
                name: med.name,
                brand: med.brand,
                image: med.image
              },
              rating: rev.rating,
              comment: rev.comment,
              title: rev.title,
              isApproved: rev.isApproved,
              createdAt: rev.createdAt
            });
          }
        });
      }
    });

    res.json(userReviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Wishlist ────────────────────────────────────────────────────────────────

router.get('/me/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Legacy migration step
    const existingCount = await Wishlist.countDocuments({ userId: req.user.id });
    if (existingCount === 0 && user.wishlist && user.wishlist.length > 0) {
      const { default: Medicine } = await import('../models/Medicine.js');
      for (const prodId of user.wishlist) {
        const med = await Medicine.findById(prodId);
        if (med) {
          const startingPrice = med.discountPrice && med.discountPrice < med.price ? med.discountPrice : med.price;
          await Wishlist.create({
            userId: req.user.id,
            productId: prodId,
            priceAtAdd: startingPrice
          });
        }
      }
    }

    const list = await Wishlist.find({ userId: req.user.id }).populate('productId');
    const result = list.map(item => {
      if (!item.productId) return null;
      const prod = item.productId;
      const currentPrice = prod.discountPrice && prod.discountPrice < prod.price ? prod.discountPrice : prod.price;
      const priceDropped = currentPrice < item.priceAtAdd;

      return {
        _id: prod._id,
        wishlistId: item._id,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        discountPrice: prod.discountPrice,
        image: prod.image,
        countInStock: prod.countInStock,
        needsRx: prod.needsRx,
        category: prod.category,
        addedAt: item.addedAt,
        priceAtAdd: item.priceAtAdd,
        priceDropped,
        priceDropAmount: priceDropped ? (item.priceAtAdd - currentPrice) : 0
      };
    }).filter(Boolean);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/customers/me/wishlist/:productId
 * @desc    Add product to wishlist
 * @access  Private
 */
router.post('/me/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { default: Medicine } = await import('../models/Medicine.js');
    const med = await Medicine.findById(productId);
    if (!med) return res.status(404).json({ message: 'Product not found' });

    const startingPrice = med.discountPrice && med.discountPrice < med.price ? med.discountPrice : med.price;

    let wish = await Wishlist.findOne({ userId: req.user.id, productId });
    if (!wish) {
      wish = await Wishlist.create({
        userId: req.user.id,
        productId,
        priceAtAdd: startingPrice
      });
    }

    // Sync to legacy array for safety
    const user = await User.findById(req.user.id);
    if (user && !user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(201).json({ message: 'Product added to wishlist', wish });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/customers/me/wishlist/:productId
 * @desc    Remove product from wishlist
 * @access  Private
 */
router.delete('/me/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    await Wishlist.deleteOne({ userId: req.user.id, productId });

    // Sync to legacy array
    const user = await User.findById(req.user.id);
    if (user) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Notification Preferences ───────────────────────────────────────────────

/**
 * @route   PATCH /api/customers/me/notification-preferences
 * @desc    Update user's notification preferences
 * @access  Private
 */
router.patch('/me/notification-preferences', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { orderUpdates, promotionalOffers, prescriptionReminders, priceDropAlerts } = req.body;

    if (user.notificationPreferences === undefined) {
      user.notificationPreferences = {};
    }

    if (orderUpdates !== undefined) user.notificationPreferences.orderUpdates = !!orderUpdates;
    if (promotionalOffers !== undefined) user.notificationPreferences.promotionalOffers = !!promotionalOffers;
    if (prescriptionReminders !== undefined) user.notificationPreferences.prescriptionReminders = !!prescriptionReminders;
    if (priceDropAlerts !== undefined) user.notificationPreferences.priceDropAlerts = !!priceDropAlerts;

    await user.save();
    res.json(user.notificationPreferences);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── Security & Account Deletion ─────────────────────────────────────────────

/**
 * @route   PATCH /api/customers/me/password
 * @desc    Change password
 * @access  Private
 */
router.patch('/me/password', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both fields are required' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/customers/me/delete-account
 * @desc    Anonymize and soft-delete user account (retaining orders)
 * @access  Private
 */
router.post('/me/delete-account', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = 'Deleted Account';
    user.email = `deleted_${user._id}@mediquick.com`;
    user.phone = '0000000000';
    user.dob = null;
    user.addresses = [];
    user.isBlocked = true;
    user.deleted = true;

    await user.save();
    res.json({ message: 'Your account has been deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Helper to optionally get user from auth token
const getOptionalUser = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return null;
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return verified;
  } catch (error) {
    return null;
  }
};

/**
 * @route   POST /api/customers/recently-viewed
 * @desc    Track recently viewed product
 * @access  Public
 */
router.post('/recently-viewed', async (req, res) => {
  try {
    const { productId, sessionId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const verifiedUser = await getOptionalUser(req);
    const userId = verifiedUser ? verifiedUser.id : null;
    const finalSessionId = sessionId || 'guest-session';

    // Find if viewed recently (within 5 minutes) to update instead of creating duplicates
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    let view = await ViewHistory.findOne({
      productId,
      $or: [
        ...(userId ? [{ userId }] : []),
        { sessionId: finalSessionId }
      ],
      viewedAt: { $gte: fiveMinutesAgo }
    });

    if (view) {
      view.viewedAt = new Date();
      if (userId && !view.userId) {
        view.userId = userId;
      }
      await view.save();
    } else {
      view = new ViewHistory({
        userId,
        sessionId: finalSessionId,
        productId,
        viewedAt: new Date()
      });
      await view.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/customers/recently-viewed
 * @desc    Get recently viewed products for the current user/session
 * @access  Public
 */
router.get('/recently-viewed', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const verifiedUser = await getOptionalUser(req);
    const userId = verifiedUser ? verifiedUser.id : null;
    const finalSessionId = sessionId || 'guest-session';

    // Build query
    const query = {};
    if (userId) {
      query.$or = [{ userId }, { sessionId: finalSessionId }];
    } else {
      query.sessionId = finalSessionId;
    }

    // Get unique product views (last 10 unique product IDs)
    const views = await ViewHistory.find(query)
      .sort({ viewedAt: -1 })
      .populate('productId')
      .exec();

    // Filter out duplicate productIds and ensure product still exists (is not null)
    const seen = new Set();
    const uniqueProducts = [];
    for (const view of views) {
      if (view.productId && !seen.has(view.productId._id.toString())) {
        seen.add(view.productId._id.toString());
        uniqueProducts.push(view.productId);
        if (uniqueProducts.length >= 10) break;
      }
    }

    res.json(uniqueProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/customers/recommendations/based-on-orders
 * @desc    Get recommendations based on past order categories
 * @access  Private (Logged-in only)
 */
router.get('/recommendations/based-on-orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all past orders for the user
    const orders = await Order.find({ userId });
    
    if (!orders || orders.length === 0) {
      return res.json([]); // return empty array if no past orders
    }

    // Collect all purchased product IDs and their categories
    const purchasedProductIds = new Set();
    const categories = new Set();

    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId) {
            purchasedProductIds.add(item.productId.toString());
          }
        }
      }
    }

    // Retrieve categories of these purchased products
    const purchasedProducts = await Medicine.find({ _id: { $in: Array.from(purchasedProductIds) } });
    for (const prod of purchasedProducts) {
      if (prod.category) {
        categories.add(prod.category);
      }
    }

    if (categories.size === 0) {
      return res.json([]);
    }

    // Query products from these same categories that have NOT already been purchased
    const recommended = await Medicine.find({
      category: { $in: Array.from(categories) },
      _id: { $nin: Array.from(purchasedProductIds) },
      isActive: { $ne: false } // ensure they are active products
    })
    .limit(10)
    .exec();

    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
