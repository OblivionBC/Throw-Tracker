const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully for user:", user);
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Optional auth middleware for routes that can work with or without authentication
const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    // Clear invalid token
    res.clearCookie("token");
    return next(); // Continue without authentication
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
