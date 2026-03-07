import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Standardize this variable name with your .env file
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MongoDB Connection URI is missing! Check your .env file.");
    }

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    
    // Suggesting a fix if it's a common whitelist/credential error
    if (error.message.includes('IP not whitelisted')) {
      console.log("👉 Tip: Check your MongoDB Atlas Network Access whitelist.");
    }
    
    process.exit(1);
  }
};

export default connectDB;