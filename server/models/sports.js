const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: String,
  date: Date,
  time: String,
  location: String,
  eligibility: String,
  description: String,
  trackedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const galleryImageSchema = new mongoose.Schema({
  image: String,
  caption: String
});

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gallery: [galleryImageSchema],
  events: [eventSchema]
}, { timestamps: true });

module.exports = mongoose.model("Sport", sportSchema);
