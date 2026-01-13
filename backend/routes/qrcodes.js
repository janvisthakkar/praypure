const express = require('express');
const router = express.Router();
const {
    getQRCodes,
    createQRCode,
    updateQRCode,
    deleteQRCode
} = require('../controllers/qrcodeController');
// No auth middleware found in subdirectories, will implement simple protection or check auth controller
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getQRCodes)
    .post(protect, admin, createQRCode);

router.route('/:id')
    .put(protect, admin, updateQRCode)
    .delete(protect, admin, deleteQRCode);

module.exports = router;
