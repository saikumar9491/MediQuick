import express from 'express';
import {
  getMedicines,
  getTopMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  createMedicineReview,
  getRelatedMedicines,
  toggleFlashDeal,
  toggleTrending,
  generateAIDescription,
  bulkUpdateMedicines,
  bulkDeleteMedicines,
  getSalesStats,
  recalculateBestsellers
} from '../controllers/medicineController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import SearchLog from '../models/SearchLog.js';

const router = express.Router();

/**
 * @description PUBLIC ROUTES
 * These routes are accessible to all visitors of the Amritsar Hub.
 */

// 1. Fetch all medicines (Supports category and search filtering)
router.get('/', getMedicines);

// 2. Fetch "Deals of the Day" (Top Rated)
// CRITICAL: Static routes like '/top' MUST be defined BEFORE dynamic '/:id' 
// to prevent the server from confusing 'top' with a product ID.
router.get('/top', getTopMedicines);

// 3. Fetch Related Products (Based on category)
// Also defined before /:id to ensure proper path matching.
router.get('/related/:id', getRelatedMedicines);

// 3.5. Fetch sales stats for a medicine
router.get('/:id/sales-stats', getSalesStats);

// 3.7. Fetch public trending search terms
router.get('/trending-searches', async (req, res) => {
  try {
    const logs = await SearchLog.find({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const termCounts = {};
    logs.forEach(l => {
      const q = l.query?.trim().toLowerCase();
      if (q) {
        termCounts[q] = (termCounts[q] || 0) + 1;
      }
    });
    const topSearches = Object.keys(termCounts)
      .map(term => ({ term, count: termCounts[term] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(x => x.term);
    
    const defaultTrending = ['paracetamol', 'cough syrup', 'vitamin c', 'face wash', 'shampoo', 'pain relief'];
    res.json(topSearches.length > 0 ? topSearches : defaultTrending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Fetch a single medicine by its specific MongoDB _id
router.get('/:id', getMedicineById);


/**
 * @description USER PROTECTED ROUTES
 * Requires 'verifyToken' middleware to ensure the user is logged in.
 */

// Allow logged-in users to submit a product review
router.post('/:id/reviews', verifyToken, createMedicineReview);


/**
 * @description ADMIN PROTECTED ROUTES
 * Requires both 'verifyToken' and 'isAdmin' permissions.
 */

// Bulk Update existing products
router.patch('/bulk-update', verifyToken, isAdmin, bulkUpdateMedicines);

// Bulk Delete existing products
router.delete('/bulk-delete', verifyToken, isAdmin, bulkDeleteMedicines);

// Add new inventory to the Amritsar Hub database
router.post('/add', verifyToken, isAdmin, addMedicine);

// Update existing product details (price, stock, etc.)
router.put('/:id', verifyToken, isAdmin, updateMedicine);

// Remove a product from the database
router.delete('/:id', verifyToken, isAdmin, deleteMedicine);

// Toggle Flash Deal status (Daily Flash Deals management)
router.patch('/:id/flash-deal', verifyToken, isAdmin, toggleFlashDeal);

// Toggle Trending status
router.patch('/:id/trending', verifyToken, isAdmin, toggleTrending);

// Generate AI product descriptions (Admin only)
router.post('/ai-description', verifyToken, isAdmin, generateAIDescription);

// Recalculate Bestsellers (Admin only)
router.post('/admin/recalculate-bestsellers', verifyToken, isAdmin, recalculateBestsellers);

export default router;