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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // only hash if password is modified

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});


// Add method to update profile without affecting auth fields
userSchema.methods.updateProfile = async function(profileData) {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'profileImage', 'achievements', 'department', 'year', 'password'];
    for (const field of allowedUpdates) {
        if (profileData[field] !== undefined) {
            if (field === 'password') {
                const salt = await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(profileData.password, salt);
            } else {
                this[field] = profileData[field];
            }
        }
    }
    return this.save();
};


module.exports = mongoose.model("User", userSchema);