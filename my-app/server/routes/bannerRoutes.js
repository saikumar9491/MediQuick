import express from 'express';
import Banner from '../models/Banner.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a banner
// @route   POST /api/banners
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, image, link, desc, bg, category } = req.body;
    const banner = new Banner({ title, image, link, desc, bg, category });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
