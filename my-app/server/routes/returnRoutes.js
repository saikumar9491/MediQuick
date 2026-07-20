import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Return from '../models/Return.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// GET /api/returns - Paginated list
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, reason } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (reason && reason !== 'All') query.reason = reason;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingUsers = await User.find({ name: searchRegex }).select('_id');
      const matchingUserIds = matchingUsers.map(u => u._id);

      const matchingOrders = await Order.find({ _id: mongoose.Types.ObjectId.isValid(search) ? search : null }).select('_id');
      const matchingOrderIds = matchingOrders.map(o => o._id);

      query.$or = [
        { returnId: searchRegex },
        { customerId: { $in: matchingUserIds } },
        ...(matchingOrderIds.length > 0 ? [{ orderId: { $in: matchingOrderIds } }] : [])
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const returns = await Return.find(query)
      .populate('customerId', 'name phone email')
      .populate('orderId', 'totalAmount status paymentMethod paymentStatus')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Return.countDocuments(query);

    res.json({
      returns,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching returns", error: err.message });
  }
});

// GET /api/admin/stats/returns-summary
router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalRequests = await Return.countDocuments();
    const pendingReview = await Return.countDocuments({ status: { $in: ['Requested', 'Under Review'] } });
    const approved = await Return.countDocuments({ status: 'Approved' });
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const refundedThisMonth = await Return.countDocuments({ 
      status: 'Refunded',
      refundedAt: { $gte: startOfMonth }
    });

    const refundedReturns = await Return.find({ status: 'Refunded' });
    const totalRefundedAmount = refundedReturns.reduce((sum, ret) => {
      return sum + ret.items.reduce((itemSum, item) => itemSum + item.refundAmount, 0);
    }, 0);

    res.json({
      totalRequests,
      pendingReview,
      approved,
      refundedThisMonth,
      totalRefundedAmount
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating stats", error: err.message });
  }
});

// GET /api/returns/:id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const ret = await Return.findById(req.params.id)
      .populate('customerId', 'name phone email')
      .populate('orderId')
      .populate('statusHistory.changedBy', 'name')
      .populate('adminNotes.adminName'); // Assuming adminName is string in model, no populate needed actually
      
    if (!ret) return res.status(404).json({ message: "Return not found" });
    res.json(ret);
  } catch (err) {
    res.status(500).json({ message: "Error fetching return details", error: err.message });
  }
});

// PATCH /api/returns/:id/status
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, noteText } = req.body;
    const ret = await Return.findById(req.params.id);
    if (!ret) return res.status(404).json({ message: "Return not found" });

    ret.status = status;
    ret.statusHistory.push({
      status,
      changedBy: req.user.id
    });

    if (noteText) {
      ret.adminNotes.push({
        text: `Status changed to ${status}. Reason: ${noteText}`,
        adminName: req.user.name || 'Admin' // Adjust depending on user payload
      });
    }

    await ret.save();
    res.json({ message: "Status updated", returnRequest: ret });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

// POST /api/returns/:id/process-refund
router.post('/:id/process-refund', verifyToken, isAdmin, async (req, res) => {
  try {
    const ret = await Return.findById(req.params.id).populate('orderId');
    if (!ret) return res.status(404).json({ message: "Return not found" });

    // Simulate Payment Gateway Refund (Razorpay)
    const mockTransactionId = 'rfnd_' + Math.floor(Math.random() * 9999999999);
    
    ret.status = 'Refunded';
    ret.refundMethod = 'Original Source';
    ret.refundReference = mockTransactionId;
    ret.statusHistory.push({ status: 'Refunded', changedBy: req.user.id });
    
    ret.adminNotes.push({
      text: `Processed online refund via payment gateway. Ref: ${mockTransactionId}`,
      adminName: req.user.name || 'System'
    });

    await ret.save();

    // Optionally update order status
    if (ret.orderId) {
      ret.orderId.paymentStatus = 'Refunded';
      await ret.orderId.save();
    }

    res.json({ message: "Refund processed successfully", returnRequest: ret });
  } catch (err) {
    res.status(500).json({ message: "Error processing refund", error: err.message });
  }
});

// PATCH /api/returns/:id/mark-refunded
router.patch('/:id/mark-refunded', verifyToken, isAdmin, async (req, res) => {
  try {
    const { method, reference, noteText } = req.body;
    const ret = await Return.findById(req.params.id).populate('orderId');
    if (!ret) return res.status(404).json({ message: "Return not found" });

    ret.status = 'Refunded';
    ret.refundMethod = method || 'Manual';
    ret.refundReference = reference;
    ret.statusHistory.push({ status: 'Refunded', changedBy: req.user.id });
    
    if (noteText) {
      ret.adminNotes.push({ text: noteText, adminName: req.user.name || 'Admin' });
    }

    await ret.save();

    if (ret.orderId) {
      ret.orderId.paymentStatus = 'Refunded';
      await ret.orderId.save();
    }

    res.json({ message: "Marked as refunded", returnRequest: ret });
  } catch (err) {
    res.status(500).json({ message: "Error marking as refunded", error: err.message });
  }
});

// POST /api/returns/:id/notes
router.post('/:id/notes', verifyToken, isAdmin, async (req, res) => {
  try {
    const { text, adminName } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    const ret = await Return.findById(req.params.id);
    if (!ret) return res.status(404).json({ message: "Return not found" });

    ret.adminNotes.push({ text, adminName: adminName || req.user.name || 'Admin' });
    await ret.save();

    res.json({ message: "Note added", adminNotes: ret.adminNotes });
  } catch (err) {
    res.status(500).json({ message: "Error adding note", error: err.message });
  }
});

export default router;
