import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Medicine from './models/Medicine.js';

const medicines = [
  // ================= DIABETES =================
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
    image: "https://tse3.mm.bing.net/th/id/OIP.WLEbK10XEW7fSzNKAMCtmwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    needsPrescription: false
  },

  // ================= CARDIAC =================
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

  // ================= PAIN RELIEF =================
  {
    name: "Dolo 650",
    brand: "Micro Labs",
    category: "Pain Relief",
    description: "Used for fever and body pain.",
    price: 35,
    countInStock: 100,
    image: "https://5.imimg.com/data5/SELLER/Default/2024/2/392072070/JO/SG/ZY/143252944/dolo-650-tablet-500x500.png",
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

  // ================= VITAMINS =================
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

  // ================= SKIN CARE =================
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

  // ================= AYURVEDA - VATA =================
  {
    name: "Ashwagandha Tablets",
    brand: "Patanjali",
    category: "Ayurveda",
    dosha: "Vata",
    description: "Natural stress relief supplement that balances Vata.",
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
    description: "Traditional herbal tonic for joint and nerve health.",
    price: 150,
    countInStock: 40,
    image: "https://tse4.mm.bing.net/th/id/OIP.IH-Cmb2AtrSPnGfeIrENsgHaIi?rs=1&pid=ImgDetMain&o=7&rm=3",
    needsPrescription: false
  },

  // ================= AYURVEDA - PITTA =================
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
    image: "https://wealzin.com.bd/wp-content/uploads/2022/11/himalaya-neem-tablets-60pcs.jpg",
    needsPrescription: false
  },

  // ================= AYURVEDA - KAPHA =================
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
    image: "https://tse3.mm.bing.net/th/id/OIP.Vwovew8Wm9Bed1CyjTlNjQAAAA?w=433&h=576&rs=1&pid=ImgDetMain&o=7&rm=3",
    needsPrescription: false
  },
  // ================= TEJASYA =================
{
  name: "Tejasya Giloy Juice",
  brand: "Tejasya",
  category: "Ayurveda",
  description: "Herbal immunity booster made from Giloy to support overall health.",
  price: 210,
  countInStock: 50,
  image: "https://www.bbassets.com/media/uploads/p/xl/1200009027_3-giloy-tulsi-juice-supports-immunity-respiratory-health-no-added-sugar-by-tata-1mg-tejasya.jpg",
  needsPrescription: false
},
{
  name: "Tejasya Aloe Vera Juice",
  brand: "Tejasya",
  category: "Ayurveda",
  description: "Natural aloe vera juice that supports digestion and skin health.",
  price: 190,
  countInStock: 60,
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqqqFwSA4m6Jl4gItmIuP2nisjnkdwpagueA&s",
  needsPrescription: false
},
{
  name: "Tejasya Amla Juice",
  brand: "Tejasya",
  category: "Ayurveda",
  description: "Rich source of Vitamin C that boosts immunity and metabolism.",
  price: 200,
  countInStock: 45,
  image: "https://www.jiomart.com/images/product/original/rves9tne7h/tata-1mg-tejasya-amla-juice-relieves-from-acidity-healthy-hair-and-skin-pack-of-1-product-images-orves9tne7h-p603670325-0-202308051658.jpg?im=Resize=(1000,1000)",
  needsPrescription: false
},
{
  name: "Tejasya Tulsi Drops",
  brand: "Tejasya",
  category: "Ayurveda",
  description: "Concentrated tulsi extract that supports respiratory health and immunity.",
  price: 120,
  countInStock: 70,
  image: "https://onemg.gumlet.io/l_watermark_346,w_690,h_700/a_ignore,w_690,h_700,c_pad,q_auto,f_auto/8de5bc72862b4721aae4abac5da2179a.jpg",
  needsPrescription: false
},
// ================= PROHANCE =================
{
  name: "Prohance Diabetes Care Powder",
  brand: "Prohance",
  category: "Diabetes",
  description: "Nutritional drink designed for people with diabetes to manage blood sugar levels.",
  price: 650,
  countInStock: 35,
  image: "https://storage.googleapis.com/dawaadost.appspot.com/main_images/bb673349-dba4-4eda-9c17-90cd7a68bb04.jpg",
  needsPrescription: false
},
{
  name: "Prohance D Chocolate Nutrition Drink",
  brand: "Prohance",
  category: "Vitamins",
  description: "High protein nutrition drink with Vitamin D for bone and muscle health.",
  price: 720,
  countInStock: 40,
  image: "https://www.clickoncare.com/cdn/shop/files/3_f3a22ec9-1ec8-4448-a1e1-b8a2aa0fb498.png?v=1702560074",
  needsPrescription: false
},
{
  name: "Prohance HP High Protein Powder",
  brand: "Prohance",
  category: "Vitamins",
  description: "High protein supplement to support recovery and muscle strength.",
  price: 880,
  countInStock: 25,
  image: "https://m.media-amazon.com/images/I/61+6iAfoCzL.jpg",
  needsPrescription: false
},
{
  name: "Prohance Mom Vanilla Nutrition Powder",
  brand: "Prohance",
  category: "Vitamins",
  description: "Balanced nutritional supplement specially formulated for pregnant and lactating women.",
  price: 750,
  countInStock: 30,
  image: "https://ik.imagekit.io/wlfr/wellness/images/products/355380-1.jpg/tr:l-image,i-Wellness_logo_BDwqbQao9.png,lfo-bottom_right,w-200,h-90,c-at_least,cm-pad_resize,l-end",
  needsPrescription: false
},
// ================= OPTIMUM NUTRITION =================
{
  name: "Optimum Nutrition Gold Standard Whey Protein",
  brand: "Optimum Nutrition",
  category: "Vitamins",
  description: "High-quality whey protein for muscle recovery and strength.",
  price: 3200,
  countInStock: 20,
  image: "https://musclehousesupplements.com/wp-content/uploads/2021/09/1118950_1.webp",
  needsPrescription: false
},
{
  name: "Optimum Nutrition Serious Mass",
  brand: "Optimum Nutrition",
  category: "Vitamins",
  description: "Mass gainer supplement for muscle growth and weight gain.",
  price: 3500,
  countInStock: 15,
  image: "https://tiimg.tistatic.com/fp/1/006/155/optimum-nutrition-serious-mass-6lb-gain-powder-013.jpg",
  needsPrescription: false
},
{
  name: "Optimum Nutrition Amino Energy",
  brand: "Optimum Nutrition",
  category: "Vitamins",
  description: "Energy and amino acid supplement that supports workout performance.",
  price: 2100,
  countInStock: 18,
  image: "https://cdn11.bigcommerce.com/s-ilgxsy4t82/images/stencil/1280x1280/products/287793/891498/619EcHWXpKS__78168.1719831463.jpg?c=1&imbypass=on",
  needsPrescription: false
},
{
  name: "Optimum Nutrition Micronized Creatine Powder",
  brand: "Optimum Nutrition",
  category: "Vitamins",
  description: "Creatine supplement that helps improve strength and athletic performance.",
  price: 1900,
  countInStock: 22,
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlx-jbG4IXKXXPpYohLbDSoz6FekLOq5-2gQ&s",
  needsPrescription: false
},
// ================= PENTASURE =================
{
  name: "PentaSure Vanilla Nutrition Powder",
  brand: "PentaSure",
  category: "Vitamins",
  description: "Balanced nutritional supplement that provides energy and essential nutrients.",
  price: 580,
  countInStock: 40,
  image: "https://images.apollo247.in/pub/media/catalog/product/P/E/PEN0377_1-AUG23_1.jpg",
  needsPrescription: false
},
{
  name: "PentaSure Chocolate Nutrition Powder",
  brand: "PentaSure",
  category: "Vitamins",
  description: "Chocolate flavored nutritional supplement for energy and strength.",
  price: 590,
  countInStock: 35,
  image: "https://pentasurenutrition.com/cdn/shop/files/1.png?v=1756972403&width=1946",
  needsPrescription: false
},
{
  name: "PentaSure High Protein Powder",
  brand: "PentaSure",
  category: "Vitamins",
  description: "High protein nutritional drink that supports muscle health and recovery.",
  price: 620,
  countInStock: 30,
  image: "https://www.jiomart.com/images/product/original/rvbn1qwrm9/pentasure-hp-whey-protein-banana-vanilla-flavour-1-kg-product-images-orvbn1qwrm9-p599947689-0-202510131838.jpg?im=Resize=(420,420)",
  needsPrescription: false
},
{
  name: "PentaSure Diabetes Care Powder",
  brand: "PentaSure",
  category: "Diabetes",
  description: "Special nutritional supplement designed for diabetic patients.",
  price: 650,
  countInStock: 25,
  image: "https://www.cureka.com/wp-content/uploads/2022/11/DM_01.jpg",
  needsPrescription: false
},
// ================= ACCU-CHEK =================
{
  name: "Accu-Chek Performa Glucometer Kit",
  brand: "Accu-chek",
  category: "Diabetes",
  description: "Easy-to-use glucometer that provides fast and accurate blood glucose readings.",
  price: 1250,
  countInStock: 20,
  image: "https://tse1.mm.bing.net/th/id/OIP.IOPiVfIP82pxzkcmJsG95gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
},
{
  name: "Accu-Chek FastClix Lancet Device",
  brand: "Accu-chek",
  category: "Diabetes",
  description: "Advanced lancet device designed for comfortable blood sampling.",
  price: 650,
  countInStock: 35,
  image: "https://tse2.mm.bing.net/th/id/OIP.SOKvJ5JBL7y8yTrVWF_jLAHaHZ?w=1668&h=1667&rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
},
{
  name: "Accu-Chek Guide Test Strips (25 Strips)",
  brand: "Accu-chek",
  category: "Diabetes",
  description: "Test strips designed for use with Accu-Chek Guide meters for precise readings.",
  price: 720,
  countInStock: 50,
  image: "https://healkit.in/sg/wp-content/uploads/2024/02/accu-chek-guide-50-strips-buy-online.jpg",
  needsPrescription: false
},
{
  name: "Accu-Chek Safe-T-Pro Plus Lancets",
  brand: "Accu-chek",
  category: "Diabetes",
  description: "Single-use sterile lancets designed for safe and hygienic blood sampling.",
  price: 480,
  countInStock: 40,
  image: "https://cdn.shopify.com/s/files/1/0507/7817/7707/products/LA010_0.jpg?v=1608494734",
  needsPrescription: false
},
// ================= PILGRIM =================
{
  name: "Pilgrim Vitamin C Face Serum",
  brand: "Pilgrim",
  category: "Skin Care",
  description: "Brightens skin, reduces dark spots and improves skin texture.",
  price: 650,
  countInStock: 40,
  image: "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/original/1153267/Gfu-1Qrsma-1153267-1.jpg",
  needsPrescription: false
},
{
  name: "Pilgrim Squalane Glow Moisturizer",
  brand: "Pilgrim",
  category: "Skin Care",
  description: "Hydrating moisturizer that improves skin glow and softness.",
  price: 550,
  countInStock: 35,
  image: "https://discoverpilgrim.com/cdn/shop/files/squalane-glow-moisturizer-855259_8160e311-9879-420d-8a2f-e15446aae127.jpg?v=1735042345&width=1000",
  needsPrescription: false
},
{
  name: "Pilgrim Red Vine Face Cream",
  brand: "Pilgrim",
  category: "Skin Care",
  description: "Anti-aging cream that reduces wrinkles and improves skin elasticity.",
  price: 720,
  countInStock: 25,
  image: "https://m.media-amazon.com/images/I/416dsBnT8nL._SX300_SY300_QL70_ML2_.jpg",
  needsPrescription: false
},
{
  name: "Pilgrim Tea Tree Face Wash",
  brand: "Pilgrim",
  category: "Skin Care",
  description: "Deep cleansing face wash that removes oil and acne-causing bacteria.",
  price: 350,
  countInStock: 45,
  image: "https://m.media-amazon.com/images/I/61dwJ36q-jL._SL1500_.jpg",
  needsPrescription: false
},
// ================= CETAPHIL =================
{
  name: "Cetaphil Baby Daily Lotion",
  brand: "Cetaphil",
  category: "Skin Care",
  description: "Gentle moisturizing lotion specially formulated for baby's delicate skin.",
  price: 520,
  countInStock: 35,
  image: "https://babymall.hk/wp-content/uploads/2020/03/302990200140_01.jpg",
  needsPrescription: false
},
{
  name: "Cetaphil Bright Healthy Radiance Cream",
  brand: "Cetaphil",
  category: "Skin Care",
  description: "Face cream that improves skin brightness and reduces dark spots.",
  price: 890,
  countInStock: 20,
  image: "https://tse1.mm.bing.net/th/id/OIP.nj8DCOngmlhK73H0T_bNGwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
},
{
  name: "Cetaphil Pro Oil Control Foam Wash",
  brand: "Cetaphil",
  category: "Skin Care",
  description: "Foaming face wash designed for acne-prone and oily skin.",
  price: 760,
  countInStock: 25,
  image: "https://icm4online.com/wp-content/uploads/2024/05/Cetaphil-Pro-Oil-Control-Foam-Wash-236ml.jpg",
  needsPrescription: false
},
{
  name: "Cetaphil Sun SPF 50+ Light Gel",
  brand: "Cetaphil",
  category: "Skin Care",
  description: "High protection sunscreen gel that protects skin from harmful UV rays.",
  price: 850,
  countInStock: 30,
  image: "https://newlankapharmacy.lk/wp-content/uploads/2024/12/368a68a3-744f-4731-8c7d-eeab7828e924.jpeg",
  needsPrescription: false
},
// ================= HIMALAYA =================
{
  name: "Himalaya Liv.52 Tablets",
  brand: "Himalaya",
  category: "Ayurveda",
  description: "Herbal supplement that supports liver health and detoxification.",
  price: 150,
  countInStock: 60,
  image: "https://himalayawellness.eu/cdn/shop/files/LIV-52-DS-2000px-KI_1.png?v=1699423150&width=1080",
  needsPrescription: false
},
{
  name: "Himalaya Gasex Tablets",
  brand: "Himalaya",
  category: "Ayurveda",
  description: "Helps relieve gas, bloating and supports digestive health.",
  price: 140,
  countInStock: 55,
  image: "https://tse1.mm.bing.net/th/id/OIP.44l1NyQ_T5O5ILhLEcZEBQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
},
{
  name: "Himalaya Koflet Syrup",
  brand: "Himalaya",
  category: "Ayurveda",
  description: "Herbal cough syrup that soothes throat irritation and cough.",
  price: 110,
  countInStock: 50,
  image: "https://tse2.mm.bing.net/th/id/OIP.obVVzOZ2nh0lQfciRhZf1QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
},
{
  name: "Himalaya Bonnisan Syrup",
  brand: "Himalaya",
  category: "Ayurveda",
  description: "Herbal digestive tonic that supports appetite and digestion in children.",
  price: 120,
  countInStock: 45,
  image: "https://tse2.mm.bing.net/th/id/OIP.QQtr0YimWxkfAQtZ3PBHZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  needsPrescription: false
}
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Initializing database connection...");
    await connectDB();

    // Verification step: Ensure the model is working
    console.log("🗑️  Cleaning 'medicines' collection...");
    await Medicine.deleteMany({});

    console.log("🌱 Inserting fresh medicine records...");
    const createdMedicines = await Medicine.insertMany(medicines);

    console.log(`✅ Success! ${createdMedicines.length} medicines added to MediQuick+`);
    
    // Explicitly close connection and exit
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();