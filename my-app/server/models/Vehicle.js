import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  plateNumber: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['Bike', 'Scooter', 'Van'], 
    required: true 
  },
  assignedRiderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DeliveryPartner' 
  },
  registrationDate: { 
    type: Date 
  },
  insuranceExpiry: { 
    type: Date 
  },
  lastServiceDate: { 
    type: Date 
  },
  nextServiceDue: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Maintenance Due', 'Out of Service'], 
    default: 'Active' 
  }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
