import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Medicine from './models/Medicine.js';
import Category from './models/Category.js';
import LabTest from './models/LabTest.js';
import Doctor from './models/Doctor.js';
import CarePlan from './models/CarePlan.js';
import PageContent from './models/PageContent.js';

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
  image: "https://www.netmeds.com/images/product-v1/600x600/1005844/tata_1mg_tejasya_amla_juice_1000_ml_0_1.jpg",
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
  image: "https://m.media-amazon.com/images/I/61M-1Pq-3QL._SL1500_.jpg",
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
  image: "https://www.netmeds.com/images/product-v1/600x600/840428/pentasure_hp_powder_banana_vanilla_flavour_1_kg_0_1.jpg",
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
  image: "https://m.media-amazon.com/images/I/61N1-Jq7KGL._SL1000_.jpg",
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
  image: "https://m.media-amazon.com/images/I/71k42TqWwTL._SL1500_.jpg",
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
  image: "https://m.media-amazon.com/images/I/71YyNis1HML._SL1500_.jpg",
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
},
{
    name: "Indulekha Bringha Oil",
    brand: "Indulekha",
    category: "Hair Care",
    subCategory: "Hair Oils",
    description: "Ayurvedic medicine for hair fall and hair growth.",
    price: 430,
    countInStock: 40,
    image: "https://m.media-amazon.com/images/I/618xM9v6u8L._SL1000_.jpg",
    needsPrescription: false
  },
  {
    name: "L'Oreal Professional Shampoo",
    brand: "L'Oreal",
    category: "Hair Care",
    subCategory: "Shampoos & Conditioners",
    description: "Expert hair care for smooth and shiny hair.",
    price: 650,
    countInStock: 25,
    image: "https://m.media-amazon.com/images/I/51p8I3vP6EL._SL1000_.jpg",
    needsPrescription: false
  },
  {
    name: "Mamaearth Onion Hair Serum",
    brand: "Mamaearth",
    category: "Hair Care",
    subCategory: "Hair Serums",
    description: "Reduces hair frizz and provides a healthy glow.",
    price: 299,
    countInStock: 50,
    image: "https://m.media-amazon.com/images/I/51-mOQ+fHIL._SL1200_.jpg",
    needsPrescription: false
  },
  {
    name: "L'Oreal Paris Casting Creme Gloss",
    brand: "L'Oreal",
    category: "Hair Care",
    subCategory: "Hair Colour",
    description: "Ammonia-free hair colour for natural looking shine.",
    price: 550,
    countInStock: 30,
    image: "https://m.media-amazon.com/images/I/81E+nI-oZ8L._SL1500_.jpg",
    needsPrescription: false
  },
  {
    name: "Himalaya Anti-Hair Fall Cream",
    brand: "Himalaya",
    category: "Hair Care",
    subCategory: "Hair Creams & Masks",
    description: "Nourishes hair roots and reduces hair fall.",
    price: 150,
    countInStock: 60,
    image: "https://m.media-amazon.com/images/I/51TjB2Y8DYL._SL1000_.jpg",
    needsPrescription: false
  },
  {
    name: "MuscleBlaze Whey Protein",
    brand: "MuscleBlaze",
    category: "Fitness & Health",
    subCategory: "Proteins",
    description: "High quality whey protein for muscle building.",
    price: 1800,
    countInStock: 20,
    image: "https://m.media-amazon.com/images/I/61m1vX2T+qL._SL1100_.jpg",
    needsPrescription: false
  }
];


const categoriesList = [
  { 
    name: 'Health Resource Center', 
    iconName: 'BookOpen', 
    path: '/categories',
    subOptions: [
      { name: 'All Medicines', path: '/categories' },
      { name: 'Lab Tests', path: '/lab-tests' },
      { name: 'Ayurveda', path: '/ayurveda' },
      { name: 'Consult Top Doctors', path: '/consult' },
      { name: 'Care Plan', path: '/care-plan' }
    ]
  },
  { name: 'Hair Care', iconName: 'Sparkles', path: '/medicines?filter=hair-care', subOptions: ['Hair Oils', 'Shampoos & Conditioners', 'Hair Serums', 'Hair Creams & Masks', 'Hair Colour', 'Hair Growth Products', 'Essential Oils'] },
  { name: 'Fitness & Health', iconName: 'Dumbbell', path: '/medicines?filter=fitness', subOptions: ['Vitamins', 'Proteins', 'Health Drinks', 'Gym Accessories'] },
  { name: 'Sexual Wellness', iconName: 'Activity', path: '/medicines?filter=sexual-wellness', subOptions: ['Condoms', 'Lubricants', 'Personal Wash', 'Performance'] },
  { name: 'Vitamins & Nutrition', iconName: 'Apple', path: '/medicines?filter=vitamins', subOptions: ['Multivitamins', 'Minerals', 'Omega & Fish Oil', 'Biotin'] },
  { name: 'Supports & Braces', iconName: 'Heart', path: '/medicines?filter=supports', subOptions: ['Knee Supports', 'Back Supports', 'Ankle Supports', 'Wrist Supports'] },
  { name: 'Immunity Boosters', iconName: 'Shield', path: '/medicines?filter=immunity', subOptions: ['Chyawanprash', 'Herbal Juices', 'Vitamin C', 'Zinc'] },
  { name: 'Homeopathy', iconName: 'Leaf', path: '/medicines?filter=homeopathy', subOptions: ['Cough & Cold', 'Digestion', 'Skin Care', 'Hair Care'] },
  { name: 'Pet Care', iconName: 'Dog', path: '/medicines?filter=pet-care', subOptions: ['Dog Food', 'Cat Food', 'Pet Grooming', 'Pet Medicines'] }
];

