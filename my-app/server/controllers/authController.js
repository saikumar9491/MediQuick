import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -----------------------------
// EMAIL CONFIG
// -----------------------------
const createTransporter = () => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const secure = String(process.env.BREVO_SMTP_SECURE || 'false') === 'true';

  // Support both old and new env names
  const user = process.env.BREVO_SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.BREVO_SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      'SMTP credentials missing. Set BREVO_SMTP_USER/BREVO_SMTP_PASS or EMAIL_USER/EMAIL_PASS in Render.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
};

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = createTransporter();

    const fromEmail =
      process.env.EMAIL_FROM ||
      process.env.BREVO_SMTP_USER ||
      process.env.EMAIL_USER;

    if (!fromEmail) {
      throw new Error('EMAIL_FROM or SMTP sender email is missing in Render.');
    }

    const info = await transporter.sendMail({
      from: `"MediQuick Hub" <${fromEmail}>`,
      to: email.trim().toLowerCase(),
      subject,
      html: message,
    });

    console.log('✅ Email sent:', info.response);
    return info;
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw new Error(err?.message || 'Email dispatch failed. Check SMTP settings in Render.');
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

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      phone,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Account Verification OTP',
      message: `
        <h2>Welcome to MediQuick</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    return res.status(201).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('❌ Signup error:', error);
    return res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Verified successfully' });
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    return res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is missing in Render' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'MediQuick Password Reset OTP',
      message: `
        <h2>Password Reset</h2>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    return res.status(200).json({ message: 'Reset code sent' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return res.status(500).json({ message: error.message || 'Forgot password failed' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid code or request expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    return res.status(500).json({ message: 'Password reset failed' });
  }
};

export const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;

  try {
    if (!googleToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        phone: 'N/A',
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        isVerified: true,
        image: picture,
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is missing in Render' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('❌ Google Auth Error:', error);
    return res.status(400).json({ message: 'Google authentication failed' });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'MediQuick New Verification OTP',
      message: `
        <h2>Email Verification</h2>
        <p>Your new OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    return res.status(200).json({ message: 'New OTP sent' });
  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    return res.status(500).json({ message: error.message || 'Resend OTP failed' });
  }
};

// -----------------------------
// PROFILE CONTROLLERS
// -----------------------------
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('cart.productId')
      .populate('wishlist');

    return res.json(user);
  } catch (error) {
    console.error('❌ Get profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = req.body.cart || [];
    await user.save();

    return res.status(200).json({ message: 'Cart synced' });
  } catch (error) {
    console.error('❌ Update cart error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.body.productId;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyExists) {
      user.wishlist.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('❌ Add wishlist error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.body.productId;
    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    return res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('❌ Remove wishlist error:', error);
    return res.status(500).json({ message: error.message });
  }
};