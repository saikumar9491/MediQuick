import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: { type: Number, default: 0 } // Admin unread count
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
