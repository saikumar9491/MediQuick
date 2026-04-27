import express from 'express';
import Brand from '../models/Brand.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// @desc    Get all brands
// @route   GET /api/brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a brand
// @route   POST /api/brands
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, image, isFeatured } = req.body;
    const brand = new Brand({ name, image, isFeatured });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await brand.deleteOne();
      res.json({ message: 'Brand removed' });
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
