const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        default: 'website-footer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
