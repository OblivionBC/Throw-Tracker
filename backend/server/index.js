const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes/transactions.js");

const { pool } = require("./db.js");
require("dotenv").config(); // Loading environment variables from a .env file
const PORT = process.env.PORT;

// CORS configuration - must come before other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

// Rate limiting - disabled in development
if (process.env.NODE_ENV !== "development") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // Very high limit for development
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for authentication endpoints
      return (
        req.path.includes("/auth/login") ||
        req.path.includes("/auth/refresh") ||
        req.path.includes("/auth/token-status") ||
        req.path.includes("/auth/logout")
      );
    },
  });

  app.use(limiter);
}

// Configure helmet to work with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5001"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/api", routes);

app
  .listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server startup error:", err);
  });
