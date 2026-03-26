const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    fromBase: { type: String, required: true },
    toBase: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transfer', transferSchema);
