import mongoose from 'mongoose';

const ViewHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  },
  sessionId: { 
    type: String, 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  viewedAt: { 
    type: Date, 
    default: Date.now 
  }
});

ViewHistorySchema.index({ userId: 1, viewedAt: -1 });
ViewHistorySchema.index({ sessionId: 1, viewedAt: -1 });

// Prevent duplicate views of the same product within a short timeframe from cluttering the list
ViewHistorySchema.index({ sessionId: 1, productId: 1, viewedAt: -1 });

const ViewHistory = mongoose.model('ViewHistory', ViewHistorySchema);
export default ViewHistory;
