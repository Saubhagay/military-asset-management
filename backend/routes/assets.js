const express = require('express');
const router = express.Router();
const Asset = require('../models/asset');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query.base = req.user.base;
        }

        const assets = await Asset.find(query);
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:base', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Admin' && req.user.base !== req.params.base) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const assets = await Asset.find({ base: req.params.base });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
