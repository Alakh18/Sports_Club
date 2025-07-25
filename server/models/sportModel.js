const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. Cricket
    sections: {
        events: { type: String },
        gallery: [String], // URLs to images
        registration: { type: String },
        eligibility: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model("Sport", sportSchema);