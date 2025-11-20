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
export const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args)
};

validateEnvironment();
app.set('port', (process.env.PORT || 8081));
app.set("trust proxy", 1);


if (process.env.NODE_ENV === "production") {
    Logger.info("In Production")
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
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
        })
    );

    app.use(securityHeaders);
}

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

app.listen(app.get('port'), () => {
    Logger.info(`Backend running on port ${app.get('port')}`);
});

module.exports = app;