const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../authenticate");
const { format } = require("date-fns");

const normalize = (str) => (str || "").toLowerCase().trim();
const normalizeDate = (d) => {
  try {
    // This will format both "2025-08-25" and "2025-08-25T00:00:00.000Z" to "2025-08-25"
    return format(new Date(d), "yyyy-MM-dd");
  } catch {
    return null;
  }
};

// POST /track - Add event to user's tracked events
router.post("/track", authenticate, async (req, res) => {
  const { event } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found." });
        const isAlreadyTracked = user.trackedEvents.some(
            (e) =>
            normalize(e.eventName) === normalize(event.eventName) &&
            normalizeDate(e.date) === normalizeDate(event.date) &&
            normalize(e.sport) === normalize(event.sport)
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


// SOLVED: Corrected DELETE /track route
router.delete("/track", authenticate, async (req, res) => {
  const { event } = req.body;

  // Basic validation: date and sport are the absolute minimum for a lookup.
  if (!event || !event.date || !event.sport) {
    return res.status(400).json({ message: "Missing required event fields (date, sport)." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const initialLength = user.trackedEvents.length;
    const eventDateToUntrack = normalizeDate(event.date);
    const eventSportToUntrack = normalize(event.sport);
    const eventNameToUntrack = normalize(event.eventName);

    // Filter the trackedEvents array. Keep an item only if it's NOT a match.
    user.trackedEvents = user.trackedEvents.filter(e => {
      // Condition for an item to BE the one we want to remove
      const isMatch =
        normalizeDate(e.date) === eventDateToUntrack &&
        normalize(e.sport) === eventSportToUntrack &&
        // AND one of the following must be true:
        (
          // 1. The event being untracked has no name (unlikely now, but safe)
          !eventNameToUntrack ||
          // 2. The event stored in the DB has no name (this is our "legacy" case)
          !e.eventName ||
          // 3. Both have names and they match
          normalize(e.eventName) === eventNameToUntrack
        );

      // Return `false` for the matched item to remove it, and `true` for all others to keep them.
      return !isMatch;
    });

    if (user.trackedEvents.length === initialLength) {
      console.log("Debug: Event not found for untracking, even with new logic.", { event, trackedEvents: user.trackedEvents });
      return res.status(404).json({ message: "Event not found in tracked list." });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Event untracked successfully.", trackedEvents: user.trackedEvents });
      
  } catch (error) {
    console.error("Untrack error:", error);
    res.status(500).json({ message: "Server error while untracking event." });
  }
});


module.exports = router;