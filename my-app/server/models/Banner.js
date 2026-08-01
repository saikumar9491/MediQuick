import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Internal banner name is required'],
      trim: true 
    },
    type: { 
      type: String, 
      enum: ['image', 'image-text', 'text-color', 'floating-video'], 
      default: 'image-text' 
    },
    videoUrl: {
      type: String,
      default: ''
    },
    isLive: {
      type: Boolean,
      default: false
    },
    imageUrl: { 
      type: String, 
      default: '' 
    },
    mobileImageUrl: { 
      type: String, 
      default: '' 
    },
    altText: { 
      type: String, 
      default: 'Promotional Banner' 
    },
    headline: { 
      type: String, 
      default: '' 
    },
    subtext: { 
      type: String, 
      default: '' 
    },
    badgeText: { 
      type: String, 
      default: '' 
    },
    ctaLabel: { 
      type: String, 
      default: 'SHOP NOW' 
    },
    ctaUrl: { 
      type: String, 
      default: '/medicines' 
    },
    ctaColor: { 
      type: String, 
      enum: ['blue', 'orange', 'green', 'purple', 'dark', 'custom'], 
      default: 'blue' 
    },
    bgColor: { 
      type: String, 
      default: 'from-blue-700 via-blue-800 to-indigo-900' 
    },
    textColor: { 
      type: String, 
      enum: ['white', 'dark'], 
      default: 'white' 
    },
    placement: { 
      type: String, 
      enum: [
        'homepage-hero', 
        'category-mini', 
        'mobile-homepage', 
        'all-medicines', 
        'flash-sale', 
        'lab-tests', 
        'ayurveda',
        'floating-video',
        'main'
      ], 
      default: 'homepage-hero' 
    },
    categorySlug: {
      type: String,
      default: ''
    },
    targetDevice: { 
      type: String, 
      enum: ['both', 'desktop', 'mobile'], 
      default: 'both' 
    },
    displayOrder: { 
      type: Number, 
      default: 0 
    },
    status: { 
      type: String, 
      enum: ['active', 'draft', 'scheduled', 'expired'], 
      default: 'active' 
    },
    startDate: { 
      type: Date, 
      default: null 
    },
    endDate: { 
      type: Date, 
      default: null 
    },
    openInNewTab: { 
      type: Boolean, 
      default: false 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      default: null
    },
    // Backward compatibility aliases
    title: { type: String },
    desc: { type: String },
    image: { type: String },
    bg: { type: String },
    link: { type: String },
    category: { type: String },
    brand: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Pre-save hook for sync & auto-status updates
bannerSchema.pre('save', function (next) {
  // Sync legacy fields
  if (!this.title) this.title = this.headline || this.name;
  if (!this.headline) this.headline = this.title || this.name;
  if (!this.image) this.image = this.imageUrl || this.mobileImageUrl;
  if (!this.imageUrl) this.imageUrl = this.image || '';
  if (!this.desc) this.desc = this.subtext;
  if (!this.subtext) this.subtext = this.desc || '';
  if (!this.link) this.link = this.ctaUrl;
  if (!this.ctaUrl) this.ctaUrl = this.link || '/medicines';
  if (!this.bg) this.bg = this.bgColor;
  if (!this.bgColor) this.bgColor = this.bg || 'from-blue-700 via-blue-800 to-indigo-900';
  if (!this.category) this.category = this.placement;

  const now = new Date();

  // Handle scheduled / active / expired status updates based on dates
  if (this.startDate && new Date(this.startDate) > now && this.status !== 'draft') {
    this.status = 'scheduled';
    this.isActive = false;
  } else if (this.endDate && new Date(this.endDate) <= now && this.status !== 'draft') {
    this.status = 'expired';
    this.isActive = false;
  } else if (this.status === 'active') {
    this.isActive = true;
  } else {
    this.isActive = false;
  }

  next();
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
