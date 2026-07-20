import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pincodes: [{ type: String, required: true }],
  estimatedDeliveryTime: { type: Number, required: true }, // in minutes
  deliveryFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('DeliveryZone', deliveryZoneSchema);
