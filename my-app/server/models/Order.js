import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Link to the user who placed the order
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
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
    pincode: { type: String, required: true },
    building: { type: String, required: true },
    area: { type: String, required: true }
  },
  
  paymentMethod: { 
    type: String, 
    required: true, 
    default: 'Cash on Delivery' 
  },
  
  status: { 
    type: String, 
    default: 'Confirmed',
    enum: ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] 
  },

}, { 
  // Automatically manages createdAt and updatedAt fields
  timestamps: true 
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;