import mongoose from 'mongoose';

/**
 * --- DATABASE CONNECTION PROTOCOL ---
 * Connects the Amritsar Hub to MongoDB Atlas with timeout protection.
 */
const connectDB = async () => {
  try {
    // 1. Resolve URI from Environment Variables
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("Critical: MongoDB Connection URI is missing from .env");
    }

    // 2. Establish Connection with Performance Options
    const conn = await mongoose.connect(uri, {
      // If Atlas doesn't respond in 5 seconds, fail fast so we can see the error
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ Hub Database Linked: ${conn.connection.host}`);

    // Optional: Log when the connection is lost during runtime
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  Hub Warning: MongoDB connection lost. Retrying...');
    });

  } catch (error) {
    console.error(`❌ Hub Connection Failed: ${error.message}`);
    
    // Specific Hint for Atlas Whitelisting
    if (error.message.includes('IP not whitelisted') || error.message.includes('ETIMEDOUT')) {
      console.log("👉 Protocol Tip: Verify your MongoDB Atlas Network Access (Allow Access from Anywhere).");
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;