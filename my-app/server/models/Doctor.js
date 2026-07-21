import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String },
  qualifications: { type: String, required: true }, // e.g. "MBBS, MD (Dermatology)"
  specialization: { type: String, required: true }, // e.g. "Dermatologist", "General Physician"
  experienceYears: { type: Number, required: true },
  bio: { type: String },
  languagesSpoken: [{ type: String }],
  consultationFee: { type: Number, required: true },
  consultationModes: [{ type: String, enum: ['chat', 'video', 'audio'], default: ['chat', 'video'] }],
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 0 },
  registrationNumber: { type: String },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
