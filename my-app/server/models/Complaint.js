import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now }
});

const internalNoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  adminName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional, not all complaints need an order
  category: { 
    type: String, 
    enum: ['Product Quality', 'Delivery Delay', 'Wrong Item', 'Damaged Item', 'Prescription Issue', 'Refund Not Received', 'Rider Behavior', 'Other'],
    required: true
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['New', 'In Progress', 'Resolved', 'Escalated'], default: 'New' },
  description: { type: String, required: true },
  images: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  internalNotes: [internalNoteSchema],
  resolutionNotes: { type: String },
  resolvedAt: { type: Date },
  statusHistory: [statusHistorySchema]
}, { timestamps: true });

// Pre-save hook to generate unique complaintId like CMP-123456
complaintSchema.pre('validate', function() {
  if (!this.complaintId) {
    this.complaintId = 'CMP-' + Math.floor(100000 + Math.random() * 900000);
  }
});

// Post-save hook to ensure status history is updated if status changed
complaintSchema.pre('save', function() {
  if (this.isModified('status')) {
    // If we transition to Resolved, set resolvedAt
    if (this.status === 'Resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    } else if (this.status !== 'Resolved') {
      this.resolvedAt = null;
    }
  }
});

export default mongoose.model('Complaint', complaintSchema);
