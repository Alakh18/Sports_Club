const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../authenticate");

// POST /track - Add event to user's tracked events
router.post("/track", authenticate, async (req, res) => {
  const { event } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const isAlreadyTracked = user.trackedEvents.some(
      (e) =>
        e.eventName === event.eventName &&
        e.date === event.date &&
        e.sport === event.sport
    );

    if (isAlreadyTracked) {
      return res.status(409).json({ message: "Event already tracked." });
    }

    user.trackedEvents.push(event);
    await user.save();

    res
      .status(200)
      .json({ message: "Event tracked successfully.", trackedEvents: user.trackedEvents });
  } catch (error) {
    console.error("Track error:", error);
    res.status(500).json({ message: "Server error while tracking event." });
  }
});

// DELETE /track - Remove event from user's tracked events
router.delete("/track", authenticate, async (req, res) => {
  const { event } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const initialLength = user.trackedEvents.length;

    user.trackedEvents = user.trackedEvents.filter(
      (e) =>
        !(
          e.eventName === event.eventName &&
          e.date === event.date &&
          e.sport === event.sport
        )
    );

    if (user.trackedEvents.length === initialLength) {
      return res.status(404).json({ message: "Event not found in tracked list." });
    }

    await user.save();

    res.status(200).json({ message: "Event untracked successfully." });
  } catch (error) {
    console.error("Untrack error:", error);
    res.status(500).json({ message: "Server error while untracking event." });
  }
});

module.exports = router;
