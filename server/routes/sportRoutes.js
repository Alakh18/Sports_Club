// server/routes/sportRoutes.js
const express = require('express');
const router = express.Router();
const Sport = require('../models/sportModel');

// GET sport by name
router.get('/:name', async (req, res) => {
    try {
        const sport = await Sport.findOne({ name: req.params.name });
        if (!sport) return res.status(404).json({ message: "Sport not found" });
        res.json(sport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// OPTIONAL: POST new sport (admin-only in future)
router.post('/', async (req, res) => {
    try {
        const sport = new Sport(req.body);
        await sport.save();
        res.status(201).json(sport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
