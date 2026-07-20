import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  channels: [{ 
    type: String, 
    enum: ['push', 'sms', 'email'] 
  }],
  audienceType: { 
    type: String, 
    enum: ['All', 'Segment', 'Custom'],
    default: 'All'
  },
  audienceFilter: { type: String }, // e.g. 'Inactive 30+ days'
  linkedCouponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Sent', 'Failed'],
    default: 'Draft'
  },
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  recipientCount: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  openedCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
