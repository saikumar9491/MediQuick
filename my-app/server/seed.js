import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Medicine from './models/Medicine.js';

const medicines = [

  // DIABETES
  {
    name: "Accu Check Glucometer",
    brand: "Accu Check",
    category: "Diabetes",
    description: "Easy blood sugar monitoring device.",
    price: 950,
    countInStock: 30,
    image: "https://www.cureka.com/wp-content/uploads/2022/02/Layer_14-3.jpg",
    needsPrescription: false
  },
  {
    name: "Diabetic Care Tablets",
    brand: "Himalaya",
    category: "Diabetes",
    description: "Helps maintain healthy blood sugar levels.",
    price: 180,
    countInStock: 50,
    image: "https://m.media-amazon.com/images/I/61Yz9r9cFAL.jpg",
    needsPrescription: false
  },

  // CARDIAC
  {
    name: "Omron BP Monitor",
    brand: "Omron",
    category: "Cardiac",
    description: "Digital blood pressure monitor.",
    price: 2400,
    countInStock: 20,
    image: "https://down-my.img.susercontent.com/file/24d174050bad298c18dc694069a54972",
    needsPrescription: false
  },

  // PAIN RELIEF
  {
    name: "Dolo 650",
    brand: "Micro Labs",
    category: "Pain Relief",
    description: "Used for fever and body pain.",
    price: 35,
    countInStock: 100,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
    needsPrescription: false
  },
  {
    name: "Volini Spray",
    brand: "Volini",
    category: "Pain Relief",
    description: "Fast relief for muscle pain.",
    price: 160,
    countInStock: 70,
    image: "https://m.media-amazon.com/images/I/51a6-va-ZqL.jpg",
    needsPrescription: false
  },

  // VITAMINS
  {
    name: "Limcee Vitamin C",
    brand: "Abbott",
    category: "Vitamins",
    description: "Boosts immunity and energy.",
    price: 40,
    countInStock: 120,
    image: "https://inlifehealthcare.com/cdn/shop/files/front2.webp",
    needsPrescription: false
  },

  // SKIN CARE
  {
    name: "Cetaphil Cleanser",
    brand: "Cetaphil",
    category: "Skin Care",
    description: "Gentle cleanser for sensitive skin.",
    price: 540,
    countInStock: 25,
    image: "https://tse4.mm.bing.net/th/id/OIP.-utmmXVNuE_ythluJf7XzQHaHa",
    needsPrescription: false
  },
  {
    name: "Vitamin C Serum",
    brand: "Pilgrim",
    category: "Skin Care",
    description: "Brightens skin and reduces dark spots.",
    price: 650,
    countInStock: 15,
    image: "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/1102659/DRcQ9GZqW-1102659_1.jpg",
    needsPrescription: false
  },

  // AYURVEDA - VATA
  {
    name: "Ashwagandha Tablets",
    brand: "Patanjali",
    category: "Ayurveda",
    dosha: "Vata",
    description: "Natural stress relief and Vata balance.",
    price: 120,
    countInStock: 90,
    image: "https://5.imimg.com/data5/SELLER/Default/2020/8/VO/WQ/LF/5929555/patanjali-ashwagandha-capsule-500x500.jpg",
    needsPrescription: false
  },

  {
    name: "Dashmool Kwath",
    brand: "Baidyanath",
    category: "Ayurveda",
    dosha: "Vata",
    description: "Traditional tonic for joint and nerve health.",
    price: 150,
    countInStock: 40,
    image: "https://www.netmeds.com/images/product-v1/600x600/822938/baidyanath_dashmool_kwath_450_ml_0.jpg",
    needsPrescription: false
  },

  // AYURVEDA - PITTA
  {
    name: "Amla Juice",
    brand: "Baidyanath",
    category: "Ayurveda",
    dosha: "Pitta",
    description: "Cooling tonic rich in Vitamin C.",
    price: 180,
    countInStock: 60,
    image: "https://tse4.mm.bing.net/th/id/OIP.S0Mx8QLzH9OxfkfVuiRs3AAAAA",
    needsPrescription: false
  },

  {
    name: "Neem Tablets",
    brand: "Himalaya",
    category: "Ayurveda",
    dosha: "Pitta",
    description: "Supports skin health and detoxification.",
    price: 140,
    countInStock: 50,
    image: "https://m.media-amazon.com/images/I/71v5IMQy7VL.jpg",
    needsPrescription: false
  },

  // AYURVEDA - KAPHA
  {
    name: "Triphala Churna",
    brand: "Dabur",
    category: "Ayurveda",
    dosha: "Kapha",
    description: "Improves digestion and detoxifies the body.",
    price: 95,
    countInStock: 60,
    image: "https://tse2.mm.bing.net/th/id/OIP.QwFYMVbcbnyBMs2iqoJ3hgHaGJ",
    needsPrescription: false
  },

  {
    name: "Tulsi Drops",
    brand: "Patanjali",
    category: "Ayurveda",
    dosha: "Kapha",
    description: "Boosts immunity and respiratory health.",
    price: 90,
    countInStock: 80,
    image: "https://m.media-amazon.com/images/I/61N4uKZ2oVL.jpg",
    needsPrescription: false
  }

];

const seedDatabase = async () => {
  try {

    console.log("⏳ Connecting to database...");
    await connectDB();

    console.log("🗑️ Clearing medicines collection...");
    await Medicine.deleteMany({});

    console.log("🌱 Seeding medicines...");
    const createdMedicines = await Medicine.insertMany(medicines);

    console.log(`✅ ${createdMedicines.length} medicines inserted successfully`);

  } catch (error) {

    console.error("❌ Seeding failed:", error.message);

  } finally {

    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit();

  }
};

seedDatabase();