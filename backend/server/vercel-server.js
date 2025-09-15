const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes/transactions.js");
const errorHandler = require("./middleware/errorHandler");
const {
  validateEnvironment,
  rateLimiters,
  securityHeaders,
  corsConfig,
  requestSizeLimit,
  validateIP,
  securityLogger,
} = require("./middleware/security");

require("dotenv").config();

// Validate environment variables on startup
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error.message);
  // Don't exit in serverless environment, but log the error
}

const app = express();

// Trust proxy for accurate IP addresses (required for Vercel)
app.set("trust proxy", 1);

// Security middleware - must come first
app.use(securityLogger);
app.use(validateIP);
app.use(requestSizeLimit);

// CORS configuration
app.use(cors(corsConfig));

// Handle preflight requests explicitly
app.options("*", cors(corsConfig));

// Rate limiting - always enabled but with different limits
app.use("/api/auth/login", rateLimiters.auth);
app.use("/api/auth/signup", rateLimiters.auth);
app.use("/api/auth/forgot-password", rateLimiters.passwordReset);
app.use("/api/auth/request-otp", rateLimiters.otp);
app.use("/api/auth/verify-otp", rateLimiters.otp);
app.use("/api/auth/reset-password", rateLimiters.passwordReset);

// General rate limiting for all other endpoints
app.use("/api", rateLimiters.general);

// Configure helmet with enhanced security
app.use(
  helmet({
    contentSecurityPolicy: false, // We handle CSP in securityHeaders
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Additional security headers
app.use(securityHeaders);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api", routes);

// Global error handler - must be last
app.use(errorHandler);

// Export for Vercel
module.exports = app;
