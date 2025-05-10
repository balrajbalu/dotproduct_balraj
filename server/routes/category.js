const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/createCategory', authenticate, categoryController.createCategory);
router.post('/getCategories', authenticate, categoryController.getCategories);
router.get('/getCategoriesList', authenticate, categoryController.getCategoriesList);
module.exports = router;