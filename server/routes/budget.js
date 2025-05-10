const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authenticate } = require('../middleware/authMiddleware');
router.post('/createBudget', authenticate, budgetController.createBudget);
router.get('/getBudgets', authenticate, budgetController.getBudgets);


module.exports = router;
