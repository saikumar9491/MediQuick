import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },

    isAdmin: { type: Boolean, required: true, default: false },
    role: { 
      type: String, 
      default: 'Admin', 
      enum: ['Super Admin', 'Admin', 'Manager', 'Warehouse Staff'] 
    },
    loyaltyPoints: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },

    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        quantity: { type: Number, default: 1 },
      },
    ],

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    addresses: [
      {
        type:         { type: String, default: 'Home', enum: ['Home', 'Work', 'Other'] },
        name:         { type: String },
        phone:        { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        landmark:     { type: String },
        city:         { type: String },
        state:        { type: String },
        pincode:      { type: String },
        isDefault:    { type: Boolean, default: false },
      },
    ],
    dob: { type: Date, default: null },
    deleted: { type: Boolean, default: false },
    notificationPreferences: {
      orderUpdates: { type: Boolean, default: true },
      promotionalOffers: { type: Boolean, default: true },
      prescriptionReminders: { type: Boolean, default: true },
      priceDropAlerts: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;