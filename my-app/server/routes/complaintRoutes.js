import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/complaints - Create a new complaint (Customer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { orderId, category, priority, description, images } = req.body;
    
    if (!category || !description) {
      return res.status(400).json({ message: "Category and description are required" });
    }

    const complaint = new Complaint({
      customerId: req.user._id,
      orderId: orderId || undefined,
      category,
      priority: priority || 'Medium',
      description,
      images: images || []
    });

    complaint.statusHistory.push({
      status: 'New',
      changedBy: req.user._id
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint raised successfully", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error raising complaint", error: err.message });
  }
});

// GET /api/complaints - Paginated list with filters
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority, category } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;

    // Build search conditions
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const matchingUsers = await User.find({ name: searchRegex }).select('_id');
      const matchingUserIds = matchingUsers.map(u => u._id);

      query.$or = [
        { complaintId: searchRegex },
        { customerId: { $in: matchingUserIds } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(query)
      .populate('customerId', 'name phone email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints", error: err.message });
  }
});

// GET /api/complaints/stats/summary - for the stats strip
router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const newOrUnassigned = await Complaint.countDocuments({ 
      $or: [{ status: 'New' }, { assignedTo: { $exists: false } }] 
    });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    
    // Resolved today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const resolvedToday = await Complaint.countDocuments({ 
      status: 'Resolved',
      resolvedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Avg resolution time
    const resolvedComplaints = await Complaint.find({ status: 'Resolved', resolvedAt: { $exists: true } });
    let avgResolutionHrs = 0;
    if (resolvedComplaints.length > 0) {
      const totalMs = resolvedComplaints.reduce((acc, c) => acc + (new Date(c.resolvedAt) - new Date(c.createdAt)), 0);
      avgResolutionHrs = (totalMs / resolvedComplaints.length / (1000 * 60 * 60)).toFixed(1);
    }

    res.json({
      total,
      newOrUnassigned,
      inProgress,
      resolvedToday,
      avgResolutionHrs
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating stats", error: err.message });
  }
});

// GET /api/complaints/:id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customerId', 'name phone email')
      .populate('orderId')
      .populate('assignedTo', 'name')
      .populate('statusHistory.changedBy', 'name');
      
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaint", error: err.message });
  }
});

// PATCH /api/complaints/:id/status
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, resolutionNotes, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (status && status !== complaint.status) {
      complaint.status = status;
      complaint.statusHistory.push({
        status,
        changedBy: req.user.id
      });
    }
    
    if (priority) complaint.priority = priority;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;

    await complaint.save();
    
    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('customerId', 'name phone email')
      .populate('assignedTo', 'name');
      
    res.json({ message: "Status updated", complaint: updatedComplaint });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

// PATCH /api/complaints/:id/assign
router.patch('/:id/assign', verifyToken, isAdmin, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name').populate('customerId', 'name phone email');
    
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Assigned successfully", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error assigning complaint", error: err.message });
  }
});

// POST /api/complaints/:id/notes
router.post('/:id/notes', verifyToken, isAdmin, async (req, res) => {
  try {
    const { text, adminName } = req.body;
    if (!text || !adminName) return res.status(400).json({ message: "Text and adminName required" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.internalNotes.push({ text, adminName });
    await complaint.save();

    res.json({ message: "Note added", internalNotes: complaint.internalNotes });
  } catch (err) {
    res.status(500).json({ message: "Error adding note", error: err.message });
  }
});

export default router;
