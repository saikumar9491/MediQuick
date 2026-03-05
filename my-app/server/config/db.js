import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This calls the variable from your .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    // If you see ENOTFOUND here, the MONGO_URI is still incorrect
    process.exit(1);
  }
};

export default connectDB;