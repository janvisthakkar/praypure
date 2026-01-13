const mongoose = require('mongoose');

const qrcodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the QR code'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'Please add a target URL'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['packaging', 'social', 'feedback', 'other'],
        default: 'other'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QRCode = mongoose.model('QRCode', qrcodeSchema);

module.exports = QRCode;
