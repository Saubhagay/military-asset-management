const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment');
const Asset = require('../models/asset');
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { assetId, base, assignedTo, quantity } = req.body;

        if (req.user.role !== 'Admin' && req.user.base !== base) {
            return res.status(403).json({ message: 'You can only assign assets from your base.' });
        }

        const asset = await Asset.findOne({ _id: assetId, base });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found.' });
        }
        if (asset.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity to assign.' });
        }

        asset.quantity -= Number(quantity);
        await asset.save();

        const newAssignment = new Assignment({
            asset: assetId,
            base,
            assignedTo,
            quantity,
            recordedBy: req.user.id
        });

        await newAssignment.save();

        res.status(201).json({ message: 'Asset assigned successfully.', assignment: newAssignment });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query.base = req.user.base;
        }
        const assignments = await Assignment.find(query).populate('recordedBy', 'username').populate('asset', 'assetName category');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
