const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/createUser', userController.createUser);
router.post('/login', authController.loginUser);
router.get('/checkUserRole',authenticate, authController.checkUserRole);


module.exports = router;
