import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import ABTest from '../models/ABTest.js';

const router = express.Router();

// GET /api/ab-tests
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const tests = await ABTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching A/B tests", error: err.message });
  }
});

// GET /api/ab-tests/:id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const test = await ABTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
});

// POST /api/ab-tests
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const test = new ABTest(req.body);
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(400).json({ message: "Error creating test", error: err.message });
  }
});

// PATCH /api/ab-tests/:id
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const test = await ABTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(test);
  } catch (err) {
    res.status(400).json({ message: "Error updating test", error: err.message });
  }
});

// DELETE /api/ab-tests/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await ABTest.findByIdAndDelete(req.params.id);
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting test", error: err.message });
  }
});

// POST /api/ab-tests/:id/track (Public endpoint for frontend)
router.post('/:id/track', async (req, res) => {
  try {
    const { variantId, action, revenue } = req.body; // action: 'impression' | 'conversion'
    const test = await ABTest.findById(req.params.id);
    
    if (!test) return res.status(404).json({ message: 'Test not found' });
    if (test.status !== 'Running') return res.status(400).json({ message: 'Test is not currently running' });

    const variant = test.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });

    if (action === 'impression') {
      variant.impressions += 1;
    } else if (action === 'conversion') {
      variant.conversions += 1;
      if (revenue) {
        variant.revenueAttributed += Number(revenue);
      }
    }

    await test.save();
    res.json({ message: "Tracked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error tracking A/B test data", error: err.message });
  }
});

export default router;
