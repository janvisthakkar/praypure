const asyncHandler = require('express-async-handler');
const StoreSetting = require('../models/StoreSetting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    const settings = await StoreSetting.find({});
    // Transform array to object for easier frontend access: { hidePrices: true, ... }
    const settingsMap = {};
    settings.forEach(s => {
        settingsMap[s.key] = s.value;
    });
    res.json({ success: true, data: settingsMap });
});

// @desc    Update a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    let setting = await StoreSetting.findOne({ key });

    if (setting) {
        setting.value = value;
        await setting.save();
        res.json({ success: true, data: { [setting.key]: setting.value } });
    } else {
        // Create if not exists
        setting = await StoreSetting.create({ key, value });
        res.status(201).json({ success: true, data: { [setting.key]: setting.value } });
    }
});

module.exports = {
    getSettings,
    updateSetting
};
