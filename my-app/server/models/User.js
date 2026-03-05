import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  // --- ADDED FOR OTP LOGIC ---
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: { 
    type: String 
  }
  // ---------------------------
}, { timestamps: true });

export default mongoose.model('User', userSchema);