const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { signup, login, forgotPassword, resetPasswordWithToken, googleLogin } = require('../controllers/authController');

// Rate limiting for auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordWithToken);
router.post('/google', googleLogin);

module.exports = router;