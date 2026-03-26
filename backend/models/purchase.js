const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    assetName: { type: String, required: true },
    category: { type: String, required: true },
    base: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
