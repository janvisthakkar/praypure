const Subscriber = require('../models/Subscriber');

// Subscribe email
exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            if (existing.isActive) {
                return res.status(400).json({ success: false, message: 'Email already subscribed' });
            } else {
                // Reactivate subscription
                existing.isActive = true;
                await existing.save();
                return res.json({ success: true, message: 'Subscription reactivated', data: existing });
            }
        }

        const subscriber = await Subscriber.create({ email });
        res.status(201).json({ success: true, message: 'Successfully subscribed', data: subscriber });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json({ success: true, count: subscribers.length, data: subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unsubscribe
exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const subscriber = await Subscriber.findOneAndUpdate(
            { email },
            { isActive: false },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        res.json({ success: true, message: 'Successfully unsubscribed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Toggle status (Active/Inactive)
exports.toggleStatus = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        subscriber.isActive = !subscriber.isActive;
        await subscriber.save();

        res.json({
            success: true,
            message: `Subscriber marked as ${subscriber.isActive ? 'active' : 'inactive'}`,
            data: subscriber
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Permanent delete
exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }
        res.json({ success: true, message: 'Subscriber deleted permanently' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