const labTestsList = [
  {
    name: "Complete Blood Count (CBC)",
    description: "Evaluates overall health and detects a wide range of disorders, including anemia, infection, and leukemia.",
    parameters: ["Hemoglobin", "Total Leukocyte Count (WBC)", "Red Blood Cell Count (RBC)", "Platelet Count", "Mean Corpuscular Volume (MCV)", "Hematocrit (PCV)"],
    sampleType: "Blood",
    prepInstructions: "No special preparation or fasting is required.",
    price: 299,
    discountedPrice: 249,
    turnaroundHours: 24,
    category: "Full Body Checkup"
  },
  {
    name: "Thyroid Profile (Total T3, Total T4, TSH)",
    description: "Helps evaluate thyroid gland function and diagnose conditions like hypothyroidism or hyperthyroidism.",
    parameters: ["Triiodothyronine (T3)", "Thyroxine (T4)", "Thyroid Stimulating Hormone (TSH)"],
    sampleType: "Blood",
    prepInstructions: "No fasting is strictly required, but morning collection is highly recommended.",
    price: 499,
    discountedPrice: 399,
    turnaroundHours: 24,
    category: "Thyroid"
  },
  {
    name: "Diabetes Screening (HbA1c & Fasting Sugar)",
    description: "Provides an average of your blood sugar control over the past 3 months along with your current fasting sugar level.",
    parameters: ["HbA1c (Glycated Hemoglobin)", "Average Blood Glucose", "Fasting Blood Sugar"],
    sampleType: "Blood",
    prepInstructions: "10-12 hours of overnight fasting is mandatory prior to the test.",
    price: 599,
    discountedPrice: 450,
    turnaroundHours: 24,
    category: "Diabetes"
  }
];

const doctorsList = [
  {
    name: "Dr. Amit Sharma",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    qualifications: "MBBS, MD (Internal Medicine)",
    specialization: "General Physician",
    experienceYears: 14,
    bio: "Senior consultant with extensive experience in preventative health, fever management, diabetes control, and chronic care.",
    languagesSpoken: ["English", "Hindi", "Punjabi"],
    consultationFee: 499,
    consultationModes: ["chat", "video", "audio"],
    rating: 4.9,
    numReviews: 142,
    registrationNumber: "MCI-48291",
    isActive: true,
    isVerified: true
  },
  {
    name: "Dr. Priya Verma",
    photo: "https://images.unsplash.com/photo-1594824813566-88855ce78341?auto=format&fit=crop&w=600&q=80",
    qualifications: "MBBS, MD (Dermatology)",
    specialization: "Dermatologist",
    experienceYears: 10,
    bio: "Specialist in acne treatments, eczema, hair loss therapies, and clinical skin health.",
    languagesSpoken: ["English", "Hindi"],
    consultationFee: 699,
    consultationModes: ["chat", "video"],
    rating: 4.8,
    numReviews: 98,
    registrationNumber: "MCI-59102",
    isActive: true,
    isVerified: true
  },
  {
    name: "Dr. Rajesh Gupta",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    qualifications: "MBBS, DCH (Pediatrics)",
    specialization: "Pediatrician",
    experienceYears: 12,
    bio: "Child healthcare specialist focusing on infant nutrition, growth milestones, and pediatric fever care.",
    languagesSpoken: ["English", "Hindi"],
    consultationFee: 599,
    consultationModes: ["video", "audio"],
    rating: 4.9,
    numReviews: 175,
    registrationNumber: "MCI-37190",
    isActive: true,
    isVerified: true
  },
  {
    name: "Dr. Sneha Reddy",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    qualifications: "MBBS, MS (Obstetrics & Gynaecology)",
    specialization: "Gynecologist",
    experienceYears: 11,
    bio: "Expert in women's health, PCOS management, prenatal guidance, and hormonal wellness.",
    languagesSpoken: ["English", "Hindi", "Telugu"],
    consultationFee: 649,
    consultationModes: ["chat", "video", "audio"],
    rating: 4.9,
    numReviews: 110,
    registrationNumber: "MCI-62819",
    isActive: true,
    isVerified: true
  }
];

