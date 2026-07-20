import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Inline medicine schema for the audit
const variantSchema = new mongoose.Schema({
  size: String,
  weight: String,
  price: Number,
  countInStock: Number,
});

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

// Sample one product per category
const samples = await Medicine.aggregate([
  { $group: { _id: '$category', doc: { $first: '$$ROOT' } } },
  { $limit: 10 },
  { $replaceRoot: { newRoot: '$doc' } },
  { $project: { name: 1, category: 1, brand: 1, price: 1, description: 1, variants: 1, countInStock: 1, _id: 1 } }
]);

console.log('\n=== SAMPLE PRODUCTS BY CATEGORY ===\n');
samples.forEach(p => {
  console.log('---');
  console.log('ID:      ', p._id);
  console.log('Name:    ', p.name);
  console.log('Category:', p.category);
  console.log('Brand:   ', p.brand);
  console.log('Price:   ₹', p.price);
  console.log('Has real description:', !!(p.description && p.description.trim().length > 10));
  console.log('Variants:', (p.variants || []).length, (p.variants || []).length > 0 ? '→ PACKAGE SELECTOR SHOWS' : '→ PACKAGE SELECTOR HIDDEN');
  console.log('Stock:   ', p.countInStock);
});

const withVariants = await Medicine.countDocuments({ 'variants.0': { $exists: true } });
const total = await Medicine.countDocuments({});
const withDesc = await Medicine.countDocuments({ description: { $exists: true, $ne: '' } });

console.log('\n=== OVERALL CATALOG STATS ===');
console.log('Total products:                    ', total);
console.log('With real variants (section shows):', withVariants);
console.log('Without variants (section hidden): ', total - withVariants);
console.log('With description text:             ', withDesc);
console.log('Without description (placeholder): ', total - withDesc);

await mongoose.disconnect();
