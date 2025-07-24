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
    createdAt: { type: Date, default: Date.now } // This is also automatically handled by `timestamps: true`
}, { timestamps: true }); // Add timestamps option for createdAt and updatedAt

// Keep your existing password hashing middleware - CORRECTED
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt and then hash the password
    const salt = await bcrypt.genSalt(10); // Await the salt generation
    this.password = await bcrypt.hash(this.password, salt); // Await the hashing
    next();
});

// Add method to update profile without affecting auth fields
userSchema.methods.updateProfile = async function(profileData) {
    // Also include 'department' and 'year' here if they are intended to be updatable,
    // as they were present in your previous server code's update logic suggestion.
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'achievements', 'department', 'year'];
    allowedUpdates.forEach(field => {
        if (profileData[field] !== undefined) {
            this[field] = profileData[field];
        }
    });
    return this.save();
};

module.exports = mongoose.model("User", userSchema);