const carePlansList = [
  {
    name: "Care Plan Monthly",
    tier: "monthly",
    price: 199,
    discountPercentage: 5,
    freeDeliveryThreshold: 199,
    benefitsList: [
      "Free Delivery on orders above ₹199",
      "Extra 5% discount on all medicines",
      "Priority customer care & chat support"
    ],
    isActive: true
  },
  {
    name: "Care Plan Annual",
    tier: "annual",
    price: 999,
    discountPercentage: 10,
    freeDeliveryThreshold: 0,
    benefitsList: [
      "Free Delivery on ALL orders (No min order)",
      "Extra 10% discount on all medicines",
      "1 Free Annual CBC Lab Checkup",
      "Priority customer care & dedicated manager"
    ],
    isActive: true
  }
];

const pageContentList = [
  {
    pageKey: "lab-tests",
    title: "Lab Tests & Diagnostics",
    heroHeadline: "Book lab tests from your home.",
    heroSubtext: "Certified lab assistants collect samples at your convenience. Accurate diagnostic reports are uploaded directly to your profile.",
    status: "Live",
    trustClaims: [
      { text: "NABL Accredited Partner Labs Only", confirmedAccurate: true },
      { text: "100% Home Sample Collection", confirmedAccurate: true },
      { text: "Digital Reports Delivered via Profile", confirmedAccurate: true }
    ],
    auditLog: [{ updatedBy: "System Seed", action: "Initial Seed" }]
  },
  {
    pageKey: "ayurveda",
    title: "Ayurveda & Herbal Care",
    heroHeadline: "Ayurveda, rooted in tradition",
    heroSubtext: "Time-tested herbal wellness formulas, classical Chyawanprash, pure juices, and natural remedies.",
    status: "Live",
    themeAccent: "#4A6B49",
    aboutBlock: "Ayurveda is a 5,000-year-old traditional Indian system of holistic healing and wellness.",
    auditLog: [{ updatedBy: "System Seed", action: "Initial Seed" }]
  },
  {
    pageKey: "consult",
    title: "Doctor Consultations",
    heroHeadline: "Talk to certified doctors from home.",
    heroSubtext: "Connect with verified medical specialists via HD video, audio, or instant chat. Get digital prescriptions & medical advice.",
    status: "Live",
    auditLog: [{ updatedBy: "System Seed", action: "Initial Seed" }]
  },
  {
    pageKey: "care-plan",
    title: "MediQuick Care Plan",
    heroHeadline: "MediQuick Care Plan",
    heroSubtext: "Unlimited free delivery, extra medicine discounts, and priority healthcare support for you and your family.",
    status: "Live",
    faqs: [
      { question: "How does billing work?", answer: "Care Plan is billed as a 1-time upfront payment for your selected billing frequency." },
      { question: "Can I cancel anytime?", answer: "Yes! You can cancel your subscription at any time with 1 click from your profile." }
    ],
    auditLog: [{ updatedBy: "System Seed", action: "Initial Seed" }]
  }
];

const seedDatabase = async () => {
  try {
    console.log("⏳ Initializing database connection...");
    await connectDB();

    console.log("🗑️  Cleaning 'medicines' collection...");
    await Medicine.deleteMany({});

    console.log("🗑️  Cleaning 'categories' collection...");
    await Category.deleteMany({});

    console.log("🗑️  Cleaning 'labtests' collection...");
    await LabTest.deleteMany({});

    console.log("🗑️  Cleaning 'doctors' collection...");
    await Doctor.deleteMany({});

    console.log("🗑️  Cleaning 'careplans' collection...");
    await CarePlan.deleteMany({});

    console.log("🗑️  Cleaning 'pagecontents' collection...");
    await PageContent.deleteMany({});

    console.log("🌱 Inserting fresh medicine records...");
    const createdMedicines = await Medicine.insertMany(medicines);
    console.log(`✅ Success! ${createdMedicines.length} medicines added to MediQuick+`);

    console.log("🌱 Inserting fresh category records...");
    const createdCategories = await Category.insertMany(categoriesList);
    console.log(`✅ Success! ${createdCategories.length} categories added to MediQuick+`);

    console.log("🌱 Inserting fresh lab test records...");
    const createdLabTests = await LabTest.insertMany(labTestsList);
    console.log(`✅ Success! ${createdLabTests.length} lab tests added to MediQuick+`);

    console.log("🌱 Inserting fresh doctor records...");
    const createdDoctors = await Doctor.insertMany(doctorsList);
    console.log(`✅ Success! ${createdDoctors.length} doctors added to MediQuick+`);

    console.log("🌱 Inserting fresh Care Plan records...");
    const createdCarePlans = await CarePlan.insertMany(carePlansList);
    console.log(`✅ Success! ${createdCarePlans.length} care plans added to MediQuick+`);

    console.log("🌱 Inserting fresh Page Content records...");
    const createdPageContents = await PageContent.insertMany(pageContentList);
    console.log(`✅ Success! ${createdPageContents.length} page contents added to MediQuick+`);
    
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