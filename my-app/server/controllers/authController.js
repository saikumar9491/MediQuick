import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * --- SHARED EMAIL PROTOCOL ---
 * Dispatches OTPs via Gmail using Secure App Passwords.
 */
const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is missing in environment variables');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Most stable for Render-to-Gmail communication
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: `"MediQuick+ Hub" <${process.env.EMAIL_USER}>`,
      to: email.trim().toLowerCase(),
      subject,
      html: message,
    });
    console.log('📡 Hub Dispatch Success:', info.response);
    return info;
  } catch (err) {
    console.error("❌ Mailer Protocol Failed:", err.message);
    throw new Error("Email dispatch failed. Please check Hub logs.");
  }
};

// --- AUTH CONTROLLERS ---

export const signup = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await User.create({
      name, 
      phone, 
      email: normalizedEmail, 
      password: hashedPassword,
      otp, 
      otpExpire: new Date(Date.now() + 600000), 
      isVerified: false,
    });

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Account Verification',
      message: `<h1>Your Verification OTP is: ${otp}</h1><p>Valid for 10 minutes.</p>`,
    });

    res.status(201).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      otp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(200).json({ message: 'Verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Verification protocol failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });
      
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      res.json({ 
        token, 
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login terminal error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { otp, otpExpire: new Date(Date.now() + 600000) },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message: `<h1>Your Reset Code is: ${otp}</h1>`,
    });
    res.json({ message: 'Reset code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password protocol failed' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      otp,
      otpExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid code or request expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// --- GOOGLE AUTH PROTOCOL ---

export const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist via Google
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        isVerified: true, 
        image: picture,
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { otp, otpExpire: new Date(Date.now() + 600000) }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendEmail({
      email: user.email,
      subject: 'New Verification OTP',
      message: `<h1>Your new OTP is: ${otp}</h1>`,
    });
    res.json({ message: 'New OTP dispatched to email' });
  } catch (error) {
    res.status(500).json({ message: 'Resend OTP protocol failed' });
  }
};

// --- PROFILE & INVENTORY CONTROLLERS ---

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
      .populate('cart.productId')
      .populate('wishlist');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      const updatedUser = await user.save();
      res.json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = req.body.cart;
    await user.save();
    res.status(200).json({ message: 'Cart synced' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(req.body.productId)) {
      user.wishlist.push(req.body.productId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.body.productId);
    await user.save();
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};