const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "your_fallback_secret_key_please_change_this_in_production"
    );
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
