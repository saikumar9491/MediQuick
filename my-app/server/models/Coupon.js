import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  discount: { 
    type: Number, 
    required: true // discount percentage, e.g. 15 for 15% off
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
