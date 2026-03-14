import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyOtp,
  forgotPassword, 
  resetPassword,
  updateCart,
  addToWishlist,      
  removeFromWishlist,
  updateUserProfile,
  googleLogin // <--- ADDED THIS IMPORT
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @description PUBLIC ROUTES
 */
router.post('/signup', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Added the Google Login Public Route
router.post('/google-login', googleLogin); // <--- NOW DEFINED

/**
 * @description PRIVATE ROUTES (Token Required)
 */

// 1. Profile & Identity
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile/update', verifyToken, updateUserProfile); 

// 2. Cart Persistence
router.post('/cart/update', verifyToken, updateCart);

// 3. Wishlist Persistence
router.post('/wishlist/add', verifyToken, addToWishlist); 
router.post('/wishlist/remove', verifyToken, removeFromWishlist);

export default router;