import express from 'express';
import Banner from '../models/Banner.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

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
    const { title, image, link, desc, bg, category, brand } = req.body;
    const banner = new Banner({ title, image, link, desc, bg, category, brand });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, image, link, desc, bg, category, brand, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title || banner.title;
      banner.image = image || banner.image;
      banner.link = link || banner.link;
      banner.desc = desc || banner.desc;
      banner.bg = bg || banner.bg;
      banner.category = category || banner.category;
      banner.brand = brand || banner.brand;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
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
