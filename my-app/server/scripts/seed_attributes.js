import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Medicine from '../models/Medicine.js';

const run = async () => {
  await connectDB();

  console.log('Clearing existing test items to avoid duplication...');
  await Medicine.deleteMany({
    name: { $in: ['Dolo 650 Pain Relief', 'La Roche-Posay Anthelios SPF 50', 'Nature\'s Way Multivitamin'] }
  });

  const testProducts = [
    {
      name: 'Dolo 650 Pain Relief',
      brand: 'Micro Labs',
      category: 'Health Resource Center',
      subCategory: 'All Medicines',
      price: 32,
      discountPrice: 28,
      countInStock: 25,
      needsRx: true,
      tagline: 'Rapid Pain Relief Formulation',
      isBestseller: true, // Seeding bestseller flag explicitly for verification
      keyFeatures: ['Fast Acting', 'Fever Reducer', 'Doctor Recommended'],
      displayAttributes: [
        { label: 'Dosage', value: 'Tablet' },
        { label: 'Strength', value: '650mg' }
      ],
      description: 'Professional grade antipyretic and analgesic medication.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'La Roche-Posay Anthelios SPF 50',
      brand: 'La Roche-Posay',
      category: 'Homeopathy',
      subCategory: 'Skin Care',
      price: 1250,
      discountPrice: 1100,
      countInStock: 8,
      needsRx: false,
      tagline: 'Broad Spectrum UVA/UVB Shield',
      isBestseller: false,
      keyFeatures: ['Lightweight', 'Non-Sticky', 'For All Skin Types'],
      displayAttributes: [
        { label: 'SPF', value: '50+' },
        { label: 'Skin Type', value: 'Sensitive' }
      ],
      description: 'Dermatologist recommended daily facial sun shield.',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Nature\'s Way Multivitamin',
      brand: 'Nature\'s Way',
      category: 'Fitness & Health',
      subCategory: 'Vitamins',
      price: 650,
      countInStock: 0,
      needsRx: false,
      tagline: '', // Empty tagline to test fallback to clean name
      isBestseller: false,
      keyFeatures: [], // Omit features completely
      displayAttributes: [
        { label: 'Serving Size', value: '1 Capsule' },
        { label: 'Servings', value: '60' }
      ],
      description: 'Complete daily nutritional support capsules.',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300'
    }
  ];

  console.log('Seeding new test products...');
  for (const prod of testProducts) {
    const created = await Medicine.create(prod);
    console.log(`Created: ${created.name} with ${created.keyFeatures.length} features, bestseller=${created.isBestseller}`);
  }

  console.log('Database seeding complete. Disconnecting...');
  await mongoose.disconnect();
  console.log('Disconnected.');
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
