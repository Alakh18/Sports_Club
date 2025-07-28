const express = require("express");
const router = express.Router();
const Sport = require("../models/sports");
// SportsRoutes.js - ADD event to sport
router.post("/:id/events", async (req, res) => { // Re-add authenticate, isAdmin if needed
  try {
    const sportId = req.params.id;
    const eventData = req.body;

    // --- CRITICAL DEBUGGING LINES ---
    console.log("Backend received raw req.body:", req.body);
    console.log("Backend received eventData:", eventData);
    console.log("Type of eventData.date:", typeof eventData.date);
    console.log("Is eventData.eventName defined?", !!eventData.eventName);
    console.log("Is eventData.date defined?", !!eventData.date);
    // ---------------------------------

    const sport = await Sport.findById(sportId);

    if (!sport) {
      return res.status(404).json({ message: "Sport not found" });
    }

    // THIS IS THE CORRECT WAY TO PUSH A SUBDOCUMENT FOR MOONGOSE TO CAST PROPERLY
    sport.events.push(eventData);
    await sport.save();

    res.status(201).json({ message: "Event added successfully", event: sport.events[sport.events.length - 1] });
  } catch (err) {
    console.error("Error adding event to sport:", err);
    // Log detailed Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message, details: err.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});


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

router.put("/:sportId/events/:eventId", async (req, res) => {
  try {
    const { sportId, eventId } = req.params;
    const updatedData = req.body;

    const sport = await Sport.findOneAndUpdate(
      { _id: sportId, "events._id": eventId },
      { $set: { "events.$": updatedData } },
      { new: true }
    );

    if (!sport) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(sport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- 🗓️ EVENT ROUTES ---

// ADD event to sport

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