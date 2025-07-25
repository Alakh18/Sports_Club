const express = require("express");
const router = express.Router();
const Sport = require("../models/sports");


router.get("/", async (req, res) => {
  try {
    const sports = await Sport.find().populate("events.trackedBy", "name email");
    res.status(200).json(sports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single sport by ID
router.get("/:id", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id).populate("events.trackedBy", "name email");
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.status(200).json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- 📸 GALLERY ROUTES ---

// ADD image to sport gallery
router.post("/:id/gallery", async (req, res) => {
  try {
    const { image, caption } = req.body;
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: { image, caption } } },
      { new: true }
    );
    res.status(200).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE image from sport gallery by image ID
router.delete("/:sportId/gallery/:imageId", async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.sportId,
      { $pull: { gallery: { _id: req.params.imageId } } },
      { new: true }
    );
    res.status(200).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --- 🗓️ EVENT ROUTES ---

// ADD event to sport
router.post("/:id/events", async (req, res) => {
  try {
    const event = req.body; // must include name, date, time, location, etc.
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { $push: { events: event } },
      { new: true }
    );
    res.status(200).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE event from sport by event ID
router.delete("/:sportId/events/:eventId", async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(
      req.params.sportId,
      { $pull: { events: { _id: req.params.eventId } } },
      { new: true }
    );
    res.status(200).json(sport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// GET gallery of a specific sport
router.get("/:sportId/gallery", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.sportId).select("name gallery");

    if (!sport) return res.status(404).json({ message: "Sport not found" });

    res.status(200).json({
      sportName: sport.name,
      sportId: sport._id,
      gallery: sport.gallery
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET all events of a specific sport
router.get("/:sportId/events", async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.sportId)
      .select("name events") // only get name + events
      .populate("events.trackedBy", "name email");

    if (!sport) return res.status(404).json({ message: "Sport not found" });

    res.status(200).json({
      sportName: sport.name,
      sportId: sport._id,
      events: sport.events
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router; 