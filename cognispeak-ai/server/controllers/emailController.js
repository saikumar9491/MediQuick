const { evaluateEmail } = require('../services/openaiService');
const TestResult = require('../models/TestResult');

const scenarios = [
  "Write an email to your manager requesting two days of leave for a family emergency.",
  "Write an email to a client apologizing for a one-week delay in delivering their project.",
  "Write an email to your team proposing a new weekly sync meeting to discuss blockers.",
  "Write an email to IT support reporting that your laptop screen is flickering."
];

// @desc    Get a random email scenario
// @route   GET /api/email/scenario
// @access  Public (or Private)
exports.getScenario = (req, res, next) => {
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  res.status(200).json({ success: true, data: { text: randomScenario } });
};

// @desc    Evaluate written email
// @route   POST /api/email/evaluate
// @access  Private
exports.evaluateEmailWriting = async (req, res, next) => {
  try {
    const { scenario, emailText } = req.body;

    if (!scenario || !emailText) {
      return res.status(400).json({ success: false, message: 'Missing scenario or email text' });
    }

    const wordCount = emailText.trim().split(/\s+/).length;
    if (wordCount < 50 || wordCount > 150) {
      return res.status(400).json({ 
        success: false, 
        message: `Word count must be between 50 and 150 words. Current count: ${wordCount}` 
      });
    }

    const aiFeedback = await evaluateEmail(scenario, emailText);

    // Save to DB
    const testResult = await TestResult.create({
      userId: req.user._id,
      module: 'Email Writing',
      scoreBreakdown: {
        grammarScore: aiFeedback.grammarIssues?.length === 0 ? 100 : Math.max(0, 100 - (aiFeedback.grammarIssues?.length * 10 || 0)),
        relevanceScore: 100, // Hardcoded part, overallScore comes from AI
        overall: aiFeedback.overallScore || 80
      },
      weakAreas: aiFeedback.overallScore < 70 ? ['Professional Writing'] : []
    });

    res.status(200).json({
      success: true,
      data: {
        wordCount,
        aiRubric: aiFeedback,
        resultId: testResult._id
      }
    });
  } catch (error) {
    next(error);
  }
};
