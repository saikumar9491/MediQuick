import mongoose from 'mongoose';

const carePlanSchema = mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Care Plan Monthly", "Care Plan Annual"
  tier: { type: String, enum: ['monthly', 'annual'], required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 5 },
  freeDeliveryThreshold: { type: Number, default: 0 }, // 0 means free delivery on ALL orders
  benefitsList: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.CarePlan || mongoose.model('CarePlan', carePlanSchema);
