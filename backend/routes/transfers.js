const express = require('express');
const router = express.Router();
const Transfer = require('../models/transfer');
const Asset = require('../models/asset');
const { auth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { assetId, fromBase, toBase, quantity } = req.body;

        if (req.user.role !== 'Admin' && req.user.base !== fromBase) {
            return res.status(403).json({ message: 'You can only transfer from your base.' });
        }

        const sourceAsset = await Asset.findOne({ _id: assetId, base: fromBase });
        if (!sourceAsset) {
            return res.status(404).json({ message: 'Asset not found in origin base.' });
        }
        if (sourceAsset.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity to transfer.' });
        }

        sourceAsset.quantity -= Number(quantity);
        await sourceAsset.save();

        let destAsset = await Asset.findOne({ assetName: sourceAsset.assetName, base: toBase });
        if (destAsset) {
            destAsset.quantity += Number(quantity);
            await destAsset.save();
        } else {
            destAsset = new Asset({
                assetName: sourceAsset.assetName,
                category: sourceAsset.category,
                base: toBase,
                quantity: Number(quantity)
            });
            await destAsset.save();
        }

        const newTransfer = new Transfer({
            asset: assetId,
            fromBase,
            toBase,
            quantity,
            recordedBy: req.user.id
        });

        await newTransfer.save();

        res.status(201).json({ message: 'Transfer successful.', transfer: newTransfer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query = { $or: [{ fromBase: req.user.base }, { toBase: req.user.base }] };
        }
        const transfers = await Transfer.find(query).populate('recordedBy', 'username').populate('asset', 'assetName category');
        res.json(transfers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
