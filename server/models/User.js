const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication fields
  admission: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile fields
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  profileImage: { type: String },
  achievements: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // New: Tracked events by the user
  trackedEvents: [
    {
      sportId: { type: mongoose.Schema.Types.ObjectId, ref: "Sport" },
      eventId: { type: mongoose.Schema.Types.ObjectId }
    }
  ],

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update profile fields only
userSchema.methods.updateProfile = async function(profileData) {
  const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'achievements', 'department', 'year'];
  allowedUpdates.forEach(field => {
    if (profileData[field] !== undefined) {
      this[field] = profileData[field];
    }
  });
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
