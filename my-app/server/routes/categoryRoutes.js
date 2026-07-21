import express from 'express';
import Category from '../models/Category.js';
import Medicine from '../models/Medicine.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all categories with dynamic product counts
// @route   GET /api/categories/with-counts
// @access  Public
router.get('/with-counts', async (req, res) => {
  try {
    // 1. Group and sum count of medicines per category
    const counts = await Medicine.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // 1b. Group and sum count of medicines per subcategory
    const subCounts = await Medicine.aggregate([
      {
        $group: {
          _id: {
            cat: { $toLower: '$category' },
            sub: { $toLower: '$subCategory' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const countsMap = {};
    counts.forEach(c => {
      if (c._id) {
        let key = c._id.toLowerCase().trim();
        if (key === 'vitamins') key = 'vitamins & nutrition';
        if (key === 'fitness') key = 'fitness & health';
        countsMap[key] = (countsMap[key] || 0) + c.count;
      }
    });

    const subCountsMap = {};
    subCounts.forEach(sc => {
      if (sc._id && sc._id.sub) {
        const key = `${sc._id.cat}_${sc._id.sub}`;
        subCountsMap[key] = sc.count;
      }
    });

    // 2. Count flash deals and total items
    const flashCount = await Medicine.countDocuments({ isFlashDeal: true });
    const totalCount = await Medicine.countDocuments({});

    // 3. Find seeded categories
    const categories = await Category.find({});

    // 4. Map count fields to categories
    const categoriesWithCounts = categories.map(cat => {
      const nameKey = cat.name.toLowerCase().trim();
      
      const subOptionsWithCounts = (cat.subOptions || []).map(sub => {
        const subName = typeof sub === 'object' ? sub.name : sub;
        const subPath = typeof sub === 'object' ? sub.path : null;
        const subKey = `${nameKey}_${subName.toLowerCase().trim()}`;
        return {
          name: subName,
          path: subPath,
          count: subCountsMap[subKey] || 0
        };
      });

      return {
        _id: cat._id,
        name: cat.name,
        iconName: cat.iconName || 'LayoutGrid',
        path: cat.path,
        subOptions: subOptionsWithCounts,
        count: countsMap[nameKey] || 0
      };
    });

    res.json({
      categories: categoriesWithCounts,
      totalCount,
      flashCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      return res.json([]);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, iconName, path, subOptions } = req.body;

  try {
    const category = new Category({
      name,
      iconName,
      path,
      subOptions,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { name, iconName, path, subOptions } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.iconName = iconName || category.iconName;
      category.path = path || category.path;
      category.subOptions = subOptions || category.subOptions;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.deleteOne({ _id: req.params.id });
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
