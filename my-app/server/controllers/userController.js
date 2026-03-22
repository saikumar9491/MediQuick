import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * --- EMAIL UTILITY ---
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"MediQuick+ Hub" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

// Helper: Generate JWT Token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Resend OTP to user email
// @route   POST /api/users/resend-otp
export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    await user.save();

    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2874f0;">New Verification Code</h2>
        <p>Your new OTP for MediQuick+ is:</p>
        <div style="background: #f1f3f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
          ${newOtp}
        </div>
        <p style="margin-top: 15px; font-size: 12px; color: #666;">If you didn't request this, please secure your account.</p>
      </div>
    `;

    await sendEmail({ email, subject: 'New OTP - MediQuick+', message });
    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP" });
  }
};

// @desc    Google Login / Signup
export const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name, email, phone: "Not Provided", 
        password: hashedPassword, isVerified: true, image: picture 
      });
    }

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
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
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
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

    const message = `
      <div style="font-family: Helvetica, Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #2874f0; text-transform: uppercase;">Verify Your Account</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for choosing MediQuick+. Use the following OTP to complete your registration:</p>
        <div style="background: #f8fafc; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e293b; border: 1px dashed #cbd5e1;">
          ${generatedOtp}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">This code is valid for 10 minutes. Do not share this with anyone.</p>
      </div>
    `;

    try {
      await sendEmail({ email, subject: 'MediQuick+ Account Verification', message });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        name, email, phone, password: hashedPassword,
        otp: generatedOtp, isVerified: false
      });

      res.status(201).json({ message: "OTP sent to your email!", email });
    } catch (emailErr) {
      res.status(500).json({ message: "Error sending email. Please try again." });
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

    const message = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #fb641b;">Password Reset Request</h2>
        <p>Your OTP to reset your password is:</p>
        <h1 style="color: #333;">${resetOtp}</h1>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({ email, subject: 'MediQuick+ Password Reset', message });
    res.status(200).json({ message: "Reset OTP sent to your email" });
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
 * --- PROFILE & HUB PERSISTENCE ---
 */

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
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        phone: updatedUser.phone, isAdmin: updatedUser.isAdmin,
        cart: updatedUser.cart, wishlist: updatedUser.wishlist
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

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

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: 'wishlist', model: 'Medicine' })
      .populate({ path: 'cart.productId', model: 'Medicine' })
      .populate('orders'); 
    if (user) {
      res.json({ 
        _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin,
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