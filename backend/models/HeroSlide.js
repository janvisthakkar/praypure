const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },

    image: {
        type: String,
        required: true
    },
    amazonLink: {
        type: String,
        default: ''
    },
    flipkartLink: {
        type: String,
        default: ''
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

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
