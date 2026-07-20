import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  name:          { type: String, required: true },
  brand:         { type: String },
  price:         { type: Number, required: true },   // MRP / base price
  discountPrice: { type: Number },                   // sale price if set
  image:         { type: String },
  needsRx:       { type: Boolean, default: false },
  quantity:      { type: Number, default: 1, min: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:  [cartItemSchema],
  lastActivityAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'Reminded', 'Recovered', 'Expired'],
    default: 'Active',
  },
  recoveryEmailSentAt: { type: Date },
}, { timestamps: true });

// Keep lastActivityAt fresh on every item change — Abandoned Cart reads this
cartSchema.pre('save', function () {
  if (this.isModified('items') && this.status !== 'Recovered') {
    this.lastActivityAt = new Date();
    if (this.status !== 'Reminded') this.status = 'Active';
  }
});

export default mongoose.model('Cart', cartSchema);