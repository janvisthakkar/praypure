const mongoose = require('mongoose');

const StoreSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: String
}, { timestamps: true });

const { mainDB } = require('../config/db');
module.exports = mainDB.model('StoreSetting', StoreSettingSchema);
