import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  
  // --- NEW PERSISTENT STORAGE FIELDS ---
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    quantity: { type: Number, default: 1 }
  }],

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],

  // ADDED: This connects the user to their orders
  // Note: Ensure your Order model is named 'Order' in its own file
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] 
  
  // -------------------------------------
  
}, { timestamps: true });

export default mongoose.model('User', userSchema);