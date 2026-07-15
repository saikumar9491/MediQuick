import express from 'express';
import Setting from '../models/Setting.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get Store Settings (Public)
 * @route   GET /api/settings
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Seed default settings if none exist
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching settings", error: err.message });
  }
});

/**
 * @desc    Update Store Settings (Admin)
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
router.put('/', verifyToken, isAdmin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    const { 
      storeName, 
      logo, 
      banner, 
      shippingCharges, 
      tax, 
      paymentGateway, 
      emailSettings 
    } = req.body;

    if (storeName !== undefined) settings.storeName = storeName;
    if (logo !== undefined) settings.logo = logo;
    if (banner !== undefined) settings.banner = banner;
    if (shippingCharges !== undefined) settings.shippingCharges = shippingCharges;
    if (tax !== undefined) settings.tax = tax;
    if (paymentGateway !== undefined) settings.paymentGateway = paymentGateway;
    if (emailSettings !== undefined) settings.emailSettings = { ...settings.emailSettings, ...emailSettings };

    const saved = await settings.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error updating settings", error: err.message });
  }
});

export default router;
