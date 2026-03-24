import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -----------------------------
// EMAIL CONFIG (FIXED FOR RENDER & BREVO)
// -----------------------------
const createTransporter = () => {
  const host = 'smtp-relay.brevo.com';
  const port = 2525; // 🚀 Port 2525 bypasses Render's standard SMTP blocks

  const user = process.env.EMAIL_USER; 
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('SMTP credentials missing. Set EMAIL_USER/EMAIL_PASS in Render.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false, 
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 40000, 
    greetingTimeout: 40000,
    socketTimeout: 40000,
  });
};

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"MediQuick Hub" <balisaikumar9491@gmail.com>`, 
      to: email.trim().toLowerCase(),
      subject,
      html: message,
    });
    console.log('✅ Hub Dispatch Success:', info.response);
    return info;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    throw new Error(err?.message || 'Email dispatch failed.');
  }
};

// -----------------------------
// AUTH CONTROLLERS
// -----------------------------

export const signup = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🚀 STEP 1: Send Email FIRST
    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Account Verification OTP',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #2ecc71;">Welcome to MediQuick+</h2>
          <p>Your verification OTP is:</p>
          <h1 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h1>
          <p>Valid for 20 minutes. Do not share this code.</p>
        </div>
      `,
    });

    // 🚀 STEP 2: Save to DB with 20-minute window
    await User.create({
      name,
      phone,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpire: new Date(Date.now() + 20 * 60 * 1000),
      isVerified: false,
    });

    return res.status(201).json({ message: 'OTP sent to email' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    // 🛡️ Grace Period: Offset current time by 5 seconds to prevent "Instant Expiry"
    const checkTime = new Date(Date.now() - 5000);

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpire: { $gt: checkTime },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 20 * 60 * 1000); // 🚀 20 Min
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'MediQuick Password Reset OTP',
      message: `<h1>Reset OTP: ${otp}</h1>`,
    });
    return res.status(200).json({ message: 'Reset code sent' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Forgot password failed' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const checkTime = new Date(Date.now() - 5000);
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      otp,
      otpExpire: { $gt: checkTime },
    });

    if (!user) return res.status(400).json({ message: 'Invalid code or request expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Password reset failed' });
  }
};

export const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name, 
        email: payload.email, 
        phone: 'N/A',
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        isVerified: true, image: payload.picture,
      });
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    return res.status(400).json({ message: 'Google authentication failed' });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 20 * 60 * 1000); // 🚀 20 Min
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'New Verification OTP',
      message: `<h1>OTP: ${otp}</h1>`,
    });
    return res.status(200).json({ message: 'New OTP sent' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Resend OTP failed' });
  }
};

// -----------------------------
// PROFILE CONTROLLERS
// -----------------------------
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('cart.productId').populate('wishlist');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    const updatedUser = await user.save();
    return res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, isAdmin: updatedUser.isAdmin, image: updatedUser.image });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.cart = req.body.cart || [];
    await user.save();
    return res.status(200).json({ message: 'Cart synced' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const productId = req.body.productId;
    if (!user.wishlist.some((id) => id.toString() === productId.toString())) {
      user.wishlist.push(productId);
      await user.save();
    }
    return res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.body.productId.toString());
    await user.save();
    return res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};