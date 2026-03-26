const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetName: { type: String, required: true },
    category: { type: String, required: true }, // e.g. Vehicle, Weapon, Ammunition
    base: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'Active' }
});

module.exports = mongoose.model('Asset', assetSchema);
