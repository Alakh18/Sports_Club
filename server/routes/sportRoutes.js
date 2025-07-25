const express = require("express");
const router = express.Router();
const Sport = require("../models/sportModel");

// GET all sports (used in Sports.jsx)
router.get("/", async (req, res) => {
  try {
    const sports = await Sport.find();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single sport by ID
router.get("/:id", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET events
router.get("/:id/events", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport.events); // ✅
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET gallery
router.get("/:id/gallery", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport.gallery); // ✅
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
