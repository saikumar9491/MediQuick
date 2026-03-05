import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      brand: String
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    pincode: String,
    building: String,
    area: String
  },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order; // Changed to export default