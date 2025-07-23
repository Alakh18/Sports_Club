const mongoose = require('mongoose');

const adminRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Prevent multiple requests per user
  },
  reason: {
    type: String,
    required: [true, "Please provide a reason for admin access"],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("AdminRequest", adminRequestSchema);
