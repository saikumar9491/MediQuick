import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * --- SHARED EMAIL PROTOCOL ---
 */
const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is missing in environment variables');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"MediQuick+ Hub" <${process.env.EMAIL_USER}>`,
    to: email.trim().toLowerCase(),
    subject,
    html: message,
  });

  console.log('✅ Hub Dispatch Success:', info.response);
  return info;
};

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * --- AUTH CONTROLLERS ---
 */

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `<div style="font-family: Arial; padding: 20px;"><h2>Verify Account</h2><h1>${generatedOtp}</h1></div>`;

    await sendEmail({ email: normalizedEmail, subject: 'MediQuick OTP', message });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      otp: generatedOtp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    res.status(201).json({ message: 'OTP sent to your email!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp.trim() || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or Expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: 'Verification error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: 'Email not found' });

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = resetOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `<div style="font-family: Arial; padding: 20px;"><h2>Reset Password</h2><h1>${resetOtp}</h1></div>`;

    await sendEmail({ email: normalizedEmail, subject: 'MediQuick Reset OTP', message });
    res.status(200).json({ message: 'Reset OTP sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error sending OTP' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp.trim() || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or Expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Reset failed' });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Verify account first' });
      res.json({
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login error' });
  }
};

/**
 * --- PROFILE & INVENTORY CONTROLLERS (FIXES YOUR CRASH) ---
 */

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: 'wishlist', model: 'Medicine' })
      .populate({ path: 'cart.productId', model: 'Medicine' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profile fetch error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Update error' });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = req.body.cart;
    await user.save();
    res.status(200).json({ message: 'Cart synced' });
  } catch (error) {
    res.status(500).json({ message: 'Cart update failed' });
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
    res.status(200).json({ message: 'Added' });
  } catch (error) {
    res.status(500).json({ message: 'Wishlist error' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: 'Wishlist remove error' });
  }
};

// Placeholder for Google Login (if you have it)
export const googleLogin = async (req, res) => {
    res.status(501).json({ message: "Google Login not implemented" });
};

// Placeholder for Resend OTP
export const resendOtp = async (req, res) => {
    res.status(501).json({ message: "Resend OTP not implemented" });
};