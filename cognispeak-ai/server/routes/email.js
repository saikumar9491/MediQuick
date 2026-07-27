const express = require('express');
const { getScenario, evaluateEmailWriting } = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/scenario', getScenario);
router.post('/evaluate', protect, evaluateEmailWriting);

module.exports = router;
