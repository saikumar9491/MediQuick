import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  storeName: { 
    type: String, 
    default: 'MediQuick+' 
  },
  logo: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&auto=format&fit=crop&q=80' 
  },
  banner: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80' 
  },
  shippingCharges: { 
    type: Number, 
    default: 40 
  },
  tax: { 
    type: Number, 
    default: 12 // e.g. 12% GST
  },
  paymentGateway: { 
    type: String, 
    default: 'Razorpay' 
  },
  emailSettings: {
    smtpServer: { type: String, default: 'smtp-brevo.com' },
    smtpPort: { type: Number, default: 587 },
    senderEmail: { type: String, default: 'notifications@mediquick.com' }
  }
}, { 
  timestamps: true 
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
