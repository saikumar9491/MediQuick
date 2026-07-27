const TestResult = require('../models/TestResult');

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const results = await TestResult.find({ userId: req.user._id });

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          overallScore: 0,
          categoryScores: {},
          weakAreas: []
        }
      });
    }

    // Aggregate scores
    const categoryTotals = {};
    const categoryCounts = {};
    let totalScore = 0;
    let totalModules = 0;

    results.forEach(result => {
      // Calculate average score for the result's module based on scoreBreakdown
      let moduleScoreSum = 0;
      let moduleScoreCount = 0;
      for (const [key, value] of result.scoreBreakdown) {
        moduleScoreSum += value;
        moduleScoreCount += 1;
      }
      const moduleAvg = moduleScoreCount > 0 ? moduleScoreSum / moduleScoreCount : 0;

      if (!categoryTotals[result.module]) {
        categoryTotals[result.module] = 0;
        categoryCounts[result.module] = 0;
      }
      
      categoryTotals[result.module] += moduleAvg;
      categoryCounts[result.module] += 1;

      totalScore += moduleAvg;
      totalModules += 1;
    });

    const categoryScores = {};
    const weakAreas = [];

    for (const module in categoryTotals) {
      const avg = categoryTotals[module] / categoryCounts[module];
      categoryScores[module] = Math.round(avg);
      if (avg < 80) {
        weakAreas.push(module);
      }
    }

    const overallScore = totalModules > 0 ? Math.round(totalScore / totalModules) : 0;

    res.status(200).json({
      success: true,
      data: {
        overallScore,
        categoryScores,
        weakAreas
      }
    });
  } catch (error) {
    next(error);
  }
};
