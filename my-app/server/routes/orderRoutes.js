import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Cart from '../models/Cart.js';
import Medicine from '../models/Medicine.js';

const router = express.Router();

/**
 * @desc    Pre-flight checkout validation
 * @route   POST /api/orders/validate-checkout
 * @access  Private
 */
router.post('/validate-checkout', verifyToken, async (req, res) => {
  try {
    const { items, couponCode, subtotal, pincode, rxRequired, prescriptionUrl } = req.body;
    const { default: Medicine } = await import('../models/Medicine.js');
    const errors = [];

    // 1. Stock check for all items
    for (const item of items) {
      const med = await Medicine.findById(item.productId);
      if (!med) { errors.push(`Product not found: ${item.name}`); continue; }
      if (med.countInStock < item.quantity) {
        errors.push(`Only ${med.countInStock} units of "${item.name}" left in stock`);
      }
    }

    // 2. Coupon validation (if provided)
    let couponResult = null;
    if (couponCode) {
      const { default: Coupon } = await import('../models/Coupon.js');
      const now = new Date();
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (!coupon || !coupon.isActive || now > coupon.validTo || now < coupon.validFrom) {
        errors.push('Coupon is invalid or expired');
      } else if (subtotal < coupon.minOrderValue) {
        errors.push(`Coupon requires a minimum order of ₹${coupon.minOrderValue}`);
      } else if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        errors.push('Coupon usage limit reached');
      } else {
        couponResult = { couponId: coupon._id };
      }
    }

    // 3. Delivery zone check
    if (pincode) {
      const { default: DeliveryZone } = await import('../models/DeliveryZone.js');
      const { default: Hub } = await import('../models/Hub.js');
      const zone = await DeliveryZone.findOne({ pincodes: pincode, isActive: true });
      if (!zone) {
        errors.push(`Delivery is not available to pincode ${pincode}`);
      } else {
        const hub = await Hub.findOne({ servedZones: zone._id, isActive: true });
        if (!hub) errors.push(`No fulfillment hub is available for pincode ${pincode}`);
      }
    }

    // 4. Prescription check
    if (rxRequired && !prescriptionUrl) {
      errors.push('A valid prescription is required for one or more items in your cart');
    }

    if (errors.length > 0) {
      return res.status(400).json({ valid: false, errors });
    }

    res.json({ valid: true, couponResult });
  } catch (err) {
    res.status(500).json({ message: 'Checkout validation failed', error: err.message });
  }
});


