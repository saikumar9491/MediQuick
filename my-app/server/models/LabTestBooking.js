import mongoose from 'mongoose';

const labTestBookingSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  scheduledDate: { type: String, required: true }, // YYYY-MM-DD
  scheduledTimeSlot: { type: String, required: true }, // e.g. "08:00 AM - 10:00 AM"
  address: {
    fullName: String,
    phoneNumber: String,
    streetAddress: String,
    city: String,
    state: String,
    pincode: String
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Sample Collected', 'Processing', 'Report Ready', 'Cancelled'],
    default: 'Scheduled'
  },
  reportFileUrl: { type: String }, // PDF url
  collectionAgentId: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentMethod: { type: String, default: 'COD' }
}, { timestamps: true });

export default mongoose.models.LabTestBooking || mongoose.model('LabTestBooking', labTestBookingSchema);
