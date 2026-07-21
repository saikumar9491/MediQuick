import express from 'express';
import PageContent from '../models/PageContent.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get public page content settings for a specific pageKey
// @route   GET /api/page-content/:pageKey
// @access  Public
router.get('/:pageKey', async (req, res) => {
  try {
    let content = await PageContent.findOne({ pageKey: req.params.pageKey });
    
    // Fallback default if not seeded yet
    if (!content) {
      return res.json({
        pageKey: req.params.pageKey,
        heroHeadline: 'Welcome to MediQuick',
        heroSubtext: 'Your trusted digital pharmacy and healthcare platform.',
        status: 'Live',
        trustClaims: [],
        faqs: [],
        auditLog: []
      });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all page content settings (Admin)
// @route   GET /api/page-content/admin/all
// @access  Private/Admin
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const allContent = await PageContent.find({});
    res.json(allContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update page content settings & trust claims (Admin)
// @route   PATCH /api/page-content/admin/:pageKey
// @access  Private/Admin
router.patch('/admin/:pageKey', verifyToken, isAdmin, async (req, res) => {
  try {
    let content = await PageContent.findOne({ pageKey: req.params.pageKey });
    
    if (!content) {
      content = new PageContent({ pageKey: req.params.pageKey, ...req.body });
    } else {
      if (req.body.heroHeadline !== undefined) content.heroHeadline = req.body.heroHeadline;
      if (req.body.heroSubtext !== undefined) content.heroSubtext = req.body.heroSubtext;
      if (req.body.status !== undefined) content.status = req.body.status;
      if (req.body.themeAccent !== undefined) content.themeAccent = req.body.themeAccent;
      if (req.body.trustClaims !== undefined) content.trustClaims = req.body.trustClaims;
      if (req.body.featuredItems !== undefined) content.featuredItems = req.body.featuredItems;
      if (req.body.faqs !== undefined) content.faqs = req.body.faqs;
      if (req.body.aboutBlock !== undefined) content.aboutBlock = req.body.aboutBlock;
    }

    // Append Audit Log record
    const adminUser = req.user?.name || req.user?.email || 'Admin';
    content.auditLog.push({
      updatedBy: adminUser,
      updatedAt: new Date(),
      action: req.body.auditAction || `Updated settings for ${req.params.pageKey}`
    });

    const updated = await content.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
