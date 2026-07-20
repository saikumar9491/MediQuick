import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
  priceAtAdd: { 
    type: Number, 
    required: true 
  }
});

// Compound index to guarantee user cannot add same product twice
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
