const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/getSummary', authenticate, summaryController.getSummary);
router.get('/getOverview', authenticate, summaryController.getOverview);
router.get('/getCategory', authenticate, summaryController.getCategory);
module.exports = router;