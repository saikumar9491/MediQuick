import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema({
  ruleName: { 
    type: String, 
    required: true 
  },
  conditionType: {
    type: String,
    enum: ['Low Demand', 'Expiring Soon', 'High Demand, Low Stock', 'Overstocked'],
    required: true
  },
  thresholds: {
    // These will vary based on conditionType
    daysWithoutSale: { type: Number },
    stockGreaterThan: { type: Number },
    expiryDaysLessThan: { type: Number },
    salesLast7DaysGreaterThan: { type: Number },
    stockLessThan: { type: Number }
  },
  adjustmentPercent: {
    type: Number,
    required: true // e.g. -10 for 10% discount, +5 for 5% markup
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const PricingRule = mongoose.model('PricingRule', pricingRuleSchema);
export default PricingRule;
