import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

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
  needsRx: { type: Boolean, default: false },
  isFlashDeal: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  discountPrice: { type: Number },
  subCategory: { type: String },
}, { timestamps: true });

export default mongoose.model('Medicine', medicineSchema);