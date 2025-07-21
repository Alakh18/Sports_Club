const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication fields (existing)
  admission: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile fields (new additions)
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  profileImage: { type: String }, // Will store URL if using Cloudinary
  achievements: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Keep your existing password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to update profile without affecting auth fields
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