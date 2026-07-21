import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan', required: true },
  planName: { type: String, required: true },
  tier: { type: String, enum: ['monthly', 'annual'], required: true },
  amountPaid: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Expired'],
    default: 'Active'
  },
  startDate: { type: Date, default: Date.now },
  renewalDate: { type: Date, required: true },
  paymentMethod: { type: String, default: 'Razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String }
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
