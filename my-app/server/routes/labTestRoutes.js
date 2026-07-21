import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import LabTest from '../models/LabTest.js';
import LabTestBooking from '../models/LabTestBooking.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage configuration for PDF reports
const reportDir = process.env.VERCEL ? '/tmp' : 'uploads/reports/';
try {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
} catch (err) {
  console.warn('Serverless environment: Using /tmp for reports');
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, reportDir);
  },
  filename(req, file, cb) {
    cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ================= CUSTOMER PORTAL ENDPOINTS =================

// @desc    Get all active tests with category & search filters
// @route   GET /api/lab-tests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { parameters: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const tests = await LabTest.find(query).sort(sortOption);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// @desc    Create a diagnostic booking
// @route   POST /api/lab-test-bookings
// @access  Private
router.post('/bookings', verifyToken, async (req, res) => {
  const {
    testId,
    patientName,
    patientAge,
    patientGender,
    scheduledDate,
    scheduledTimeSlot,
    address,
    paymentMethod
  } = req.body;

  try {
    const test = await LabTest.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Selected test package not found' });
    }

    const { paymentStatus } = req.body;
    const booking = new LabTestBooking({
      customerId: req.user.id,
      testId,
      patientName,
      patientAge,
      patientGender,
      scheduledDate,
      scheduledTimeSlot,
      address,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || (paymentMethod === 'Online' ? 'Paid' : 'Pending')
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get logged in customer's bookings
// @route   GET /api/customers/me/lab-bookings
// @access  Private
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await LabTestBooking.find({ customerId: req.user.id })
      .populate('testId', 'name price discountedPrice turnaroundHours')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Cancel a diagnostic booking (Customer)
// @route   POST /api/lab-tests/bookings/:id/cancel
// @access  Private
router.post('/bookings/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await LabTestBooking.findOne({
      _id: req.params.id,
      customerId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    if (booking.status !== 'Scheduled') {
      return res.status(400).json({ message: 'Only scheduled bookings can be cancelled' });
    }

    booking.status = 'Cancelled';
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN MANAGEMENT ENDPOINTS =================

// @desc    Get all bookings (Admin)
// @route   GET /api/lab-test-bookings
// @access  Private/Admin
router.get('/admin/bookings', verifyToken, isAdmin, async (req, res) => {
  try {
    const bookings = await LabTestBooking.find({})
      .populate('testId', 'name price')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single test package details
// @route   GET /api/lab-tests/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Lab test package not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a test package
// @route   POST /api/lab-tests
// @access  Private/Admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, description, parameters, sampleType, prepInstructions, price, discountedPrice, turnaroundHours, category } = req.body;

  try {
    const newTest = new LabTest({
      name,
      description,
      parameters: Array.isArray(parameters) ? parameters : parameters.split(',').map(p => p.trim()),
      sampleType,
      prepInstructions,
      price,
      discountedPrice,
      turnaroundHours,
      category
    });

    const createdTest = await newTest.save();
    res.status(201).json(createdTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a test package
// @route   PUT /api/lab-tests/:id
// @access  Private/Admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, description, parameters, sampleType, prepInstructions, price, discountedPrice, turnaroundHours, category, isActive } = req.body;

  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    test.name = name || test.name;
    test.description = description || test.description;
    if (parameters) {
      test.parameters = Array.isArray(parameters) ? parameters : parameters.split(',').map(p => p.trim());
    }
    test.sampleType = sampleType || test.sampleType;
    test.prepInstructions = prepInstructions !== undefined ? prepInstructions : test.prepInstructions;
    test.price = price || test.price;
    test.discountedPrice = discountedPrice !== undefined ? discountedPrice : test.discountedPrice;
    test.turnaroundHours = turnaroundHours || test.turnaroundHours;
    test.category = category || test.category;
    test.isActive = isActive !== undefined ? isActive : test.isActive;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a test package
// @route   DELETE /api/lab-tests/:id
// @access  Private/Admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    await LabTest.deleteOne({ _id: req.params.id });
    res.json({ message: 'Test package removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Transition booking statuses
// @route   PATCH /api/lab-test-bookings/:id/status
// @access  Private/Admin
router.patch('/bookings/:id/status', verifyToken, isAdmin, async (req, res) => {
  const { status, collectionAgentId, paymentStatus } = req.body;
  try {
    const booking = await LabTestBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (collectionAgentId) booking.collectionAgentId = collectionAgentId;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Upload report PDF for customer
// @route   POST /api/lab-test-bookings/:id/upload-report
// @access  Private/Admin
router.post('/bookings/:id/upload-report', verifyToken, isAdmin, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No report file provided' });
    }

    const booking = await LabTestBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const reportFileUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    booking.reportFileUrl = reportFileUrl;
    booking.status = 'Report Ready'; // Automatically transition status
    await booking.save();

    res.json({
      message: 'Report uploaded successfully',
      reportFileUrl,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
