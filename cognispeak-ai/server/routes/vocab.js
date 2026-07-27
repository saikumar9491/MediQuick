const express = require('express');
const { getDailyWords, evaluateWord } = require('../controllers/vocabController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/daily', getDailyWords);
router.post('/evaluate', protect, evaluateWord);

module.exports = router;
