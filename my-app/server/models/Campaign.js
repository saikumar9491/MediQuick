import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['Email', 'SMS', 'Push', 'Banner'],
    required: true 
  },
  targetAudience: { 
    type: String,
    enum: ['All Customers', 'Inactive 30+ Days', 'High Value', 'Specific Zone'],
    required: true 
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Active', 'Completed'],
    default: 'Draft'
  },
  scheduledAt: {
    type: Date
  },
  linkedCouponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  metrics: {
    sent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    converted: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
