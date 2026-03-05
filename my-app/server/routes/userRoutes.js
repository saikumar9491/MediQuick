import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyOtp,
  forgotPassword, 
  resetPassword 
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
 * Requires 'verifyToken' middleware
 */

// Fetch user profile data
router.get('/profile', verifyToken, getUserProfile);

export default router;