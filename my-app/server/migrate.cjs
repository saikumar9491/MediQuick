require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(URI)
  .then(async () => {
    const db = mongoose.connection.collection('medicines');
    
    // Update documents where isActive doesn't exist
    const result = await db.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    
    console.log('Updated ' + result.modifiedCount + ' documents.');
    
    const c = await db.countDocuments({isActive: true});
    console.log('Active: ' + c);
    
    const total = await db.countDocuments({});
    console.log('Total: ' + total);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
