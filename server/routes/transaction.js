const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/createTransaction', authenticate, transactionController.createTransaction);
router.post('/getTransaction', authenticate, transactionController.getTransaction);
module.exports = router;
