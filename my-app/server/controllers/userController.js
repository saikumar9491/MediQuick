import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    from: `"MediQuick" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  });

  console.log('✅ Email sent:', info.response);
  return info;
};

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#2874f0;">Verify Your Account</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:6px;">${generatedOtp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Account Verification OTP',
      message,
    });

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

    res.status(201).json({
      message: 'OTP sent to your email!',
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('❌ Registration failed:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp.trim()) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      message: 'Verified successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: 'Verification error' });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = newOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#2874f0;">New Verification OTP</h2>
        <p>Your new OTP is:</p>
        <h1 style="letter-spacing:6px;">${newOtp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      email: normalizedEmail,
      subject: 'New OTP - MediQuick',
      message,
    });

    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error('❌ resendOtp error:', error);
    res.status(500).json({ message: error.message || 'Error resending OTP' });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = resetOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#fb641b;">Password Reset Request</h2>
        <p>Your OTP to reset password is:</p>
        <h1 style="letter-spacing:6px;">${resetOtp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Password Reset OTP',
      message,
    });

    res.status(200).json({ message: 'Reset OTP sent to your email' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp.trim()) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Reset failed:', error);
    res.status(500).json({ message: 'Reset failed' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        phone: 'Not Provided',
        password: hashedPassword,
        isVerified: true,
        image: picture,
      });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.error('❌ Google Authentication Failed:', error);
    res.status(400).json({ message: 'Google Authentication Failed' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email?.trim().toLowerCase() || user.email;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      cart: updatedUser.cart,
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.body.cart || !Array.isArray(req.body.cart)) {
      return res.status(400).json({ message: 'Invalid cart data' });
    }

    user.cart = req.body.cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await user.save();

    res.status(200).json({ message: 'Cart synced', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Cart sync failed' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.wishlist.some((id) => id.toString() === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Wishlist update failed' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Wishlist remove failed' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: 'wishlist', model: 'Medicine' })
      .populate({ path: 'cart.productId', model: 'Medicine' })
      .populate('orders');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      cart: user.cart.filter((item) => item.productId !== null),
      wishlist: user.wishlist.filter((item) => item !== null),
      orders: user.orders || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};