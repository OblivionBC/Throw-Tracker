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

//Middleware
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5001",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app
  .listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server startup error:", err);
  });
