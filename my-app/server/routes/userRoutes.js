import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  updateCart,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  googleLogin,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile/update', verifyToken, updateUserProfile);

router.post('/cart/update', verifyToken, updateCart);

router.post('/wishlist/add', verifyToken, addToWishlist);
router.post('/wishlist/remove', verifyToken, removeFromWishlist);

export default router;