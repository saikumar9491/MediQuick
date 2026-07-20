import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Flat'],
    required: true,
    default: 'Percentage'
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscountCap: {
    type: Number
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perCustomerLimit: {
    type: Number,
    default: 1
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: { 
    type: Date, 
    required: true 
  },
  applicableTo: {
    type: String,
    enum: ['All', 'Categories'],
    default: 'All'
  },
  applicableCategoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  newCustomersOnly: {
    type: Boolean,
    default: false
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
