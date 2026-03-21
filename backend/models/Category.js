const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Live', 'Coming Soon', 'Invisible'],
        default: 'Live'
    },
    isActive: { // Deprecated: keeping for compatibility during migration
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
