const fs = require('fs');
const path = require('path');
const TestResult = require('../models/TestResult');

const questionsPath = path.join(__dirname, '../data/grammar_questions.json');
let questions = [];
try {
  questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
} catch (e) {
  console.error('Failed to load grammar questions', e);
}

// @desc    Get grammar questions (filtered by category or quick mode)
// @route   GET /api/grammar/questions
// @access  Public (or Private)
exports.getQuestions = (req, res, next) => {
  const { category, mode } = req.query;
  let filtered = [...questions];

  if (category) {
    filtered = filtered.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  // Shuffle array
  filtered = filtered.sort(() => 0.5 - Math.random());

  // Limit for quick practice
  if (mode === 'quick') {
    filtered = filtered.slice(0, 10);
  }

  res.status(200).json({ success: true, data: filtered });
};

// @desc    Submit grammar quiz and get score
// @route   POST /api/grammar/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; 
    // answers is expected to be an array of objects: { questionId, selectedOption }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid submission format' });
    }

    let correctCount = 0;
    const reviewData = [];

    answers.forEach(ans => {
      const question = questions.find(q => q.id === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedOption;
        if (isCorrect) correctCount++;
        
        reviewData.push({
          questionId: question.id,
          questionText: question.questionText,
          selected: ans.selectedOption,
          correct: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        });
      }
    });

    const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

    // Save to DB
    const testResult = await TestResult.create({
      userId: req.user._id,
      module: 'Grammar',
      scoreBreakdown: {
        accuracy: score,
        overall: score
      },
      weakAreas: score < 70 ? ['Grammar Rules'] : []
    });

    res.status(200).json({
      success: true,
      data: {
        score,
        correctCount,
        total: answers.length,
        review: reviewData,
        resultId: testResult._id
      }
    });
  } catch (error) {
    next(error);
  }
};
