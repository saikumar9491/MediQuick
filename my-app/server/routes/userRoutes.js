import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyOtp,
  resendOtp, // <--- ADDED: New OTP trigger
  forgotPassword, 
  resetPassword,
  updateCart,
  updateUserProfile,
  addToWishlist,      
  removeFromWishlist,
  googleLogin 
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @description PUBLIC ROUTES
 * These do not require a Bearer Token
 */
router.post('/signup', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp); // <--- ADDED: New OTP trigger
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);

/**
 * @description PRIVATE ROUTES (Token Required)
 * These require 'Authorization: Bearer <token>' in headers
 */

// 1. Profile & Identity
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile/update', verifyToken, updateUserProfile); 

// 2. Cart Persistence (Syncs with the Hub)
router.post('/cart/update', verifyToken, updateCart);

// 3. Wishlist Persistence
router.post('/wishlist/add', verifyToken, addToWishlist); 
router.post('/wishlist/remove', verifyToken, removeFromWishlist);

/**
 * @description ADMIN ROUTES (Token + Admin Status Required)
 * Use 'isAdmin' middleware here once you build the Medicine Dashboard
 */

export default router;