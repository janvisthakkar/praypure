const mongoose = require('mongoose');

const impactItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: [true, 'Please add an image']
    },
    category: {
        type: String,
        enum: ['donation', 'community', 'temple', 'ritual'],
        default: 'donation'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ImpactItem', impactItemSchema);
