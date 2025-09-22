const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

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


const validateEnvironment = () => {
    const required = [
        "JWT_SECRET",
        "DB_HOST",
        "DB_NAME",
        "DB_USER",
        "DB_USER_PASS",
        "DB_PORT",
    ];
    const missing = required.filter((env) => !process.env[env]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
    }

    if (process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
    }

    const validEnvs = ["development", "production", "test"];
    if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
        Logger.warn(
            `Warning: NODE_ENV is set to '${
                process.env.NODE_ENV
            }'. Valid values are: ${validEnvs.join(", ")}`
        );
    }
};

const createRateLimiter = (
    windowMs,
    max,
    message,
    skipSuccessfulRequests = false
) => {
    return rateLimit({
        windowMs,
        max,
        message: {error: message},
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // fallback for local dev where req.ip might be undefined
            return ipKeyGenerator(req);
        },
        skipSuccessfulRequests,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                error: {
                    message,
                    code: "RATE_LIMIT_EXCEEDED",
                    retryAfter: Math.ceil(windowMs / 1000),
                },
            });
        },
    });
};

// Different rate limiters for different endpoints
const rateLimiters = {
    // General API rate limiting
    general: createRateLimiter(
        15 * 60 * 1000, // 15 minutes
        process.env.NODE_ENV === "production" ? 100 : 1000, // 100 requests per 15 min in prod
        "Too many requests from this IP, please try again later."
    ),

    // Strict rate limiting for authentication endpoints
    auth: createRateLimiter(
        15 * 60 * 1000, // 15 minutes
        5, // Only 5 login attempts per 15 minutes
        "Too many authentication attempts, please try again later.",
        true // Don't count successful requests
    ),

    // Very strict rate limiting for password reset
    passwordReset: createRateLimiter(
        60 * 60 * 1000, // 1 hour
        3, // Only 3 password reset attempts per hour
        "Too many password reset attempts, please try again in an hour."
    ),

    // Strict rate limiting for OTP requests
    otp: createRateLimiter(
        60 * 60 * 1000, // 1 hour
        5, // Only 5 OTP requests per hour
        "Too many OTP requests, please try again in an hour."
    ),
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Remove server information
    res.removeHeader("X-Powered-By");

    // Additional security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
    );

    // Content Security Policy
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; ");

    res.setHeader("Content-Security-Policy", csp);

    next();
};

const corsConfig = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const frontendUrl = process.env.FRONTEND_URL
        Logger.log(frontendUrl);
        const allowedOrigins = frontendUrl
            ? [frontendUrl, "https://throw-tracker-4ocoiahrh-connors-projects-5e27ef17.vercel.app", "https://throwspace.app"]
            : ["http://localhost:3000", "http://localhost:5001", "https://throw-tracker-4ocoiahrh-connors-projects-5e27ef17.vercel.app"];

        if (process.env.NODE_ENV !== "dev" && !frontendUrl) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 86400, // 24 hours
};

// Request size limiting middleware
const requestSizeLimit = (req, res, next) => {
    const contentLength = parseInt(req.headers["content-length"] || "0");
    const maxSize = 1024 * 1024; // 1MB limit

    if (contentLength > maxSize) {
        return res.status(413).json({
            success: false,
            error: {
                message: "Request entity too large",
                code: "PAYLOAD_TOO_LARGE",
            },
        });
    }

    next();
};

// IP validation middleware
const validateIP = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Log suspicious activity
    if (req.path.includes("admin") || req.path.includes("debug")) {
        Logger.warn(`Suspicious request to ${req.path} from IP: ${ip}`);
    }

    next();
};

// Request logging middleware for security monitoring
const securityLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const ip = req.ip || req.connection.remoteAddress;

        // Log failed authentication attempts
        if (req.path.includes("/auth/") && res.statusCode === 401) {
            Logger.warn(`Failed authentication attempt from ${ip} to ${req.path}`);
        }

        // Log slow requests (potential DoS)
        if (duration > 5000) {
            Logger.warn(
                `Slow request: ${req.method} ${req.path} took ${duration}ms from ${ip}`
            );
        }

        // Log large responses (potential data exfiltration)
        const contentLength = res.get("content-length");
        if (contentLength && parseInt(contentLength) > 1024 * 1024) {
            Logger.warn(
                `Large response: ${contentLength} bytes to ${ip} for ${req.path}`
            );
        }
    });

    next();
};

module.exports = {
    validateEnvironment,
    rateLimiters,
    securityHeaders,
    corsConfig,
    requestSizeLimit,
    validateIP,
    securityLogger,
};
