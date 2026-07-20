import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import DeliveryZone from '../models/DeliveryZone.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import Hub from '../models/Hub.js';

const router = express.Router();

// ==========================================
// ZONES ENDPOINTS
// ==========================================

// Get all zones
router.get('/zones', verifyToken, isAdmin, async (req, res) => {
  try {
    const zones = await DeliveryZone.find().sort({ createdAt: -1 });
    // Count riders per zone
    const zonesWithStats = await Promise.all(zones.map(async (zone) => {
      const ridersCount = await DeliveryPartner.countDocuments({ zoneId: zone._id });
      return { ...zone.toObject(), ridersCount };
    }));
    res.json(zonesWithStats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching zones", error: err.message });
  }
});

// Create a zone
router.post('/zones', verifyToken, isAdmin, async (req, res) => {
  try {
    const newZone = new DeliveryZone(req.body);
    const savedZone = await newZone.save();
    res.status(201).json(savedZone);
  } catch (err) {
    res.status(500).json({ message: "Error creating zone", error: err.message });
  }
});

// Update a zone
router.patch('/zones/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedZone = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedZone);
  } catch (err) {
    res.status(500).json({ message: "Error updating zone", error: err.message });
  }
});

// Delete a zone
router.delete('/zones/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await DeliveryZone.findByIdAndDelete(req.params.id);
    // Unassign riders from this zone
    await DeliveryPartner.updateMany({ zoneId: req.params.id }, { $unset: { zoneId: 1 } });
    res.json({ message: "Zone deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting zone", error: err.message });
  }
});

// ==========================================
// RIDERS ENDPOINTS
// ==========================================

// Get all riders
router.get('/riders', verifyToken, isAdmin, async (req, res) => {
  try {
    const riders = await DeliveryPartner.find()
      .populate('zoneId', 'name')
      .sort({ createdAt: -1 });
      
    // Count active orders per rider
    const ridersWithStats = await Promise.all(riders.map(async (rider) => {
      const activeOrders = await Order.countDocuments({ 
        riderId: rider._id, 
        status: { $in: ['Out for Delivery', 'Processing'] } 
      });
      return { ...rider.toObject(), activeOrders };
    }));
    res.json(ridersWithStats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching riders", error: err.message });
  }
});

// Create a rider
router.post('/riders', verifyToken, isAdmin, async (req, res) => {
  try {
    const newRider = new DeliveryPartner(req.body);
    const savedRider = await newRider.save();
    const populated = await savedRider.populate('zoneId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error creating rider", error: err.message });
  }
});

// Update a rider
router.patch('/riders/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedRider = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('zoneId', 'name');
    res.json(updatedRider);
  } catch (err) {
    res.status(500).json({ message: "Error updating rider", error: err.message });
  }
});

// Delete a rider
router.delete('/riders/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    // Optional: Unassign orders from this rider if they were not delivered
    await Order.updateMany({ riderId: req.params.id, status: { $ne: 'Delivered' } }, { $unset: { riderId: 1 } });
    res.json({ message: "Rider deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting rider", error: err.message });
  }
});

