import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  servedZones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryZone' }],
  operatingHours: {
    open: { type: String, default: '09:00' }, // HH:mm format
    close: { type: String, default: '22:00' } // HH:mm format
  },
  orderCutoffTime: { type: String, default: '16:00' }, // HH:mm format
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Hub', hubSchema);
