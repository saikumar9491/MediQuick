import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library'; // Added for Google Auth

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate JWT Token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Google Login / Signup
// @route   POST /api/users/google-login
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // 2. Check if user exists in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // 3. Create new user if they don't exist (Auto-Signup)
      // Generate a random password since they are using Google
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        phone: "Not Provided", 
        password: hashedPassword,
        isVerified: true, // Google accounts are pre-verified
        image: picture 
      });
    }

    // 4. Send back JWT and User Info
    res.json({
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        isAdmin: user.isAdmin 
      },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google Authentication Failed" });
  }
};

// @desc    Auth user & get token (Login)
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your account first' });
      }
      res.json({
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone,
          isAdmin: user.isAdmin 
        },
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register a new user (Signup)
export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 NEW SIGNUP OTP FOR ${email}: ${generatedOtp}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, phone, password: hashedPassword,
      otp: generatedOtp, isVerified: false
    });

    if (user) {
      res.status(201).json({ message: "Check terminal for OTP", email: user.email });
    }
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp === otp) { 
      user.isVerified = true;
      user.otp = undefined; 
      await user.save();
      res.status(200).json({ 
        message: "Verified!", 
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        token: generateToken(user._id, user.isAdmin)
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification error" });
  }
};

// @desc    Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = resetOtp;
    await user.save();
    res.status(200).json({ message: "Reset OTP sent to terminal" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reset failed" });
  }
};

/**
 * --- HUB PERSISTENCE & PROFILE LOGIC ---
 */

// @desc    Update User Profile (Identity Edit)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.address) user.address = req.body.address;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating identity', error: error.message });
  }
};

// @desc    Update/Sync User Cart
export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.cart && Array.isArray(req.body.cart)) {
      user.cart = req.body.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      await user.save();
      res.status(200).json({ message: "Cart synced", cart: user.cart });
    } else {
      res.status(400).json({ message: "Invalid cart data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Cart sync failed" });
  }
};

// @desc    Add Item to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Wishlist update failed" });
  }
};

// @desc    Remove Item from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Wishlist remove failed" });
  }
};

// @desc    Get user profile (Private)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: 'wishlist', model: 'Medicine' })
      .populate({ path: 'cart.productId', model: 'Medicine' })
      .populate('orders'); 

    if (user) {
      res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        isAdmin: user.isAdmin,
        cart: user.cart.filter(item => item.productId !== null),
        wishlist: user.wishlist.filter(item => item !== null),
        orders: user.orders || [] 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};