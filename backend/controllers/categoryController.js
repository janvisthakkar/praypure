const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const filter = req.query.includeInactive === 'true' ? {} : { isActive: true };
        const categories = await Category.find(filter).sort({ createdAt: 1 }).populate('updatedBy', 'username');
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single category by slug or ID
exports.getCategory = async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: idOrSlug }
            : { slug: idOrSlug };

        const category = await Category.findOne(query).populate('updatedBy', 'username');
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const categoryData = { ...req.body, updatedBy: req.admin.id };
        const category = await Category.create(categoryData);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('updatedBy', 'username');

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
