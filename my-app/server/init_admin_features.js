import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SearchLog from './models/SearchLog.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediquick');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const initAdminFeatures = async () => {
  await connectDB();
  
  try {
    console.log('Clearing old data...');
    await SearchLog.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    const users = await User.find({ isAdmin: false }).limit(2);
    const admin = await User.findOne({ isAdmin: true });

    if (users.length > 0) {
      console.log('Seeding Conversations & Messages...');
      const conv1 = new Conversation({
        customerId: users[0]._id,
        status: 'Open',
        unreadCount: 1,
        lastMessageAt: new Date()
      });
      await conv1.save();

      await Message.insertMany([
        { conversationId: conv1._id, sender: 'Customer', senderId: users[0]._id, text: 'Hi, I need help with my recent order.', createdAt: new Date(Date.now() - 3600000) },
        { conversationId: conv1._id, sender: 'Admin', senderId: admin._id, text: 'Hello! Id be happy to help. What is the order number?', createdAt: new Date(Date.now() - 1800000) },
        { conversationId: conv1._id, sender: 'Customer', senderId: users[0]._id, text: 'It is #ORD-4929.', createdAt: new Date() }
      ]);
    }

    console.log('Seeding Search Logs...');
    const searchTerms = ['paracetamol', 'vitamin c', 'cough syrup', 'whey protein', 'diapers', 'blood pressure monitor', 'zinc'];
    const zeroTerms = ['rare medicine x', 'something we dont have', 'out of stock item'];
    
    const logs = [];
    // Random past dates
    for (let i = 0; i < 200; i++) {
      logs.push({
        query: searchTerms[Math.floor(Math.random() * searchTerms.length)],
        resultCount: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      });
    }
    
    // Zero results
    for (let i = 0; i < 30; i++) {
      logs.push({
        query: zeroTerms[Math.floor(Math.random() * zeroTerms.length)],
        resultCount: 0,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
      });
    }
    
    await SearchLog.insertMany(logs);

    console.log('✅ Admin features initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
};

initAdminFeatures();
