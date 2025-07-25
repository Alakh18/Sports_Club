const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  events: [
    {
      eventName: String,
      date: String,
      time: String,
      location: String,
      eligibility: String,
      description: String,
    },
  ],
  gallery: [
    {
      image: String,
      description: String,
    },
  ],
  registration: String,
  eligibility: String,
}, { timestamps: true });

module.exports = mongoose.model("Sport", sportSchema);