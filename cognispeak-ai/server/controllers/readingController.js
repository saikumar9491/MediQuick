const fs = require('fs');
const path = require('path');
const TestResult = require('../models/TestResult');

const passagesPath = path.join(__dirname, '../data/reading_passages.json');
let passages = [];
try {
  passages = JSON.parse(fs.readFileSync(passagesPath, 'utf8'));
} catch (e) {
  console.error('Failed to load reading passages', e);
}

// @desc    Get a random reading passage with questions
// @route   GET /api/reading/passage
// @access  Public (or Private)
exports.getPassage = (req, res, next) => {
  if (passages.length === 0) {
    return res.status(500).json({ success: false, message: 'No passages available' });
  }
  const randomPassage = passages[Math.floor(Math.random() * passages.length)];
  
  // Return passage but strip out correct answers and explanations so client can't cheat
  const sanitizedPassage = {
    id: randomPassage.id,
    title: randomPassage.title,
    content: randomPassage.content,
    questions: randomPassage.questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options
    }))
  };

  res.status(200).json({ success: true, data: sanitizedPassage });
};

// @desc    Submit reading comprehension quiz
// @route   POST /api/reading/submit
// @access  Private
exports.submitReading = async (req, res, next) => {
  try {
    const { passageId, answers } = req.body; 
    // answers is an array: { questionId, selectedOption }

    if (!passageId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid submission format' });
    }

    const passage = passages.find(p => p.id === passageId);
    if (!passage) {
      return res.status(404).json({ success: false, message: 'Passage not found' });
    }

    let correctCount = 0;
    const reviewData = [];

    answers.forEach(ans => {
      const question = passage.questions.find(q => q.id === ans.questionId);
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
      module: 'Reading',
      scoreBreakdown: {
        accuracy: score,
        overall: score
      },
      weakAreas: score < 70 ? ['Comprehension'] : []
    });

    res.status(200).json({
      success: true,
      data: {
        score,
        correctCount,
        total: passage.questions.length,
        review: reviewData,
        resultId: testResult._id
      }
    });
  } catch (error) {
    next(error);
  }
};
