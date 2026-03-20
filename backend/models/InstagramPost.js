const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema({
    media_url: {
        type: String,
        required: [true, 'Please add a media URL']
    },
    permalink: {
        type: String,
        default: 'https://www.instagram.com/praypure.in'
    },
    caption: {
        type: String,
        default: ''
    },
    media_type: {
        type: String,
        enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
        default: 'IMAGE'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InstagramPost', instagramPostSchema);
