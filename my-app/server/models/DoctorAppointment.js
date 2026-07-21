import mongoose from 'mongoose';

const doctorAppointmentSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  scheduledDate: { type: String, required: true }, // YYYY-MM-DD
  scheduledTimeSlot: { type: String, required: true }, // e.g. "10:00 AM - 10:30 AM"
  mode: { type: String, enum: ['chat', 'video', 'audio'], default: 'video' },
  symptomNotes: { type: String },
  attachmentUrl: { type: String },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  prescriptionFileUrl: { type: String },
  joinLink: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentMethod: { type: String, default: 'Online' }
}, { timestamps: true });

export default mongoose.models.DoctorAppointment || mongoose.model('DoctorAppointment', doctorAppointmentSchema);
