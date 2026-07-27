const fs = require('fs');
const path = require('path');
const { calculateAccuracy } = require('../services/scoringService');
const { evaluateSpeech } = require('../services/openaiService');
const TestResult = require('../models/TestResult');

const sentencesPath = path.join(__dirname, '../data/sentences.json');
let sentences = [];
try {
  sentences = JSON.parse(fs.readFileSync(sentencesPath, 'utf8'));
} catch (e) {
  console.error('Failed to load sentences', e);
}

// @desc    Get a random sentence
// @route   GET /api/speech/sentence
// @access  Public (or Private)
exports.getSentence = (req, res, next) => {
  if (sentences.length === 0) {
    return res.status(500).json({ success: false, message: 'No sentences available' });
  }
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
  res.status(200).json({ success: true, data: randomSentence });
};

// @desc    Evaluate a speech transcript
// @route   POST /api/speech/evaluate
// @access  Private
exports.evaluate = async (req, res, next) => {
  try {
    const { original, transcript, durationSeconds, module } = req.body;

    if (!original || !transcript || !durationSeconds || !module) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1. Basic word matching
    const diffResults = calculateAccuracy(original, transcript);
    
    // 2. Pace calculation
    const wordCount = transcript.split(/\s+/).length;
    const pace = Math.round((wordCount / durationSeconds) * 60);

    // 3. OpenAI evaluation
    const aiFeedback = await evaluateSpeech(original, transcript, pace);

    // Combine scores
    const finalScore = {
      accuracy: diffResults.accuracy,
      pronunciation: aiFeedback.pronunciationScore,
      fluency: aiFeedback.fluencyScore,
      pace: pace
    };

    const overallScore = Math.round(
      (finalScore.accuracy * 0.4) + 
      (finalScore.pronunciation * 0.4) + 
      (finalScore.fluency * 0.2)
    );

    // Save to DB
    const testResult = await TestResult.create({
      userId: req.user._id,
      module: module,
      scoreBreakdown: {
        accuracy: finalScore.accuracy,
        pronunciation: finalScore.pronunciation,
        fluency: finalScore.fluency,
        overall: overallScore
      },
      weakAreas: diffResults.accuracy < 80 ? ['Accuracy'] : [] // Simplified logic
    });

    res.status(200).json({
      success: true,
      data: {
        score: finalScore,
        overallScore,
        diff: diffResults,
        feedback: aiFeedback.feedbackNotes,
        resultId: testResult._id
      }
    });
  } catch (error) {
    next(error);
  }
};

const topics = [
  "My Favorite Teacher",
  "Work From Home vs Office",
  "Artificial Intelligence in Daily Life",
  "The Impact of Social Media",
  "Climate Change and Our Responsibilities"
];

// @desc    Get a random speaking topic
// @route   GET /api/speech/topic
// @access  Public (or Private)
exports.getTopic = (req, res, next) => {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  res.status(200).json({ success: true, data: { text: randomTopic } });
};

// @desc    Evaluate a free-form speaking topic transcript
// @route   POST /api/speech/evaluate-topic
// @access  Private
exports.evaluateTopic = async (req, res, next) => {
  try {
    const { topic, transcript, module } = req.body;

    if (!topic || !transcript || !module) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1. Count filler words via regex
    const fillerRegex = /\b(uh|um|like|you know|basically|actually|literally)\b/gi;
    const fillerMatches = transcript.match(fillerRegex);
    const fillerCount = fillerMatches ? fillerMatches.length : 0;

    // 2. OpenAI evaluation for rubric
    const { evaluateSpeakingTopic } = require('../services/openaiService');
    const aiFeedback = await evaluateSpeakingTopic(topic, transcript);

    // Save to DB
    const testResult = await TestResult.create({
      userId: req.user._id,
      module: module,
      scoreBreakdown: {
        fillerCount,
        grammarScore: aiFeedback.grammarIssues?.length === 0 ? 100 : Math.max(0, 100 - ((aiFeedback.grammarIssues?.length || 0) * 10)),
        overall: 80 // Simplified for MVP
      },
      weakAreas: fillerCount > 5 ? ['FillerWords'] : []
    });

    res.status(200).json({
      success: true,
      data: {
        fillerCount,
        fillerWordsFound: fillerMatches || [],
        aiRubric: aiFeedback,
        resultId: testResult._id
      }
    });
  } catch (error) {
    next(error);
  }
};
