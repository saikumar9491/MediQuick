import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Link to the user who placed the order (optional for POS sales)
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: function() { return this.orderType !== 'pos'; }
  },
  
  orderType: {
    type: String,
    enum: ['online', 'pos'],
    default: 'online'
  },
  
  customerName: { type: String },
  customerPhone: { type: String },
  
  // Snapshot of items at the time of purchase
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, // Good for 'Buy Again' logic
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      brand: { type: String }
    }
  ],
  
  totalAmount: { type: Number, required: true },
  
  shippingAddress: {
    name:         { type: String },
    phone:        { type: String },
    addressLine1: { type: String, required: function() { return this.orderType !== 'pos'; } },
    addressLine2: { type: String },
    landmark:     { type: String },
    area:         { type: String },
    city:         { type: String },
    state:        { type: String },
    pincode:      { type: String, required: function() { return this.orderType !== 'pos'; } },
    addressType:  { type: String, default: 'Home' },
  },
  prescriptionUrl: { type: String },
  deliveryDateString: { type: String },
  
  paymentMethod: { 
    type: String, 
    required: true, 
    default: 'Cash on Delivery' 
  },
  
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },

  transactionId: {
    type: String
  },
  
  status: { 
    type: String, 
    default: 'Placed',
    enum: ['Placed', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'] 
  },
  isReturnRequested: { type: Boolean, default: false },
  returnReason: { type: String },
  isRefunded: { type: Boolean, default: false },
  
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  discountApplied: { type: Number, default: 0 },
  
  assignedAgent: { type: String }, // Legacy string agent
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryZone' },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
}, { 
  // Automatically manages createdAt and updatedAt fields
  timestamps: true 
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;