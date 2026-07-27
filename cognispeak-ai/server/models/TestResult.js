const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  module: {
    type: String,
    enum: ['ReadAloud', 'ListenRepeat', 'Speaking', 'Grammar', 'Reading', 'Email', 'MockTest'],
    required: true,
  },
  scoreBreakdown: {
    type: Map,
    of: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  weakAreas: {
    type: [String],
    default: [],
  }
});

module.exports = mongoose.model('TestResult', testResultSchema);
