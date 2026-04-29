import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    image: { type: String, required: true },
    bg: { type: String, default: 'bg-gradient-to-r from-blue-500 to-blue-700' },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
