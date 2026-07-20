import mongoose from 'mongoose';

const RestockSubscriptionSchema = new mongoose.Schema({
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
  subscribedAt: { 
    type: Date, 
    default: Date.now 
  },
  notifiedAt: { 
    type: Date, 
    default: null 
  }
});

// Ensure a user only subscribes once per product
RestockSubscriptionSchema.index({ userId: 1, productId: 1 }, { unique: true });

const RestockSubscription = mongoose.model('RestockSubscription', RestockSubscriptionSchema);
export default RestockSubscription;
