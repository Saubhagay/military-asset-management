const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const Asset = require('../models/asset');
const { auth, restrictTo } = require('../middleware/auth');

router.post('/', auth, restrictTo('Admin', 'Logistics Officer'), async (req, res) => {
    try {
        const { assetName, category, base, quantity, cost } = req.body;
        
        if (req.user.role !== 'Admin' && req.user.base !== base) {
            return res.status(403).json({ message: 'You can only purchase for your assigned base.' });
        }

        const newPurchase = new Purchase({
            assetName,
            category,
            base,
            quantity,
            cost,
            recordedBy: req.user.id
        });

        await newPurchase.save();

        let asset = await Asset.findOne({ assetName, base });
        if (asset) {
            asset.quantity += Number(quantity);
            await asset.save();
        } else {
            asset = new Asset({
                assetName,
                category,
                base,
                quantity
            });
            await asset.save();
        }

        res.status(201).json({ message: 'Purchase recorded and asset updated.', purchase: newPurchase });
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
        const purchases = await Purchase.find(query).populate('recordedBy', 'username role');
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
