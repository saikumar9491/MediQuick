const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP: Save user & Send OTP
exports.signup = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 600000; // 10 mins

    await User.create({ name, phone, email, password: hashedPassword, otp, otpExpires });
    console.log(`OTP for ${email}: ${otp}`); // For testing in Amritsar Hub
    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. NEW: VERIFY OTP (To complete signup)
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP code." });
    }

    user.isVerified = true;
    user.otp = undefined; // Clear code after successful verification
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });
      
      const token = jwt.sign(
        { id: user._id, name: user.name }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      res.json({ token, user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. FORGOT PASSWORD (Send Code)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findOneAndUpdate(
      { email }, 
      { otp, otpExpires: Date.now() + 600000 },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(`Reset Code for ${email}: ${otp}`);
    res.json({ message: "Reset code sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. NEW: RESET PASSWORD (Final Step)
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or request expired." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.otp = undefined; // Clear the reset code
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully! Login with your new password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};