import mongoose from 'mongoose';

const abTestVariantSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., 'A', 'B'
  content: { type: String, required: true }, // The config for this variant (e.g. image URL, sort order string)
  impressions: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  revenueAttributed: { type: Number, default: 0 }
});

const abTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Banner', 'Product Sort', 'Pricing', 'Notification Copy', 'Other'],
    required: true 
  },
  status: {
    type: String,
    enum: ['Draft', 'Running', 'Completed'],
    default: 'Draft'
  },
  trafficSplit: { type: Number, default: 50 }, // Percentage going to Variant A
  successMetric: {
    type: String,
    enum: ['Click-through Rate', 'Conversion Rate', 'Revenue per Visitor'],
    default: 'Conversion Rate'
  },
  variants: [abTestVariantSchema],
  startDate: { type: Date },
  endDate: { type: Date },
  winningVariant: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

const ABTest = mongoose.model('ABTest', abTestSchema);
export default ABTest;
