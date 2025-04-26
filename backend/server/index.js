const express = require("express");
const app = express();
const cors = require("cors");

const { pool } = require("./db.js");
require("dotenv").config(); // Loading environment variables from a .env file
const PORT = process.env.DB_PORT;
//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing the transactions router module
const transactionsRouter = require("./routes/transactions.js");
app.use("/api", transactionsRouter);
app.listen(3000, () => {
  try {
    console.log("Listening on Port 3000");
  } catch (err) {
    console.log(err.message);
  }
});
