import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Campaign from '../models/Campaign.js';

const router = express.Router();

router.get('/campaigns', verifyToken, isAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('linkedCouponId', 'code discountValue discountType').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching campaigns", error: err.message });
  }
});

router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const active = await Campaign.countDocuments({ status: 'Active' });
    const allCampaigns = await Campaign.find();
    
    let totalSent = 0;
    let totalOpened = 0;
    let totalConverted = 0;

    allCampaigns.forEach(c => {
      totalSent += c.metrics?.sent || 0;
      totalOpened += c.metrics?.opened || 0;
      totalConverted += c.metrics?.converted || 0;
    });

    const ctr = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;

    res.json({ active, totalReach: totalSent, ctr, conversions: totalConverted });
  } catch (err) {
    res.status(500).json({ message: "Error fetching marketing stats", error: err.message });
  }
});

router.post('/campaigns', verifyToken, isAdmin, async (req, res) => {
  try {
    const newCampaign = new Campaign(req.body);
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ message: "Error creating campaign", error: err.message });
  }
});

router.patch('/campaigns/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ message: "Error updating campaign", error: err.message });
  }
});

router.delete('/campaigns/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting campaign", error: err.message });
  }
});

export default router;
