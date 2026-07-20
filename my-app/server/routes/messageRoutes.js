import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/messages/conversations
router.get('/conversations', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, filter } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (filter === 'Unread') query.unreadCount = { $gt: 0 };
    if (filter === 'Mine') query.assignedAdminId = req.user._id;

    const conversations = await Conversation.find(query)
      .populate('customerId', 'name phone image')
      .populate('assignedAdminId', 'name')
      .sort({ lastMessageAt: -1 });

    // Attach last message
    const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
      const lastMsg = await Message.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });
      return {
        ...conv.toObject(),
        lastMessage: lastMsg ? lastMsg.text : ''
      };
    }));

    res.json(enrichedConversations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations", error: err.message });
  }
});

// GET /api/messages/conversations/:id
router.get('/conversations/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('customerId', 'name phone email image')
      .populate('assignedAdminId', 'name');
      
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    // Clear unread count when admin opens it
    if (conversation.unreadCount > 0) {
      conversation.unreadCount = 0;
      await conversation.save();
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name');

    res.json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversation", error: err.message });
  }
});

// POST /api/messages/conversations/:id/send
router.post('/conversations/:id/send', verifyToken, isAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const message = new Message({
      conversationId: conversation._id,
      sender: 'Admin',
      senderId: req.user._id,
      text: req.body.text
    });
    
    await message.save();

    conversation.lastMessageAt = new Date();
    // Only increment unread if customer sends it, here admin is sending so we don't increment admin's unread
    await conversation.save();

    // Populate sender info for the frontend
    await message.populate('senderId', 'name');

    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: "Error sending message", error: err.message });
  }
});

// PATCH /api/messages/conversations/:id/assign
router.patch('/conversations/:id/assign', verifyToken, isAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id, 
      { assignedAdminId: req.user._id },
      { new: true }
    ).populate('assignedAdminId', 'name');
    
    res.json(conversation);
  } catch (err) {
    res.status(400).json({ message: "Error assigning conversation", error: err.message });
  }
});

// PATCH /api/messages/conversations/:id/resolve
router.patch('/conversations/:id/resolve', verifyToken, isAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id, 
      { status: 'Resolved' },
      { new: true }
    );
    res.json(conversation);
  } catch (err) {
    res.status(400).json({ message: "Error resolving conversation", error: err.message });
  }
});

export default router;
