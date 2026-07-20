import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  resultCount: { type: Number, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clickedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' } // Optional, if we add CTR tracking later
}, { timestamps: true });

const SearchLog = mongoose.model('SearchLog', searchLogSchema);
export default SearchLog;
