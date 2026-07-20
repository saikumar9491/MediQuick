require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(URI)
  .then(async () => {
    const { default: User } = await import('./models/User.js');
    const { default: Medicine } = await import('./models/Medicine.js');
    
    // find admin
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
        console.log('No admin found');
        process.exit(1);
    }
    
    // sign token
    const token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // find a medicine
    const doc = await Medicine.findOne();
    const ids = [doc._id.toString()];
    
    // test PATCH
    try {
        const res = await axios.patch('http://localhost:5000/api/medicines/bulk-update', { ids, updateData: { isActive: false } }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success:', res.data);
    } catch(err) {
        if (err.response) {
            console.log('Error Data:', err.response.data);
            console.log('Error Status:', err.response.status);
        } else {
            console.log('Error Message:', err.message);
        }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
