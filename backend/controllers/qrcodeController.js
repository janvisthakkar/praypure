const asyncHandler = require('express-async-handler');
const QRCode = require('../models/QRCode');

// @desc    Get all QR codes
// @route   GET /api/qrcodes
// @access  Private
exports.getQRCodes = asyncHandler(async (req, res) => {
    const qrcodes = await QRCode.find().sort({ createdAt: -1 });
    res.json({
        success: true,
        data: qrcodes
    });
});

// @desc    Create a QR code
// @route   POST /api/qrcodes
// @access  Private
exports.createQRCode = asyncHandler(async (req, res) => {
    const qrcode = await QRCode.create(req.body);
    res.status(201).json({
        success: true,
        data: qrcode
    });
});

// @desc    Update a QR code
// @route   PUT /api/qrcodes/:id
// @access  Private
exports.updateQRCode = asyncHandler(async (req, res) => {
    let qrcode = await QRCode.findById(req.params.id);

    if (!qrcode) {
        res.status(404);
        throw new Error('QR Code not found');
    }

    qrcode = await QRCode.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: qrcode
    });
});

// @desc    Delete a QR code
// @route   DELETE /api/qrcodes/:id
// @access  Private
exports.deleteQRCode = asyncHandler(async (req, res) => {
    const qrcode = await QRCode.findById(req.params.id);

    if (!qrcode) {
        res.status(404);
        throw new Error('QR Code not found');
    }

    await qrcode.deleteOne();

    res.json({
        success: true,
        data: {}
    });
});
