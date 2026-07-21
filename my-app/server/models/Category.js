import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  iconName: { type: String, default: 'LayoutGrid' }, // Lucide icon name
  path: { type: String, required: true },
  subOptions: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
