const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public: Submit feedback
router.post('/', submitFeedback);

// Admin only
router.get('/', protect, getAllFeedback);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
