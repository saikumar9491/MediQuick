import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// --- SHARED EMAIL PROTOCOL ---
const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is missing');
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4 to prevent ENETUNREACH
    tls: { rejectUnauthorized: false }
  });

  await transporter.verify();
  return await transporter.sendMail({
    from: `"MediQuick+ Hub" <${process.env.EMAIL_USER}>`,
    to: email.trim().toLowerCase(),
    subject,
    html: message,
  });
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
      name, phone, email: normalizedEmail, password: hashedPassword,
      otp, otpExpire: new Date(Date.now() + 600000), isVerified: false,
    });

    await sendEmail({
      email: normalizedEmail,
      subject: 'Verification OTP',
      message: `<h1>Your OTP is: ${otp}</h1>`,
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
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(403).json({ message: 'Verify email first' });
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      message: `<h1>Reset Code: ${otp}</h1>`,
    });
    res.json({ message: 'Reset code sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!user) return res.status(400).json({ message: 'Invalid code' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const googleLogin = async (req, res) => res.status(501).json({ message: "Not implemented" });
export const resendOtp = async (req, res) => res.status(501).json({ message: "Not implemented" });