/**
 * @desc    Create New Order & Clear Hub Cart
 * @route   POST /api/orders
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const isPOS = req.body.orderType === 'pos';
    const { items, couponId, discountApplied, prescriptionUrl, shippingAddress, deliveryDateString } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const { default: Medicine } = await import('../models/Medicine.js');

    // Final stock verification (race-condition safety net)
    for (const item of items) {
      const medicine = await Medicine.findById(item.productId);
      if (!medicine) return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (medicine.countInStock < item.quantity) {
        return res.status(400).json({
          message: `"${item.name}" just went out of stock. Only ${medicine.countInStock} units remain.`
        });
      }
    }

    // Build order object
    const newOrder = new Order({
      ...req.body,
      userId: isPOS ? (req.body.userId || req.user.id) : req.user.id,
      couponId: couponId || undefined,
      discountApplied: discountApplied || 0,
      prescriptionUrl: prescriptionUrl || undefined,
      deliveryDateString: deliveryDateString || undefined,
    });

    if (isPOS) {
      newOrder.status = 'Delivered';
      newOrder.paymentStatus = 'Paid';
    } else if (shippingAddress?.pincode) {
      // Auto-assign zone based on pincode
      const { default: DeliveryZone } = await import('../models/DeliveryZone.js');
      const zone = await DeliveryZone.findOne({ pincodes: shippingAddress.pincode, isActive: true });
      if (zone) newOrder.zoneId = zone._id;
    }

    const savedOrder = await newOrder.save();

    // Clear user cart (online orders) & push order reference to user.orders array
    const targetUserId = isPOS ? (req.body.userId || req.user.id) : req.user.id;
    if (targetUserId) {
      const updateQuery = !isPOS 
        ? { $set: { cart: [] }, $addToSet: { orders: savedOrder._id } }
        : { $addToSet: { orders: savedOrder._id } };
      await User.findByIdAndUpdate(targetUserId, updateQuery);
    }

    // Atomic stock deduction with race-condition guard
    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item.productId, countInStock: { $gte: item.quantity } },
        update: { $inc: { countInStock: -item.quantity } }
      }
    }));
    await Medicine.bulkWrite(bulkOps);

    // Increment coupon usedCount if coupon was applied
    if (couponId) {
      const { default: Coupon } = await import('../models/Coupon.js');
      await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order Placement Error:', err.message);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
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
    const { page = 1, limit = 10, search, status, paymentStatus, dateFrom, dateTo } = req.query;
    
    // Build filter object
    const query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(new Date(dateTo).setHours(23, 59, 59, 999));
    }

    if (search) {
      // Find matching users first if search might be customer name or phone
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = users.map(u => u._id);

      // Check if search matches Order ID directly (needs to be valid ObjectId)
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      
      if (isValidObjectId) {
        query.$or = [{ _id: search }, { userId: { $in: userIds } }];
      } else {
        query.userId = { $in: userIds };
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    console.log(`[Order API] Fetched ${orders.length} orders. Total: ${total}. Query:`, JSON.stringify(query));

    res.json({
      data: orders,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
});

/**
 * @desc    Get Order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone');
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    // Authorization check
    if (order.userId._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
});

/**
 * @desc    Update Order Status (Admin)
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const statusFlow = ['Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];
    
    // Prevent skipping forwards illogically (except Cancelled which can happen anytime)
    if (status !== 'Cancelled' && order.status !== 'Cancelled') {
      const currentIndex = statusFlow.indexOf(order.status);
      const newIndex = statusFlow.indexOf(status);
      
      if (newIndex === -1) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      if (newIndex < currentIndex) {
        return res.status(400).json({ message: `Cannot move status backwards from ${order.status} to ${status}` });
      }
      
      if (newIndex > currentIndex + 1 && currentIndex !== -1) {
         // Allow skipping intermediate if needed but usually better to prevent jumping too far
         // Let's enforce strictly sequential for now, except maybe Out for Delivery -> Delivered
         if (newIndex > currentIndex + 2) {
           return res.status(400).json({ message: `Cannot skip multiple statuses. Current is ${order.status}` });
         }
      }
    }

    // Process refund logic if cancelled and already paid
    if (status === 'Cancelled' && order.status !== 'Cancelled' && order.paymentStatus === 'Paid') {
      const customer = await User.findById(order.userId);
      if (customer) {
        customer.walletBalance = (customer.walletBalance || 0) + order.totalAmount;
        await customer.save();
        order.isRefunded = true;
        order.paymentStatus = 'Refunded';
      }
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    // Create rating submission notification if status is Delivered
    if (status === 'Delivered') {
      try {
        const reviewPromptNotif = new Notification({
          title: 'Rate Your Purchased Items',
          message: `Your order #${order._id} has been delivered. Tap here to rate and review the products to share your experience!`,
          channels: ['push', 'email'],
          audienceType: 'Custom',
          status: 'Sent',
          sentAt: new Date(),
          recipientCount: 1,
          deliveredCount: 1,
          createdBy: req.user._id
        });
        await reviewPromptNotif.save();
      } catch (notifErr) {
        console.error('Error creating delivery review notification prompt:', notifErr);
      }
    }
    
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
});

/**
 * @desc    Assign Delivery Agent (Admin)
 * @route   PUT /api/orders/:id/assign-agent
 * @access  Private/Admin
 */
router.put('/:id/assign-agent', verifyToken, isAdmin, async (req, res) => {
  try {
    const { agentName } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.assignedAgent = agentName;
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(550).json({ message: "Error assigning delivery agent", error: err.message });
  }
});

/**
 * @desc    Process Return/Refund Request (Admin)
 * @route   PUT /api/orders/:id/refund
 * @access  Private/Admin
 */
