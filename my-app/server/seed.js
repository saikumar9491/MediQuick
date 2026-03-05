import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js';

dotenv.config();

const medicines = [






  // --- PAIN RELIEF ---
  {
    name: 'Paracetamol 500mg',
    brand: 'Crocin',
    category: 'Pain Relief',
    description: 'Trusted fever and pain relief medication for fast action.',
    price: 45,
    countInStock: 100,
    image: 'https://www.crocin.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_IN/product-detail/380x463/Crocin-Advance-Pack_20May22-380x463.png',
    rating: 4.8,
    numReviews: 1240,
    needsPrescription: false
  },
  {
    name: 'Pain Relief Spray',
    brand: 'Volini',
    category: 'Pain Relief',
    description: 'Quick relief from back pain, joint pain, and muscle pulls.',
    price: 155,
    countInStock: 80,
    image: 'https://m.media-amazon.com/images/I/51a6-va-ZqL.jpg',
    rating: 4.7,
    numReviews: 2100,
    needsPrescription: false
  },
  {
    name: ' Pain Relief Patches',
    brand: 'Crocin',
    category: 'Pain Relief',
    description: 'Trusted fever and pain relief medication for fast action.',
    price: 189,
    countInStock: 100,
    image: 'https://m.media-amazon.com/images/I/61Fit3PvEsL._SX679_PIbundle-12,TopRight,0,0_AA679SH20_.jpg',
    rating: 4.8,
    numReviews: 1240,
    needsPrescription: false
  },

  {
    name: 'Pain Relief Spray | Cooling',
    brand: 'Crocin',
    category: 'Pain Relief',
    description: 'Trusted fever and pain relief medication for fast action.',
    price: 396,
    countInStock: 10,
    image: 'https://m.media-amazon.com/images/I/71aaQ3i213L._SX679_.jpg',
    rating: 4.8,
    numReviews: 1240,
    needsPrescription: false
  },

  {
    name: 'Knee Cap (Pair) | Size S',
    brand: 'Crocin',
    category: 'Pain Relief',
    description: 'Trusted fever and pain relief medication for fast action.',
    price: 609,
    countInStock: 1,
    image: 'https://m.media-amazon.com/images/I/613UHAG-v-L._SX522_.jpg',
    rating: 4.7,
    numReviews: 1240,
    needsPrescription: false
  },

  {
    name: 'Strip of 15 Tablets',
    brand: 'Crocin',
    category: 'Pain Relief',
    description: 'Trusted fever and pain relief medication for fast action.',
    price: 75,
    countInStock: 10,
    image: 'https://m.media-amazon.com/images/I/81Ir8mOtiGL._SX679_.jpg',
    rating: 4.2,
    numReviews: 1240,
    needsPrescription: false
  },

  // --- ANTIBIOTICS ---
  {
    name: 'Amoxicillin 250mg',
    brand: 'Abbott',
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic for bacterial infections.',
    price: 120,
    countInStock: 45,
    image: 'https://5.imimg.com/data5/DR/RT/MY-71042386/generics-vaf-19-2-18-compiled-135-500x500.jpg',
    rating: 4.5,
    numReviews: 890,
    needsPrescription: true
  },

  // --- VITAMINS & WELLNESS ---
  {
    name: 'Vitamin C (Zinc)',
    brand: 'Limcee',
    category: 'Vitamins',
    description: 'Immunity booster chewable tablets for daily wellness.',
    price: 35,
    countInStock: 200,
    image: 'https://inlifehealthcare.com/cdn/shop/files/front2_4a761c90-70a0-4a47-939d-1819fa4f177a.webp?v=1733479473&width=600',
    rating: 4.9,
    numReviews: 3500,
    needsPrescription: false
  },
  {
    name: 'Multivitamin Men',
    brand: 'MuscleBlaze',
    category: 'Wellness',
    description: 'Essential vitamins and minerals for active lifestyles.',
    price: 650,
    countInStock: 30,
    image: 'https://m.media-amazon.com/images/I/61CVm4xU1SL._SX679_.jpg',
    rating: 4.6,
    numReviews: 420,
    needsPrescription: false
  },

  // --- SKIN CARE ---
  {
    name: 'Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'Skin Care',
    description: 'Dermatologist-recommended for sensitive and dry skin.',
    price: 540,
    countInStock: 25,
    image: 'https://media6.ppl-media.com//tr:h-235,w-235,c-at_max,dpr-2,q-40/static/img/product/343139/cetaphil-gentle-skin-cleanser-250-ml-11-15_1_display_1681383113_2968084e.jpg',
    rating: 4.9,
    numReviews: 5600,
    needsPrescription: false
  },

  // --- BABY CARE ---
  {
    name: 'Baby Gentle Wash',
    brand: 'Himalaya',
    category: 'Baby Care',
    description: 'Tear-free formula infused with Green Gram and Chickpea.',
    price: 210,
    countInStock: 50,
    image: 'https://images-static.nykaa.com/media/catalog/product/4/5/45855a80N_8901138819620_1.jpg',
    rating: 4.8,
    numReviews: 1100,
    needsPrescription: false
  },

  // --- ENERGY DRINKS & SNACKS ---
  {
    name: 'Isotonic Energy Drink',
    brand: 'Gatorade',
    category: 'Energy Drinks',
    description: 'Rehydrates and replenishes electrolytes quickly.',
    price: 50,
    countInStock: 150,
    image: 'https://nakpro.com/cdn/shop/files/01-reduced.png?v=1746926933&width=1080',
    rating: 4.4,
    numReviews: 320,
    needsPrescription: false
  },
  {
    name: 'Roasted Almond Mix',
    brand: 'Happilo',
    category: 'Snacks',
    description: 'Healthy high-protein snack for weight management.',
    price: 299,
    countInStock: 40,
    image: 'https://cdn.kindlife.in/images/detailed/156/1_hg9i-br.jpg?t=1710482376',
    rating: 4.7,
    numReviews: 890,
    needsPrescription: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Amritsar Hub Database... 🔌");

    await Medicine.deleteMany();
    console.log("🗑️ Old medicines removed!");

    await Medicine.insertMany(medicines);
    console.log("🌱 Database Seeded with 9 unique products!");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();