require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");
const AdminRequest = require("./models/adminrequest.js"); // ⬅️ Import admin request model
const Event = require("./models/Event.js");
const sportRoutes = require('./routes/sportRoutes');
const app = express();
const port = process.env.PORT || 5000;

app.use('/api/sports', sportRoutes);
// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sports-club")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// JWT Secret
const SECRET_KEY = process.env.SECRET_KEY || "your_fallback_secret_key";

// Helper: Generate JWT
function generateJWT(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

// Routes
app.post("/api/auth/signup", async (req, res) => {
  const { admission, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ admission });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password

    const newUser = new User({ 
      admission, 
      email, 
      password
    });

    await newUser.save();

    // Generate token
    const token = generateJWT({ id: newUser._id });

    // Return user data (excluding password)
    const userData = {
      admission: newUser.admission,
      email: newUser.email,
      _id: newUser._id
    };

    res.status(201).json({ 
      token, 
      user: userData 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { admission, password } = req.body;
  
  console.log("\n=== NEW LOGIN ATTEMPT ===");
  console.log("Received credentials:", { admission, password });

  try {
    const user = await User.findOne({ admission });
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Authentication failed" });

    console.log("ℹ️ User found:", {
      admission: user.admission,
      email: user.email,
      hashedPassword: user.password
    });

    

    const token = generateJWT({ id: user._id });
    console.log("✅ Login successful, generated token:", token);
    
    res.status(200).json({
      token,
      user: {
        admission: user.admission,
        email: user.email
      }
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Middleware to protect routes
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// GET current user
app.get("/api/users/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Update user profile
// Update user profile
app.put("/api/users/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

        const { email, password, ...otherProfileData } = req.body;

        // Update profile fields (firstName, lastName, etc.)
        await user.updateProfile(otherProfileData); // uses your custom method

        // Update email if provided
        if (email) {
            user.email = email;
        }

        // Update password if provided
        if (password) {
    user.password = password; // let pre-save hook handle hashing
}


        await user.save(); // triggers pre-save middleware (but we hash manually, so it's safe)

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