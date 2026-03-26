const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    base: { type: String, required: true },
    assignedTo: { type: String, required: true }, // e.g. a specific unit or person
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
