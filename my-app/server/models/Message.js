import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: {
    type: String,
    enum: ['Customer', 'Admin'],
    required: true
  },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  readAt: { type: Date }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
