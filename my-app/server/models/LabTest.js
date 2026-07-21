import mongoose from 'mongoose';

const labTestSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  parameters: [{ type: String }],
  sampleType: { type: String, required: true },
  prepInstructions: { type: String },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  turnaroundHours: { type: Number, default: 24 },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.LabTest || mongoose.model('LabTest', labTestSchema);