router.put('/:id/refund', verifyToken, isAdmin, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (action === 'approve') {
      order.isRefunded = true;
      order.isReturnRequested = false;
      order.status = 'Cancelled';
      
      // Credit wallet
      const customer = await User.findById(order.userId);
      if (customer) {
        customer.walletBalance = (customer.walletBalance || 0) + order.totalAmount;
        await customer.save();
      }
    } else {
      order.isReturnRequested = false;
    }
    
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error processing refund", error: err.message });
  }
});

/**
 * @desc    Re-validate stock and prices, then add items back to Cart
 * @route   POST /api/orders/:id/reorder
 * @access  Private
 */
router.post('/:id/reorder', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reorder from this order" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });

    const warnings = [];
    const addedItems = [];

    for (const item of order.items) {
      const med = await Medicine.findById(item.productId || item._id);
      if (!med || !med.isActive) {
        warnings.push(`"${item.name}" is no longer available.`);
        continue;
      }
      if (med.countInStock === 0) {
        warnings.push(`"${item.name}" is out of stock.`);
        continue;
      }

      const quantityToAdd = Math.min(item.quantity, med.countInStock);
      if (quantityToAdd < item.quantity) {
        warnings.push(`Only ${med.countInStock} units of "${item.name}" were added due to low stock.`);
      }

      // Check if already in cart
      const existing = cart.items.find(i => i.productId.toString() === med._id.toString());
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantityToAdd, med.countInStock);
      } else {
        cart.items.push({
          productId: med._id,
          name: med.name,
          brand: med.brand,
          price: med.price,
          discountPrice: med.discountPrice || undefined,
          image: med.image,
          needsRx: med.needsRx,
          quantity: quantityToAdd
        });
      }
      addedItems.push(med.name);
    }

    await cart.save();
    res.json({
      success: addedItems.length > 0,
      addedItems,
      warnings
    });
  } catch (err) {
    res.status(500).json({ message: "Reorder failed", error: err.message });
  }
});

/**
 * @desc    Generate printable invoice HTML
 * @route   GET /api/orders/:id/invoice
 * @access  Private
 */
router.get('/:id/invoice', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this invoice" });
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #334155; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #2563eb; }
            .meta { font-size: 12px; color: #64748b; margin-top: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; }
            .addr-box { font-size: 13px; margin-top: 5px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { border-bottom: 1px solid #cbd5e1; text-align: left; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #475569; }
            td { border-bottom: 1px solid #f1f5f9; padding: 12px 0; font-size: 13px; }
            .totals { margin-left: auto; width: 250px; font-size: 13px; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
            .grand-total { font-weight: bold; font-size: 16px; border-top: 1px solid #cbd5e1; padding-top: 8px; color: #0f172a; }
            .footer { font-size: 11px; text-align: center; color: #94a3b8; margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">MediQuick Pharmacy Invoice</div>
            <div class="meta">Order ID: ${order._id} &middot; Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="grid">
            <div>
              <div class="section-title">Billed To</div>
              <div class="addr-box">
                <strong>${order.shippingAddress?.name || ''}</strong><br/>
                ${order.shippingAddress?.addressLine1 || ''}<br/>
                ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br/>' : ''}
                ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}<br/>
                Phone: ${order.shippingAddress?.phone || ''}
              </div>
            </div>
            <div>
              <div class="section-title">Payment Information</div>
              <div class="addr-box">
                Method: ${order.paymentMethod}<br/>
                Status: ${order.paymentStatus}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Price</th>
                <th>Qty</th>
                <th style="text-align: right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    <strong>${item.name}</strong><br/>
                    <span style="font-size: 10px; color: #64748b;">${item.brand || ''}</span>
                  </td>
                  <td>₹${item.price}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right">₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${order.totalAmount + (order.discountApplied || 0)}</span>
            </div>
            ${order.discountApplied ? `
              <div class="totals-row" style="color: #10b981">
                <span>Discount Applied:</span>
                <span>-₹${order.discountApplied}</span>
              </div>
            ` : ''}
            <div class="totals-row grand-total">
              <span>Grand Total:</span>
              <span>₹${order.totalAmount}</span>
            </div>
          </div>
          <div class="footer">
            Thank you for choosing MediQuick. This is a computer generated invoice and does not require a physical signature.
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ message: "Error generating invoice", error: err.message });
  }
});

export default router;