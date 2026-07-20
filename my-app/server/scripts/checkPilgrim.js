import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const variantSchema = new mongoose.Schema({
  size: String,
  weight: String,
  price: Number,
  countInStock: Number,
}, { _id: false });

const medicineSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  price: Number,
  description: String,
  variants: [variantSchema],
  countInStock: Number,
});

const Medicine = mongoose.model('Medicine', medicineSchema);

await mongoose.connect(process.env.MONGO_URI);

// Check Pilgrim Tea Tree Face Wash specifically
const pilgrim = await Medicine.findOne({ name: /Pilgrim Tea Tree/i });
console.log('\n=== Pilgrim Tea Tree Face Wash ===');
console.log(JSON.stringify(pilgrim, null, 2));

// Also list ALL products and their variants so we can see the full picture
const all = await Medicine.find({}, { name: 1, category: 1, 'variants': 1 });
console.log('\n=== ALL PRODUCTS VARIANTS ===');
all.forEach(p => {
  if ((p.variants || []).length > 0) {
    console.log(`\n[HAS VARIANTS] ${p.name} (${p.category})`);
    p.variants.forEach((v, i) => console.log(`  [${i}] size="${v.size}" weight="${v.weight}" price=${v.price}`));
  }
});

await mongoose.disconnect();
