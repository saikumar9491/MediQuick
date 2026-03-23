const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is missing');
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
};

exports.signup = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 600000;

    await User.create({
      name,
      phone,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Account Verification OTP',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verify Your Account</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully! You can now login.' });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first' });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ token, user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, otpExpires: Date.now() + 600000 },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendEmail({
      email: normalizedEmail,
      subject: 'MediQuick Password Reset OTP',
      message: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>Your reset OTP is:</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.json({ message: 'Reset code sent to your email' });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or request expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully! Login with your new password.' });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};