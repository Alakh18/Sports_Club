const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Authentication fields
  admission: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile fields
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  profileImage: { type: String }, // Can hold Cloudinary URL
  achievements: { type: String },
  department: { type: String },
  year: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Tracked events by the user
  trackedEvents: [
    {
      sportId: { type: mongoose.Schema.Types.ObjectId, ref: "Sport" },
      eventId: { type: mongoose.Schema.Types.ObjectId }
    }
  ],

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Password hashing middleware (only hashes if modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Update profile method — no double hashing!
userSchema.methods.updateProfile = async function(profileData) {
  const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'achievements', 'department', 'year', 'password'];
  for (const field of allowedUpdates) {
    if (profileData[field] !== undefined) {
      this[field] = profileData[field]; // Password will be hashed automatically by pre('save')
    }
  }
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
