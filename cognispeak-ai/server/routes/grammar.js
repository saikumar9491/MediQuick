const express = require('express');
const { getQuestions, submitQuiz } = require('../controllers/grammarController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/submit', protect, submitQuiz);

module.exports = router;
