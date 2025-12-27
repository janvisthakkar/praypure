const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true // Changed from strict enum to indexed string for flexibility
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    mrp: {
        type: Number,
        required: true,
        min: 0
    },
    // Backward compatibility: maintain single image field
    image: {
        type: String,
        default: ''
    },
    // New: Gallery support
    images: [{
        url: String,
        altText: String,
        isPrimary: Boolean
    }],
    slug: {
        type: String,
        unique: true,
        sparse: true, // Allow nulls for existing docs
        lowercase: true,
        trim: true,
        index: true
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    marketplaces: [{
        platform: {
            type: String,
            required: true // e.g., 'Amazon', 'Flipkart', 'Zepto'
        },
        url: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        showButton: {
            type: Boolean,
            default: false
        }
    }],
    isNew: {
        type: Boolean,
        default: false
    },
    fragrance: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);