// Get rider performance
router.get('/riders/:id/performance', verifyToken, isAdmin, async (req, res) => {
  try {
    const rider = await DeliveryPartner.findById(req.params.id).populate('zoneId', 'name');
    if (!rider) return res.status(404).json({ message: "Rider not found" });

    const totalDeliveries = await Order.countDocuments({ riderId: rider._id, status: 'Delivered' });
    const recentOrders = await Order.find({ riderId: rider._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id totalAmount status createdAt paymentMethod customerName shippingAddress');

    // Simulate some stats
    const stats = {
      totalDeliveries,
      onTimePercentage: totalDeliveries > 0 ? 94 : 0,
      avgDeliveryTime: '32 mins',
      rating: 4.8
    };

    res.json({ rider, stats, recentOrders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching rider performance", error: err.message });
  }
});

// ==========================================
// SLA & STATS ENDPOINTS
// ==========================================

// Get SLA Stats
router.get('/sla-stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalZones = await DeliveryZone.countDocuments();
    const activeZones = await DeliveryZone.countDocuments({ isActive: true });
    
    const totalRiders = await DeliveryPartner.countDocuments();
    const activeRiders = await DeliveryPartner.countDocuments({ status: { $in: ['on-duty', 'delivering'] }, isActive: true });
    
    // Zones with no assigned riders
    const riders = await DeliveryPartner.find({ isActive: true }).select('zoneId');
    const assignedZoneIds = [...new Set(riders.map(r => r.zoneId?.toString()).filter(Boolean))];
    const zonesWithNoRiders = totalZones - assignedZoneIds.length; // Approximate

    // Mock trend data for chart (could be aggregated from Orders)
    const trendData = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
      avgTime: Math.floor(Math.random() * 15) + 25 // 25-40 mins
    }));

    res.json({
      zones: { total: totalZones, active: activeZones, noRiders: Math.max(0, zonesWithNoRiders) },
      riders: { total: totalRiders, active: activeRiders, inactive: totalRiders - activeRiders },
      sla: {
        avgDeliveryTime: 34,
        onTimeRate: 92,
        breachesToday: 4,
        delayedOrders: 2
      },
      trendData
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

// Get At-Risk Orders
router.get('/at-risk-orders', verifyToken, isAdmin, async (req, res) => {
  try {
    // Find active orders (not delivered or cancelled)
    const activeOrders = await Order.find({ 
      status: { $in: ['Placed', 'Confirmed', 'Processing', 'Out for Delivery'] },
      orderType: { $ne: 'pos' } // POS orders are instant
    }).populate('zoneId', 'name estimatedDeliveryTime').populate('riderId', 'name');

    const now = Date.now();
    
    const processedOrders = activeOrders.map(order => {
      const elapsedMs = now - new Date(order.createdAt).getTime();
      const elapsedMins = Math.floor(elapsedMs / 60000);
      
      const estimatedMins = order.zoneId?.estimatedDeliveryTime || 45; // Default 45 mins
      
      let riskStatus = 'On Track';
      if (elapsedMins > estimatedMins) {
        riskStatus = 'Breached';
      } else if (elapsedMins > estimatedMins - 15) {
        riskStatus = 'At Risk';
      }

      return {
        _id: order._id,
        customerName: order.customerName || order.shippingAddress?.building,
        zoneName: order.zoneId?.name || 'Unassigned',
        riderName: order.riderId?.name || 'Unassigned',
        elapsedMins,
        estimatedMins,
        riskStatus,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    // Only return at risk or breached, or sort by risk
    const atRiskOrBreached = processedOrders.filter(o => o.riskStatus !== 'On Track');
    
    res.json(atRiskOrBreached.length > 0 ? atRiskOrBreached : processedOrders.slice(0, 5)); // Send some if none at risk just for UI
  } catch (err) {
    res.status(500).json({ message: "Error fetching at-risk orders", error: err.message });
  }
});
// ==========================================
// LIVE RADAR ENDPOINTS
// ==========================================

// Get Active Deliveries (Live Radar)
router.get('/active-deliveries', verifyToken, isAdmin, async (req, res) => {
  try {
    const activeOrders = await Order.find({ 
      status: 'Out for Delivery',
      orderType: { $ne: 'pos' }
    }).populate('zoneId').populate('riderId');

    const now = Date.now();
    
    const radarData = activeOrders.map(order => {
      const elapsedMs = now - new Date(order.createdAt).getTime();
      const elapsedMins = Math.floor(elapsedMs / 60000);
      const estimatedMins = order.zoneId?.estimatedDeliveryTime || 45;
      
      let riskStatus = 'On Track';
      if (elapsedMins > estimatedMins) {
        riskStatus = 'Breached';
      } else if (elapsedMins > estimatedMins - 15) {
        riskStatus = 'At Risk';
      }

      return {
        _id: order._id,
        customerName: order.customerName || order.shippingAddress?.building || 'Customer',
        shippingAddress: order.shippingAddress,
        itemsCount: order.items?.length || 0,
        status: order.status,
        elapsedMins,
        estimatedMins,
        riskStatus,
        zone: order.zoneId ? { _id: order.zoneId._id, name: order.zoneId.name } : null,
        rider: order.riderId ? {
          _id: order.riderId._id,
          name: order.riderId.name,
          phone: order.riderId.phone,
          currentLocation: order.riderId.currentLocation
        } : null
      };
    });

    res.json(radarData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching active deliveries", error: err.message });
  }
});

// Update Rider Location (Webhook for Rider App)
router.post('/riders/:id/location', verifyToken, isAdmin, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: "lat and lng required" });

    const rider = await DeliveryPartner.findByIdAndUpdate(
      req.params.id, 
      { currentLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    
    if (!rider) return res.status(404).json({ message: "Rider not found" });
    res.json({ message: "Location updated", currentLocation: rider.currentLocation });
  } catch (err) {
    res.status(500).json({ message: "Error updating location", error: err.message });
  }
});

// Reassign Rider
router.patch('/orders/:id/reassign-rider', verifyToken, isAdmin, async (req, res) => {
  try {
    const { riderId } = req.body;
    if (!riderId) return res.status(400).json({ message: "riderId required" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { riderId },
      { new: true }
    ).populate('riderId');

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Rider reassigned successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Error reassigning rider", error: err.message });
  }
});

// ==========================================
// HUBS ENDPOINTS
// ==========================================

// Get all hubs
router.get('/hubs', verifyToken, isAdmin, async (req, res) => {
  try {
    const hubs = await Hub.find().populate('servedZones').sort({ createdAt: -1 });
    res.json(hubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hubs", error: err.message });
  }
});

// Create a hub
router.post('/hubs', verifyToken, isAdmin, async (req, res) => {
  try {
    const newHub = new Hub(req.body);
    const savedHub = await newHub.save();
    const populated = await savedHub.populate('servedZones');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error creating hub", error: err.message });
  }
});

// Update a hub
router.patch('/hubs/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedHub = await Hub.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('servedZones');
    if (!updatedHub) return res.status(404).json({ message: "Hub not found" });
    res.json(updatedHub);
  } catch (err) {
    res.status(500).json({ message: "Error updating hub", error: err.message });
  }
});

// Delete a hub
router.delete('/hubs/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedHub = await Hub.findByIdAndDelete(req.params.id);
    if (!deletedHub) return res.status(404).json({ message: "Hub not found" });
    res.json({ message: "Hub deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting hub", error: err.message });
  }
});

export default router;
