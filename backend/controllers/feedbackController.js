const Feedback = require('../models/Feedback');

// Public: Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, product, rating, experience, message, recommend, source } = req.body;
        if (!name || !product || !rating) {
            return res.status(400).json({ success: false, message: 'Name, product and rating are required.' });
        }
        const feedback = await Feedback.create({ name, email, product, rating, experience, message, recommend, source });
        res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: Get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ submittedAt: -1 });
        res.json({ success: true, count: feedback.length, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Delete feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
        res.json({ success: true, message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
