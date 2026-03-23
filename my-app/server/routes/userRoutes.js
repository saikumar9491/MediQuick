import express from 'express';
import {
  signup,         // Match authController.js
  login,          // Match authController.js
  getUserProfile,
  verifyOTP,      // Match authController.js (Case sensitive)
  forgotPassword,
  resetPassword,
  updateCart,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  googleLogin,
  resendOtp,
} from '../controllers/authController.js'; // Ensure path is correct
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes ---
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);

// --- Protected Routes (Require Token) ---
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile/update', verifyToken, updateUserProfile);

// Cart & Wishlist Sync
router.post('/cart/update', verifyToken, updateCart);
router.post('/wishlist/add', verifyToken, addToWishlist);
router.post('/wishlist/remove', verifyToken, removeFromWishlist);

export default router;