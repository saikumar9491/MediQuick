import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Vehicle from '../models/Vehicle.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

const router = express.Router();

// GET /api/fleet/vehicles
router.get('/vehicles', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.plateNumber = new RegExp(search, 'i');
    }

    const vehicles = await Vehicle.find(query)
      .populate('assignedRiderId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicles", error: err.message });
  }
});

// GET /api/admin/stats/fleet-summary
router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const active = await Vehicle.countDocuments({ status: 'Active' });
    const underMaintenance = await Vehicle.countDocuments({ status: 'Maintenance Due' });
    const unassigned = await Vehicle.countDocuments({ assignedRiderId: null });

    res.json({ totalVehicles, active, underMaintenance, unassigned });
  } catch (err) {
    res.status(500).json({ message: "Error fetching fleet stats", error: err.message });
  }
});

// POST /api/fleet/vehicles
router.post('/vehicles', verifyToken, isAdmin, async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: "Error creating vehicle", error: err.message });
  }
});

// PATCH /api/fleet/vehicles/:id
router.patch('/vehicles/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const prevStatus = vehicle.status;
    const newStatus = req.body.status;

    Object.assign(vehicle, req.body);
    await vehicle.save();

    // Sync rider status if maintenance flag changes
    if (vehicle.assignedRiderId && prevStatus !== newStatus) {
      if (newStatus === 'Maintenance Due' || newStatus === 'Out of Service') {
        await DeliveryPartner.findByIdAndUpdate(vehicle.assignedRiderId, { status: 'off-duty' });
      }
    }

    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: "Error updating vehicle", error: err.message });
  }
});

// DELETE /api/fleet/vehicles/:id
router.delete('/vehicles/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting vehicle", error: err.message });
  }
});

export default router;
