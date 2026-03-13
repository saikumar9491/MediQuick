import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyOtp,
  forgotPassword, 
  resetPassword,
  updateCart,         // Added
  removeFromWishlist  // Added
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @description PUBLIC ROUTES
 * No token required for these
 */

// Route for initial registration
router.post('/signup', registerUser);

// Route for OTP verification
router.post('/verify-otp', verifyOtp);

// Route for standard login
router.post('/login', authUser);

// Routes for the password recovery feature
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


/**
 * @description PRIVATE ROUTES
 * Requires 'verifyToken' middleware to ensure users only access their own data
 */

// Fetch user profile data (Now includes populated Cart and Wishlist)
router.get('/profile', verifyToken, getUserProfile);

// Update/Sync the user's cart in the database
router.post('/cart/update', verifyToken, updateCart);

// Remove a specific product from the user's wishlist
router.post('/wishlist/remove', verifyToken, removeFromWishlist);

export default router;