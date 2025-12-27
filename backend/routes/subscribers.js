const express = require('express');
const router = express.Router();
const {
    subscribe,
    getAllSubscribers,
    unsubscribe,
    deleteSubscriber,
    toggleStatus
} = require('../controllers/subscriberController');
const { verifyToken } = require('../controllers/authController');

router.post('/', subscribe);
router.get('/', verifyToken, getAllSubscribers);
router.post('/unsubscribe', unsubscribe);
router.patch('/:id/toggle', verifyToken, toggleStatus);
router.delete('/:id', verifyToken, deleteSubscriber);

module.exports = router;
