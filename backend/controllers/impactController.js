const ImpactItem = require('../models/ImpactItem');

// Get Impact Items (public)
exports.getImpactItems = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: { $ne: false } };
        const items = await ImpactItem.find(filter).sort({ order: 1 }).populate('updatedBy', 'username');
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add Impact Item (admin only)
exports.addImpactItem = async (req, res) => {
    try {
        const itemData = { ...req.body, updatedBy: req.admin.id };
        const item = await ImpactItem.create(itemData);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Impact Item (admin only)
exports.updateImpactItem = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const item = await ImpactItem.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('updatedBy', 'username');
        if (!item) {
            return res.status(404).json({ success: false, message: 'Impact item not found' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Impact Item (admin only)
exports.deleteImpactItem = async (req, res) => {
    try {
        const item = await ImpactItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Impact item not found' });
        }
        res.json({ success: true, message: 'Impact item deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
