const express = require('express');
const router = express.Router();
const {
    getImpactItems,
    addImpactItem,
    updateImpactItem,
    deleteImpactItem
} = require('../controllers/impactController');
const { verifyToken } = require('../controllers/authController');

router.get('/', getImpactItems);
router.post('/', verifyToken, addImpactItem);
router.put('/:id', verifyToken, updateImpactItem);
router.delete('/:id', verifyToken, deleteImpactItem);

module.exports = router;
