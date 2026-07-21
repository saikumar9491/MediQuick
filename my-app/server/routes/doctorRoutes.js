import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Doctor from '../models/Doctor.js';
import DoctorAppointment from '../models/DoctorAppointment.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage for E-Prescription PDF uploads
const prescriptionDir = process.env.VERCEL ? '/tmp' : 'uploads/prescriptions/';
try {
  if (!fs.existsSync(prescriptionDir)) {
    fs.mkdirSync(prescriptionDir, { recursive: true });
  }
} catch (err) {
  console.warn('Serverless environment: Using /tmp for prescriptions');
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, prescriptionDir);
  },
  filename(req, file, cb) {
    cb(null, `rx_${Date.now()}_${path.basename(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Image files are allowed for prescriptions'));
    }
  }
});

// @desc    Get all active doctors with specialization & search filters
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = { isActive: true, isVerified: true };

    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: new RegExp(`^${specialization.trim()}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualifications: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query).sort({ rating: -1, createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in customer's appointments
// @route   GET /api/doctors/my-appointments
// @access  Private
router.get('/my-appointments', verifyToken, async (req, res) => {
  try {
    const appointments = await DoctorAppointment.find({ customerId: req.user.id })
      .populate('doctorId', 'name photo qualifications specialization consultationFee')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a doctor consultation appointment
// @route   POST /api/doctors/appointments
// @access  Private
router.post('/appointments', verifyToken, async (req, res) => {
  const {
    doctorId,
    patientName,
    patientAge,
    patientGender,
    scheduledDate,
    scheduledTimeSlot,
    mode,
    symptomNotes,
    paymentMethod,
    paymentStatus
  } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Selected doctor profile not found' });
    }

    const appointment = new DoctorAppointment({
      customerId: req.user.id,
      doctorId,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      scheduledDate,
      scheduledTimeSlot,
      mode: mode || 'video',
      symptomNotes,
      paymentMethod: paymentMethod || 'Online',
      paymentStatus: paymentStatus || (paymentMethod === 'Online' ? 'Paid' : 'Pending'),
      joinLink: `https://mediquick.telehealth.live/room/${Date.now().toString(36)}`
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Cancel an appointment (Customer)
// @route   POST /api/doctors/appointments/:id/cancel
// @access  Private
router.post('/appointments/:id/cancel', verifyToken, async (req, res) => {
  try {
    const appointment = await DoctorAppointment.findOne({
      _id: req.params.id,
      customerId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    if (appointment.status !== 'Scheduled') {
      return res.status(400).json({ message: 'Only scheduled appointments can be cancelled' });
    }

    appointment.status = 'Cancelled';
    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN MANAGEMENT ENDPOINTS =================

// @desc    Get all appointments (Admin)
// @route   GET /api/doctors/admin/appointments
// @access  Private/Admin
router.get('/admin/appointments', verifyToken, isAdmin, async (req, res) => {
  try {
    const appointments = await DoctorAppointment.find({})
      .populate('doctorId', 'name specialization qualifications')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all doctors list (Admin)
// @route   GET /api/doctors/admin/list
// @access  Private/Admin
router.get('/admin/list', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a doctor (Admin)
// @route   POST /api/doctors/admin/add
// @access  Private/Admin
router.post('/admin/add', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const created = await doctor.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Edit doctor (Admin)
// @route   PUT /api/doctors/admin/edit/:id
// @access  Private/Admin
router.put('/admin/edit/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete doctor (Admin)
// @route   DELETE /api/doctors/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update appointment status & upload E-Prescription (Admin)
// @route   PUT /api/doctors/admin/appointments/:id
// @access  Private/Admin
router.put('/admin/appointments/:id', verifyToken, isAdmin, upload.single('prescription'), async (req, res) => {
  try {
    const appointment = await DoctorAppointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.body.status) appointment.status = req.body.status;
    if (req.body.paymentStatus) appointment.paymentStatus = req.body.paymentStatus;
    if (req.file) {
      appointment.prescriptionFileUrl = `/uploads/prescriptions/${req.file.filename}`;
    }

    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single doctor details (MUST BE AT END OF FILE)
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
