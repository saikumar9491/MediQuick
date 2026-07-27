const fs = require('fs');
const path = require('path');
const TestResult = require('../models/TestResult');
const { calculateAccuracy } = require('../services/scoringService');

const vocabPath = path.join(__dirname, '../data/vocabulary.json');
let vocabulary = [];
try {
  vocabulary = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
} catch (e) {
  console.error('Failed to load vocabulary', e);
}

// @desc    Get 5 random words for daily challenge
// @route   GET /api/vocab/daily
// @access  Public (or Private)
exports.getDailyWords = (req, res, next) => {
  if (vocabulary.length < 5) {
    return res.status(500).json({ success: false, message: 'Not enough words in dictionary' });
  }
  
  const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);

  res.status(200).json({ success: true, data: selected });
};

// @desc    Evaluate single word pronunciation
// @route   POST /api/vocab/evaluate
// @access  Private
exports.evaluateWord = async (req, res, next) => {
  try {
    const { wordId, transcript } = req.body;

    if (!wordId || !transcript) {
      return res.status(400).json({ success: false, message: 'Missing wordId or transcript' });
    }

    const targetWord = vocabulary.find(v => v.id === wordId);
    if (!targetWord) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }

    // Use our existing word diffing logic
    const diffResults = calculateAccuracy(targetWord.word, transcript);
    
    // For single word pronunciation, we can be slightly lenient or strict.
    // If accuracy is >= 80, we consider it correct.
    const isCorrect = diffResults.accuracy >= 80;

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        accuracy: diffResults.accuracy,
        transcript
      }
    });
  } catch (error) {
    next(error);
  }
};
