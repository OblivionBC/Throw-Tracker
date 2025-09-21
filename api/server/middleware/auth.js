const jwt = require("jsonwebtoken");

// Production-safe logging
const isDevelopment = process.env.NODE_ENV === 'development';
const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args) // Always log critical errors
};


const requireAuth = (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No access token provided" });
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Verify this is an access token
    if (user.type !== "access") {
      return res.status(403).json({ message: "Invalid token type" });
    }
    req.user = user;
    next();
  } catch (error) {
    Logger.error("JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(403).json({ message: "Invalid access token" });
  }
};

// Optional auth middleware for routes that can work with or without authentication
const optionalAuth = (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return next(); // Continue without authentication
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Verify this is an access token
    if (user.type !== "access") {
      return next(); // Continue without authentication
    }

    req.user = user;
    next();
  } catch (error) {
    Logger.error("JWT verification error:", error.message);
    // Clear invalid token
    res.clearCookie("access_token");
    return next(); // Continue without authentication
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
