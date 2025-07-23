require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./models/User.js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '10mb' }));


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Atlas connection error:", err));

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

// UPDATE profile
app.put("/api/users/profile", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const updates = { ...req.body };

    // If password is provided, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // Avoid overwriting existing hashed password with blank
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});




app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});