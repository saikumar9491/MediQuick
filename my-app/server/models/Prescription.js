import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescriptionUrl: { type: String, required: true }, // Base64 dataUrl
    fileName: { type: String },
    fileSize: { type: Number },
    status: {
      type: String,
      enum: ['Pending Review', 'Approved', 'Rejected'],
      default: 'Pending Review'
    },
    rejectionReason: { type: String, default: '' },
    associatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
