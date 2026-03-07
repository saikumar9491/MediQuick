import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
// Make sure this path correctly points to your Medicine model file
import Medicine from './models/Medicine.js'; 

const medicines = [
  {
    name: "Dolo 650 Tablet",
    price: 32,
    brand: "Micro Labs",
    category: "Pain Relief",
    needsPrescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    description: "Standard treatment for fever and mild to moderate pain."
  },
  {
    name: "Augmentin 625 Duo",
    price: 201,
    brand: "GSK",
    category: "Antibiotics",
    needsPrescription: true,
    image: "https://images.unsplash.com/photo-1576071804486-b8bc22106dbf?auto=format&fit=crop&q=80&w=400",
    description: "Penicillin-type antibiotic used to treat various bacterial infections."
  },
  {
    name: "Allegra 120mg",
    price: 215,
    brand: "Sanofi",
    category: "Allergy",
    needsPrescription: false,
    image: "https://images.unsplash.com/photo-1626719623756-1143896435fd?auto=format&fit=crop&q=80&w=400",
    description: "Effective 24-hour relief from indoor and outdoor allergy symptoms."
  },
  {
    name: "Revital H Capsule",
    price: 310,
    brand: "Sun Pharma",
    category: "Supplements",
    needsPrescription: false,
    image: "https://images.unsplash.com/photo-1616671285410-095034607755?auto=format&fit=crop&q=80&w=400",
    description: "Daily health supplement with a combination of vitamins and minerals."
  },
  {
    name: "Zyrtec 10mg",
    price: 85,
    brand: "Johnson & Johnson",
    category: "Allergy",
    needsPrescription: false,
    image: "https://images.unsplash.com/photo-1550572017-ed20015e7257?auto=format&fit=crop&q=80&w=400",
    description: "Relieves runny nose, sneezing, and itchy/watery eyes."
  },
  {
  name: 'Paracetamol 500mg',
  brand: 'Crocin',
  category: 'General Medicine', // This must match your frontend filter exactly
  description: 'Effective relief from fever and mild to moderate pain.',
  price: 45,
  countInStock: 200,
  image: 'https://www.crocin.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_IN/product-detail/380x463/Crocin-Advance-Pack_20May22-380x463.png',
  rating: 4.8,
  numReviews: 1200,
  needsPrescription: false
},
{
  name: 'Digestive Enzyme Syrup',
  brand: 'Aristozyme',
  category: 'General Medicine',
  description: 'Helps in digestion and provides relief from gas and bloating.',
  price: 110,
  countInStock: 50,
  image: 'https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/6c934305-6ec0-4228-89c0-994432243d43.jpeg',
  rating: 4.4,
  numReviews: 850,
  needsPrescription: false
},
// --- DIABETES ---
  {
    name: 'Glucometer G5',
    brand: 'Dr. Morepen',
    category: 'Diabetes',
    description: 'Highly accurate blood glucose monitoring system.',
    price: 850,
    countInStock: 40,
    image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6ec7a4f5-9377-4959-992e-360e676104bc.png',
    rating: 4.5,
    numReviews: 2100,
    needsPrescription: false
  },
  // --- CARDIAC ---
  {
    name: 'BP Monitor M2',
    brand: 'Omron',
    category: 'Cardiac',
    description: 'Fully automatic blood pressure monitor with Intellisense technology.',
    price: 2450,
    countInStock: 15,
    image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/72574e4c-1e81-432d-82d2-83b53c713b1d.png',
    rating: 4.8,
    numReviews: 950,
    needsPrescription: false
  },
  // --- PAIN RELIEF ---
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
  // --- VITAMINS ---
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
  // --- SKIN CARE ---
  {
    name: 'Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'Skin Care',
    description: 'Dermatologist-recommended cleanser for sensitive and dry skin.',
    price: 540,
    countInStock: 25,
    image: 'https://media6.ppl-media.com//tr:h-235,w-235,c-at_max,dpr-2,q-40/static/img/product/343139/cetaphil-gentle-skin-cleanser-250-ml-11-15_1_display_1681383113_2968084e.jpg',
    rating: 4.9,
    numReviews: 5600,
    needsPrescription: false
  },
  // --- AYURVEDA ---
  {
    name: 'Ashwagandha Tablets',
    brand: 'Patanjali',
    category: 'Ayurveda',
    description: 'Natural stress reliever and immunity booster.',
    price: 120,
    countInStock: 150,
    image: 'https://m.media-amazon.com/images/I/61Nl-Hh6xRL._SX679_.jpg',
    rating: 4.9,
    numReviews: 5400,
    needsPrescription: false
  },

  // --- CATEGORY: SKIN CARE (3 Products) ---
  {
    name: "Gentle Skin Cleanser",
    brand: "Cetaphil",
    category: "Skin Care",
    description: "Step 1: Cleanse. Ideal for sensitive skin.",
    price: 540,
    countInStock: 25,
    image: "https://media6.ppl-media.com//tr:h-235,w-235,c-at_max,dpr-2,q-40/static/img/product/343139/cetaphil-gentle-skin-cleanser-250-ml-11-15_1_display_1681383113_2968084e.jpg",
    rating: 4.9, numReviews: 5600, needsPrescription: false
  },
  {
    name: "Vitamin C Serum",
    brand: "Pilgrim",
    category: "Skin Care",
    description: "Step 2: Treat. Brightens and glows.",
    price: 645,
    countInStock: 15,
    image: "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/e8e604d5-072e-4b77-8051-9310a08e6587.png",
    rating: 4.7, numReviews: 1200, needsPrescription: false
  },
  {
    name: "Sunscreen SPF 50",
    brand: "La Shield",
    category: "Skin Care",
    description: "Step 4: Protect. Matte finish for sun protection.",
    price: 790,
    countInStock: 20,
    image: "https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/708f36f6-4359-4592-8869-d41982b6b063.jpeg",
    rating: 4.8, numReviews: 2100, needsPrescription: false
  },

  // --- CATEGORY: AYURVEDA (3 Products) ---
  {
    name: 'Ashwagandha Tablets',
    brand: 'Patanjali',
    category: 'Ayurveda',
    description: 'Natural stress reliever. Ideal for Vata energy.',
    price: 120,
    countInStock: 150,
    image: 'https://cdn.netmeds.tech/v2/plain-cake-860195/netmed/wrkr/products/assets/item/free/resize-w:400/n9dg6d32Hr-patanjali_ashvagandha_capsules_20s_56653_0_1.jpg',
    rating: 4.9, numReviews: 5400, needsPrescription: false
  },
  {
    name: 'Amla Juice',
    brand: 'Baidyanath',
    category: 'Ayurveda',
    description: 'Rich in Vitamin C. Cools Pitta heat.',
    price: 180,
    countInStock: 40,
    image: 'https://cdn.netmeds.tech/v2/plain-cake-860195/netmed/wrkr/products/assets/item/free/resize-w:400/WjTj-ldv5r-baidyanath_amla_juice_1000_ml_172759_0_1.jpg',
    rating: 4.7, numReviews: 1200, needsPrescription: false
  },
  {
    name: 'Triphala Churna',
    brand: 'Dabur',
    category: 'Ayurveda',
    description: 'Digestive support. Clears Kapha congestion.',
    price: 95,
    countInStock: 80,
    image: 'https://m.media-amazon.com/images/I/51gQ+Q2TBlL._SX679_.jpg',
    rating: 4.8, numReviews: 3100, needsPrescription: false
  },

  // --- CATEGORY: GENERAL MEDICINE (3 Products) ---
  {
    name: 'Paracetamol 500mg',
    brand: 'Crocin',
    category: 'General Medicine',
    description: 'Trusted fever and pain relief.',
    price: 45,
    countInStock: 100,
    image: 'https://www.crocin.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_IN/product-detail/380x463/Crocin-Advance-Pack_20May22-380x463.png',
    rating: 4.8, numReviews: 1240, needsPrescription: false
  },
  {
    name: 'Metformin 500mg',
    brand: 'Glycomet',
    category: 'General Medicine',
    description: 'Blood sugar control for diabetes.',
    price: 90,
    countInStock: 60,
    image: 'https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/708f36f6-4359-4592-8869-d41982b6b063.jpeg',
    rating: 4.5, numReviews: 980, needsPrescription: true
  },
  {
    name: 'Atorvastatin 10mg',
    brand: 'Lipvas',
    category: 'General Medicine',
    description: 'Manages cholesterol and heart health.',
    price: 145,
    countInStock: 40,
    image: 'https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/6c934305-6ec0-4228-89c0-994432243d43.jpeg',
    rating: 4.6, numReviews: 450, needsPrescription: true
  },

  // --- DIABETES (Brand: Dr. Morepen) ---
  {
    name: 'GlucoOne BG 03',
    brand: 'Dr. Morepen',
    category: 'Diabetes',
    description: 'Accurate blood glucose monitoring system for daily checks.',
    price: 850, mrp: 1200, countInStock: 40,
    image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6ec7a4f5-9377-4959-992e-360e676104bc.png',
    rating: 4.5, numReviews: 2100, needsPrescription: false
  },
  // --- CARDIAC (Brand: Omron) ---
  {
    name: 'Automatic BP Monitor M2',
    brand: 'Omron',
    category: 'Cardiac',
    description: 'Clinically validated blood pressure monitor with Intellisense technology.',
    price: 2450, mrp: 3200, countInStock: 15,
    image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/72574e4c-1e81-432d-82d2-83b53c713b1d.png',
    rating: 4.8, numReviews: 950, needsPrescription: false
  },
  // --- SKIN CARE (Brand: Pilgrim) ---
  {
    name: 'Vitamin C Serum',
    brand: 'Pilgrim',
    category: 'Skin Care',
    description: 'Step 2: Treat. Advanced brightening serum for glowing skin.',
    price: 645, mrp: 850, countInStock: 30,
    image: 'https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/e8e604d5-072e-4b77-8051-9310a08e6587.png',
    rating: 4.7, numReviews: 800, needsPrescription: false
  },
  // --- AYURVEDA (Brand: Patanjali) ---
  {
    name: 'Ashwagandha Tablets',
    brand: 'Patanjali',
    category: 'Ayurveda',
    description: 'Natural energy & movement support. Ideal for Vata formulations.',
    price: 120, mrp: 160, countInStock: 150,
    image: 'https://m.media-amazon.com/images/I/61Nl-Hh6xRL._SX679_.jpg',
    rating: 4.9, numReviews: 5400, needsPrescription: false
  },
  // --- VITAMINS (Brand: Limcee) ---
  {
    name: 'Vitamin C Chewable',
    brand: 'Limcee',
    category: 'Vitamins',
    description: 'Daily immunity booster with Zinc for universal wellness.',
    price: 35, mrp: 47, countInStock: 500,
    image: 'https://inlifehealthcare.com/cdn/shop/files/front2_4a761c90-70a0-4a47-939d-1819fa4f177a.webp?v=1733479473&width=600',
    rating: 4.9, numReviews: 3500, needsPrescription: false
  }
  

];

const seedDatabase = async () => {
  try {
    // 1. Connect using your existing config logic
    console.log("⏳ Initializing database connection...");
    await connectDB();

    // 2. Clear existing products to avoid duplicates
    console.log("🗑️  Cleaning 'medicines' collection...");
    await Medicine.deleteMany();

    // 3. Insert new data
    console.log("🌱 Inserting fresh medicine data...");
    const createdMedicines = await Medicine.insertMany(medicines);

    console.log(`✅ Success! Seeded ${createdMedicines.length} products into MediQuick+`);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    // 4. Always close connection
    mongoose.connection.close();
    console.log("🔌 Connection closed.");
    process.exit();
  }
};

seedDatabase();