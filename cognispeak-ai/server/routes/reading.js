const express = require('express');
const { getPassage, submitReading } = require('../controllers/readingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/passage', getPassage);
router.post('/submit', protect, submitReading);

module.exports = router;
