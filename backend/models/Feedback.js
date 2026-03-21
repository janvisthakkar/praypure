const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    product: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    experience: { type: String, default: '' },
    message: { type: String, default: '' },
    recommend: { type: String, enum: ['Yes, absolutely!', 'Maybe', 'Not this time', ''], default: '' },
    source: { type: String, default: 'qr-box-scan' },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
