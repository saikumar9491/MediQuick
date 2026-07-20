const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const URI = process.env.MONGODB_URI || 'mongodb+srv://dilippulicherla143:Dilip123@cluster0.hndp1.mongodb.net/mediQuick?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(URI)
  .then(async () => {
    console.log('Connected to DB');
    const db = mongoose.connection.collection('medicines');
    
    // Update documents where isActive doesn't exist
    const result = await db.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} documents to have isActive = true`);
    
    // Test the query again to see counts
    const activeCount = await db.countDocuments({ isActive: true });
    console.log(`Total Active Products in DB: ${activeCount}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
