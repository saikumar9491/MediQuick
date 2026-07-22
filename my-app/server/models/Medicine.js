import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  title: { type: String }, // NEW FIELD
  images: [{ type: String }], // NEW FIELD (Cloudinary URLs)
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  isApproved: { type: Boolean, default: false }, // Moderation default
  adminResponse: { type: String }, // NEW FIELD
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // For verified purchase
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  size: { type: String },
  weight: { type: String },
  price: { type: Number, required: true },
  countInStock: { type: Number, default: 0 }
});

const medicineSchema = mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: 'Professional pharmaceutical grade product.' },
  price: { type: Number, required: true },
  countInStock: { type: Number, default: 100 },
  image: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR62OQ4G_o-9YnZ-G_Xw9_G_Xw9_G_Xw9_G_Xw&usqp=CAU' },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  needsRx: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isFlashDeal: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  discountPrice: { type: Number },
  subCategory: { type: String },
  sku: { type: String },
  expiryDate: { type: Date },
  manufacturingDate: { type: Date },
  batchNumber: { type: String },
  dosageForm: { type: String },
  strength: { type: String },
  salt: { type: String },
  lowStockThreshold: { type: Number, default: 10 },
  unit: { type: String },
  tags: [{ type: String }],
  usesAndBenefits: { type: String, default: '' },
  howToUse: { type: String, default: '' },
  safetyInformation: { type: String, default: '' },
  ingredients: { type: String, default: '' },
  verifiedAuthentic: { type: Boolean, default: false },
  tagline: { type: String, default: '' },
  isBestseller: { type: Boolean, default: false },
  keyFeatures: [{ type: String }],
  additionalImages: [String],
  displayAttributes: [
    {
      label: { type: String },
      value: { type: String }
    }
  ],
  variants: [variantSchema]
}, { timestamps: true });

export default mongoose.model('Medicine', medicineSchema);