const express = require('express');
const { getSentence, evaluate, getTopic, evaluateTopic } = require('../controllers/speechController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/sentence', getSentence);
router.post('/evaluate', protect, evaluate);

router.get('/topic', getTopic);
router.post('/evaluate-topic', protect, evaluateTopic);

module.exports = router;
