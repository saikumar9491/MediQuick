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
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },

    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        quantity: { type: Number, default: 1 },
      },
    ],

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;