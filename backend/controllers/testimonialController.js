const Testimonial = require('../models/Testimonial');

// Get all testimonials (Public/Admin)
exports.getTestimonials = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: true };
        const testimonials = await Testimonial.find(filter)
            .sort({ createdAt: -1 })
            .populate('updatedBy', 'username');
        res.json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
    try {
        // req.admin.id from verifyToken
        const data = { ...req.body, updatedBy: req.admin?.id };
        const testimonial = await Testimonial.create(data);
        res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update
exports.updateTestimonial = async (req, res) => {
    try {
        const data = { ...req.body, updatedBy: req.admin?.id };
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true })
            .populate('updatedBy', 'username');
        if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: testimonial });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
