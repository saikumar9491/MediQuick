import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  vehicleType: { type: String, enum: ['Bike', 'Scooter', 'Cycle', 'Van'], default: 'Bike' },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryZone' },
  status: { type: String, enum: ['on-duty', 'off-duty', 'delivering'], default: 'off-duty' },
  isActive: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model('DeliveryPartner', deliveryPartnerSchema);
