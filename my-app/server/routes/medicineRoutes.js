import express from 'express';
import { 
  getMedicines, 
  getTopMedicines,
  getMedicineById, 
  addMedicine, 
  updateMedicine, 
  deleteMedicine,
  createMedicineReview,
  getRelatedMedicines
} from '../controllers/medicineController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

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

// Add new inventory to the Amritsar Hub database
router.post('/add', verifyToken, isAdmin, addMedicine);

// Update existing product details (price, stock, etc.)
router.put('/:id', verifyToken, isAdmin, updateMedicine);

// Remove a product from the database
router.delete('/:id', verifyToken, isAdmin, deleteMedicine);

export default router;