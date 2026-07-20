import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Helper to resolve audience
const getAudienceUsers = async (audienceType, audienceFilter) => {
  let query = {};
  if (audienceType === 'Segment') {
    if (audienceFilter === 'Inactive 30+ days') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // Approximation using createdAt if lastLogin doesn't exist on User model
      query = { createdAt: { $lt: thirtyDaysAgo } }; 
    }
    // Expand for other segments as needed
  }
  return await User.find(query).select('name email phone');
};

// GET /api/notifications
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

// GET /api/notifications/audience-count
router.get('/audience-count', verifyToken, isAdmin, async (req, res) => {
  try {
    const { type, filter } = req.query;
    const users = await getAudienceUsers(type, filter);
    res.json({ count: users.length });
  } catch (err) {
    res.status(500).json({ message: "Error counting audience", error: err.message });
  }
});

// POST /api/notifications
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const notif = new Notification({
      ...req.body,
      createdBy: req.user._id
    });
    
    // Auto-calculate recipient count
    const users = await getAudienceUsers(notif.audienceType, notif.audienceFilter);
    notif.recipientCount = users.length;
    
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ message: "Error creating notification", error: err.message });
  }
});

// POST /api/notifications/:id/send
router.post('/:id/send', verifyToken, isAdmin, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    
    if (notif.status === 'Sent') {
      return res.status(400).json({ message: 'Already sent' });
    }

    const users = await getAudienceUsers(notif.audienceType, notif.audienceFilter);
    notif.recipientCount = users.length;
    
    const errors = [];
    let emailsSent = 0;

    // Email channel
    if (notif.channels.includes('email')) {
      for (const user of users) {
        if (user.email) {
          try {
            await sendEmail({
              email: user.email,
              subject: notif.title,
              message: notif.message
            });
            emailsSent++;
          } catch (e) {
            console.error('Email send error:', e);
          }
        }
      }
    }

    // Push & SMS channels (Not configured yet)
    if (notif.channels.includes('push')) {
      errors.push('Push notifications not sent: Firebase Cloud Messaging (FCM) is not configured.');
    }
    if (notif.channels.includes('sms')) {
      errors.push('SMS not sent: Twilio provider is not configured in environment variables.');
    }

    notif.status = 'Sent';
    notif.sentAt = new Date();
    notif.deliveredCount = emailsSent; // Currently only tracking email success
    await notif.save();

    res.json({ 
      message: "Notification processing completed", 
      delivered: emailsSent,
      errors: errors 
    });
  } catch (err) {
    res.status(500).json({ message: "Error sending notification", error: err.message });
  }
});

export default router;
