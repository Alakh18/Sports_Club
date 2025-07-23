require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");
const AdminRequest = require("./models/adminrequest.js"); // ⬅️ Import admin request model
const Event = require("./models/Event.js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
    app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // To parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sports-club")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// JWT Secret
const SECRET_KEY = process.env.SECRET_KEY || "your_fallback_secret_key_please_change_this_in_production"; // Use a strong, random key in .env

// Helper: Generate JWT
function generateJWT(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
}

// Middleware to protect routes (Authentication)
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id; // Attach user ID from token to request
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error("JWT verification error:", err); // Log the actual error for debugging
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

// Admin check middleware (Authorization)
function isAdmin(req, res, next) {
    // Find user by ID attached by the 'authenticate' middleware
    User.findById(req.userId).then(user => {
        if (!user || user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden: Admin access required" });
        }
        next(); // User is an admin, proceed
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
        // Check if user with this admission already exists
        const existingUser = await User.findOne({ admission });
        if (existingUser) {
            return res.status(409).json({ error: "User with this admission number already exists" });
        }

        // Create new user (password hashing is handled in User model pre-save hook)
        const newUser = new User({ admission, email, password });
        await newUser.save();

        // Generate JWT for the new user
        const token = generateJWT({ id: newUser._id });

        // Prepare user data for response (exclude password)
        const userData = {
            admission: newUser.admission,
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role
        };

        res.status(201).json({ token, user: userData }); // Return token and user data
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error during signup" });
    }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
    const { admission, password } = req.body;

    try {
        // Find user by admission number
        const user = await User.findOne({ admission });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Authentication failed: Incorrect password" });

        // Generate JWT
        const token = generateJWT({ id: user._id });

        res.status(200).json({
            token,
            user: {
                admission: user.admission,
                email: user.email,
                role: user.role // Include role for frontend to determine permissions
            }
        });
    } catch (err) {
        console.error("🔥 Login error:", err);
        res.status(500).json({ error: "Internal server error during login" });
    }
});

// Get authenticated user details (for checking session on load)
app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user }); // Return user object nested under 'user' key
    } catch (err) {
        console.error("Error fetching /api/auth/me:", err);
        res.status(401).json({ error: "Invalid token or server error" });
    }
});

// User Logout (simply acknowledges client should clear token)
app.post("/api/auth/logout", (req, res) => {
    // On the backend, logout is often just an acknowledgment.
    // The actual token invalidation happens client-side by removing the token.
    res.status(200).json({ message: "Logged out successfully" });
});

// --- User Profile Routes ---

// Get current user's profile data
// This is the preferred route for frontend to fetch logged-in user details
app.get("/api/users/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user); // Return user object directly (not nested)
    } catch (err) {
        console.error("Error fetching /api/users/me:", err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

// Update user profile
app.put("/api/users/profile", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { email, password } = req.body;

        if (email) {
            user.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        const updatedUser = await User.findById(req.userId).select("-password");
        res.json(updatedUser);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});


// =======================================
// 🆕 ADMIN REQUEST SYSTEM STARTS HERE
// =======================================

// ✉️ User requests admin access
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

// 👁️ Admin views all admin requests
app.get("/api/admin/requests", authenticate, isAdmin, async (req, res) => {
    try {
        // <<<<<<<<<<<<<<<<<<<<<<<< THE CRITICAL CHANGE IS HERE >>>>>>>>>>>>>>>>>>>>>>>>>>
        // ONLY FETCH REQUESTS THAT HAVE A 'PENDING' STATUS
        const requests = await AdminRequest.find({ status: 'pending' }) // <-- Added the filter!
            .populate("user", "admission email role")
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(requests); // This will return an empty array if no pending requests exist
    } catch (err) {
        console.error("Error fetching admin requests:", err);
        res.status(500).json({ error: "Failed to fetch admin requests" });
    }
});

// ✅ Admin approves request & promotes user
app.put("/api/admin/requests/approve/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const request = await AdminRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Admin request not found" });

        // Update user's role to 'admin'
        const user = await User.findByIdAndUpdate(request.user, { role: 'admin' }, { new: true });
        if (!user) return res.status(404).json({ error: "Associated user not found" });

        // Update request status to 'approved'
        request.status = "approved";
        await request.save();

        res.json({ message: `${user.admission} is now an admin. Request approved.` });
    } catch (err) {
        console.error("Error approving admin request:", err);
        res.status(500).json({ error: "Failed to approve request" });
    }
});

// ❌ Admin rejects request (deletes the request)
app.delete("/api/admin/requests/reject/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const request = await AdminRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Admin request not found" });

        // Delete the request from the database
        await request.deleteOne();

        res.json({ message: "Request rejected and deleted successfully" });
    } catch (err) {
        console.error("Error rejecting admin request:", err);
        res.status(500).json({ error: "Failed to reject request" });
    }
});

// =======================================

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Simple test route
app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});