import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';

dotenv.config();

const checkData = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const count = await Medicine.countDocuments();
    console.log(`Number of medicines: ${count}`);
    
    if (count > 0) {
      const medicines = await Medicine.find().limit(5);
      console.log('Sample medicines:', JSON.stringify(medicines, null, 2));
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkData();
