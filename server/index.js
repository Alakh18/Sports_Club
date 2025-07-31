const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("./models/User.js");
const AdminRequest = require("./models/adminrequest.js");
const sportRoutes = require("./Routes/SportsRoutes.js");

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://sports-club.onrender.com/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization","authToken"]
}));

app.use("/api/sports", sportRoutes);

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({ origin: "https://sports-club.onrender.com", credentials: true }));

// Middleware

// JSON body parser with 10MB limit
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/sports', sportRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sports-club", {

})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// JWT Secret
const SECRET_KEY = process.env.SECRET_KEY || "your_fallback_secret_key_please_change_this_in_production";

// Helper: Generate JWT
function generateJWT(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

// Middleware to protect routes (Authentication)
const authenticate = require("./authenticate");

// Admin check middleware (Authorization)
function isAdmin(req, res, next) {
    User.findById(req.userId).then(user => {
        if (!user || user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden: Admin access required" });
        }
        next();
    }).catch(err => {
        console.error("Error checking admin role:", err);
        res.status(500).json({ error: "Server error while checking role" });
    });
}

// --- Auth Routes ---

// User Signup
app.post("/api/auth/signup", async (req, res) => {
    const { admission, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ admission });
        if (existingUser) {
            return res.status(409).json({ error: "User with this admission number already exists" });
        }

        const newUser = new User({ admission, email, password });
        await newUser.save();

        const token = generateJWT({ id: newUser._id });

        const userData = {
            admission: newUser.admission,
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role
        };

        res.status(201).json({ token, user: userData });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error during signup" });
    }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
    const { admission, password } = req.body;

    try {
        const user = await User.findOne({ admission });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Authentication failed: Incorrect password" });

        const token = generateJWT({ id: user._id });

        res.status(200).json({
            token,
            user: {
                admission: user.admission,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("🔥 Login error:", err);
        res.status(500).json({ error: "Internal server error during login" });
    }
});

// Get authenticated user
app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (err) {
        console.error("Error fetching /api/auth/me:", err);
        res.status(401).json({ error: "Invalid token or server error" });
    }
});

// User Logout
app.post("/api/auth/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
});

// --- User Profile Routes ---
app.get("/api/users/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching /api/users/me:", err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.put("/api/users/profile", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { email, password, ...otherProfileData } = req.body;

        await user.updateProfile(otherProfileData);

        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        const updatedUser = await User.findById(req.userId).select("-password");
        res.json(updatedUser);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// --- ADMIN REQUEST SYSTEM ---

app.post("/api/request-admin", authenticate, async (req, res) => {
    const { reason } = req.body;

    try {
        const existing = await AdminRequest.findOne({ user: req.userId });
        if (existing) {
            return res.status(400).json({ error: "Request already submitted" });
        }

        const request = new AdminRequest({ user: req.userId, reason });
        await request.save();

        res.status(201).json({ message: "Admin request submitted successfully" });
    } catch (err) {
        console.error("Admin request error:", err);
        res.status(500).json({ error: "Server error during admin request submission" });
    }
});

app.get("/api/admin/requests", authenticate, isAdmin, async (req, res) => {
    try {
        const requests = await AdminRequest.find({ status: 'pending' })
            .populate("user", "admission email role")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error("Error fetching admin requests:", err);
        res.status(500).json({ error: "Failed to fetch admin requests" });
    }
});

app.put("/api/admin/requests/approve/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const request = await AdminRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Admin request not found" });

        const user = await User.findByIdAndUpdate(request.user, { role: 'admin' }, { new: true });
        if (!user) return res.status(404).json({ error: "Associated user not found" });

        request.status = "approved";
        await request.save();

        res.json({ message: `${user.admission} is now an admin. Request approved.` });
    } catch (err) {
        console.error("Error approving admin request:", err);
        res.status(500).json({ error: "Failed to approve request" });
    }
});

app.put("/api/admin/requests/reject/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const request = await AdminRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Admin request not found" });

        request.status = "rejected";
        await request.save();

        res.json({ message: "Request rejected successfully." });
    } catch (err) {
        console.error("Error rejecting admin request:", err);
        res.status(500).json({ error: "Failed to reject request" });
    }
});

// --- Test Route ---
app.get("/api/message", (_ , res) => {
    res.json({ message: "Hello from the backend!" });
});

const trackRoutes = require('./Routes/trackroute');
app.use('/api', trackRoutes);

// ✅ Export middleware for external use (like in trackroute.js)
module.exports = { authenticate };

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
