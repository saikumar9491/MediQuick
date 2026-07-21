import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';

async function test() {
  await connectDB();
  const list = await Category.find({});
  console.log(`Found ${list.length} categories in DB:`);
  for (const cat of list) {
    console.log(`- ${cat.name} (${cat.path})`);
  }
  await mongoose.connection.close();
}

test();
