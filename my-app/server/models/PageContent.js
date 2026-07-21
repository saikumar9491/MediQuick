import mongoose from 'mongoose';

const trustClaimSchema = new mongoose.Schema({
  text: { type: String, required: true },
  confirmedAccurate: { type: Boolean, default: false }
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const auditLogSchema = new mongoose.Schema({
  updatedBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  action: { type: String, required: true }
});

const pageContentSchema = mongoose.Schema({
  pageKey: {
    type: String,
    enum: ['lab-tests', 'ayurveda', 'consult', 'care-plan'],
    required: true,
    unique: true
  },
  title: { type: String },
  heroHeadline: { type: String, required: true },
  heroSubtext: { type: String, required: true },
  status: {
    type: String,
    enum: ['Live', 'ComingSoon', 'Hidden'],
    default: 'Live'
  },
  themeAccent: { type: String, default: '#4A6B49' }, // Used for Ayurveda or themed accents
  trustClaims: [trustClaimSchema],
  featuredItems: [{ type: String }],
  faqs: [faqSchema],
  aboutBlock: { type: String },
  auditLog: [auditLogSchema]
}, { timestamps: true });

export default mongoose.models.PageContent || mongoose.model('PageContent', pageContentSchema);
