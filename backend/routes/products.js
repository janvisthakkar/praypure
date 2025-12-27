const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFragrances
} = require('../controllers/productController');
const { verifyToken } = require('../controllers/authController');

router.get('/fragrances', getFragrances);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
