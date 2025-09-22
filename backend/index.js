require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./server/routes/transactions.js");
const errorHandler = require("./server/middleware/errorHandler");
const {
  validateEnvironment,
  rateLimiters,
  securityHeaders,
  corsConfig,
  requestSizeLimit,
  validateIP,
  securityLogger,
} = require("./server/middleware/security");

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


const { pool } = require("./server/db.js");

// Validate environment variables on startup
validateEnvironment();
app.set('port', (process.env.PORT || 8081));

// Trust proxy for accurate IP addresses (required for Vercel)
app.set("trust proxy", 1);

// Rate limiting - always enabled but with different limits


if (process.env.NODE_ENV === "production") {
    Logger.info("In Production")
    // Security middleware - must come first
    app.use(securityLogger);
    app.use(validateIP);
    app.use(requestSizeLimit);

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
            contentSecurityPolicy: false,
            crossOriginResourcePolicy: {policy: "cross-origin"},
            crossOriginEmbedderPolicy: false,
            hsts: {
                maxAge: 31536000, // 1 year
                includeSubDomains: true,
                preload: true,
            },
        })
    );

    app.use(securityHeaders);
}

// CORS configuration
app.use(cors(corsConfig));

// Handle preflight requests explicitly
app.options("*", cors(corsConfig));


// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api", routes);

// Global error handler - must be last
app.use(errorHandler);

app.listen(app.get('port'), () => {
    Logger.info(`Backend running on port ${app.get('port')}`);
});

module.exports = app;