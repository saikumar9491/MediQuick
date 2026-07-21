import mongoose from 'mongoose';

async function update() {
  await mongoose.connect('mongodb+srv://admin:admin123@cluster0.ultmygh.mongodb.net/amritsar_hub');
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  await User.updateMany({}, { $set: { isAdmin: true } });
  console.log('All users set to isAdmin = true');
  process.exit();
}

update();
