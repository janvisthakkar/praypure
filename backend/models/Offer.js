const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    couponCode: {
        type: String,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        enum: ['PERCENTAGE', 'FLAT', 'FREE_SHIPPING'],
        default: 'PERCENTAGE'
    },
    value: {
        type: Number,
        required: true
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date
    },
    usageLimit: {
        type: Number
    },
    usedCount: {
        type: Number,
        default: 0
    },
    probability: {
        type: Number,
        default: 0 // 0-100, informational for now
    },
    color: {
        type: String,
        default: '#ffffff' // For future wheel styling
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
