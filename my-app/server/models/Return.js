import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now }
});

const returnItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  refundAmount: { type: Number, required: true }
});

const internalNoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  adminName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const returnSchema = new mongoose.Schema({
  returnId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [returnItemSchema],
  reason: { 
    type: String, 
    enum: ['Damaged Item', 'Wrong Item Delivered', 'Expired Near Delivery', 'Quality Issue', 'Changed Mind', 'Other'],
    required: true
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['Requested', 'Under Review', 'Approved', 'Rejected', 'Refunded'], default: 'Requested' },
  
  refundMethod: { type: String }, // 'Original Source', 'Bank Transfer', 'Wallet Credit', etc.
  refundReference: { type: String },
  
  adminNotes: [internalNoteSchema],
  
  requestedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  refundedAt: { type: Date },
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

// Pre-validate hook to generate unique returnId
returnSchema.pre('validate', function() {
  if (!this.returnId) {
    this.returnId = 'RET-' + Math.floor(1000000 + Math.random() * 9000000);
  }
});

// Pre-save hook for dates
returnSchema.pre('save', function() {
  if (this.isModified('status')) {
    if ((this.status === 'Approved' || this.status === 'Rejected') && !this.reviewedAt) {
      this.reviewedAt = new Date();
    }
    if (this.status === 'Refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
    }
  }
});

export default mongoose.model('Return', returnSchema);
