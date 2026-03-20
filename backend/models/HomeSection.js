const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
    sectionType: {
        type: String,
        required: true,
        enum: ['collection', 'feature', 'other']
    },
    title: {
        type: String,
        required: true,
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
    link: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: '' // For features like '🌿'
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
        ref: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HomeSection', homeSectionSchema);
