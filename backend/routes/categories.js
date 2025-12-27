const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { verifyToken } = require('../controllers/authController');

router.get('/', getAllCategories);
router.get('/:idOrSlug', getCategory);

// Protected routes
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;
