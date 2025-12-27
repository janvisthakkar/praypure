const Product = require('../models/Product');

// Get all products
// Get all products with Filtering, Sorting, and Pagination
exports.getAllProducts = async (req, res) => {
    try {
        let { category, fragrance, minPrice, maxPrice, sort, page, limit } = req.query;

        // 1. Filtering
        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (fragrance) filter.fragrance = fragrance;

        // By default, only show active products unless specified
        if (req.query.includeInactive !== 'true') {
            filter.isActive = true;
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // 2. Sorting
        let sortOption = { createdAt: -1 }; // Default: Newest first
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }

        // 3. Pagination
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 12; // Default 12 per page
        const skip = (pageNum - 1) * limitNum;

        // Execute Query
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate('updatedBy', 'username');

        // Get Total Count for Pagination
        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            count: products.length,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum
            },
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body, updatedBy: req.admin.id };
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.admin.id };
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('updatedBy', 'username');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
    }
};

// Get distinct fragrances for a category
exports.getFragrances = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};

        // If category is provided and not 'All', filter by it
        if (category && category !== 'All') {
            filter.category = category;
        }

        // Get distinct fragrances where fragrance field exists and is not empty
        const fragrances = await Product.distinct('fragrance', {
            ...filter,
            isActive: true,
            fragrance: { $ne: null, $ne: '' }
        });

        res.json({
            success: true,
            data: fragrances.sort()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

