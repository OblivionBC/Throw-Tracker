const express = require("express");
const app = express();
const cors = require("cors");

const { pool } = require("./db.js");

//Middleware
app.use(cors());
app.use(express.json());

// Importing the transactions router module
const transactionsRouter = require("./routes/transactions.js");
app.use("/api", transactionsRouter);

app.listen(5000, () => {
  try {
    console.log("Listening on Port 5000");
  } catch (err) {
    console.log(err.message);
  }
});
